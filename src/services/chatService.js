import { supabase } from "../lib/supabase.js";

/**
 * Chat Service - Handles all team chat operations
 */
export const chatService = {
    /**
     * Get all conversations for a user
     * @param {string} userId - User ID
     * @returns {Promise<{data: Array, error: Error|null}>}
     */
    async getConversations(userId) {
        try {
            // Get direct conversations where user is a participant
            const { data: directConvos, error: directError } = await supabase
                .from("conversations")
                .select(`
                    *,
                    participant1:employees!conversations_participant1_id_fkey(id, first_name, last_name, avatar_url, email),
                    participant2:employees!conversations_participant2_id_fkey(id, first_name, last_name, avatar_url, email)
                `)
                .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
                .eq("type", "direct")
                .order("last_message_at", { ascending: false });

            if (directError) throw directError;

            // Get group conversations where user is a member
            const { data: groupConvos, error: groupError } = await supabase
                .from("conversation_members")
                .select(`
                    conversation:conversations(
                        *,
                        members:conversation_members(
                            employee:employees(id, first_name, last_name, avatar_url)
                        )
                    )
                `)
                .eq("employee_id", userId);

            if (groupError) throw groupError;

            const conversations = [
                ...(directConvos || []).map(c => ({ ...c, conversationType: 'direct' })),
                ...(groupConvos || []).map(m => ({ ...m.conversation, conversationType: 'group' }))
            ].sort((a, b) => new Date(b.last_message_at || b.created_at) - new Date(a.last_message_at || a.created_at));

            return { data: conversations, error: null };
        } catch (error) {
            console.error("Error fetching conversations:", error);
            return { data: [], error };
        }
    },

    /**
     * Get messages for a conversation
     * @param {string} conversationId - Conversation ID
     * @param {number} limit - Number of messages to fetch
     * @param {number} offset - Offset for pagination
     * @returns {Promise<{data: Array, error: Error|null}>}
     */
    async getMessages(conversationId, limit = 50, offset = 0) {
        try {
            const { data, error } = await supabase
                .from("messages")
                .select(`
                    *,
                    sender:employees(id, first_name, last_name, avatar_url)
                `)
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            return { data: (data || []).reverse(), error: null };
        } catch (error) {
            console.error("Error fetching messages:", error);
            return { data: [], error };
        }
    },

    /**
     * Send a message
     * @param {Object} message - Message data
     * @returns {Promise<{data: Object|null, error: Error|null}>}
     */
    async sendMessage({ conversationId, senderId, content, type = "text", attachments = null }) {
        try {
            const { data, error } = await supabase
                .from("messages")
                .insert({
                    conversation_id: conversationId,
                    sender_id: senderId,
                    content,
                    type,
                    attachments,
                })
                .select(`
                    *,
                    sender:employees(id, first_name, last_name, avatar_url)
                `)
                .single();

            if (error) throw error;

            // Update conversation's last_message_at
            await supabase
                .from("conversations")
                .update({
                    last_message_at: new Date().toISOString(),
                    last_message: content.substring(0, 100)
                })
                .eq("id", conversationId);

            return { data, error: null };
        } catch (error) {
            console.error("Error sending message:", error);
            return { data: null, error };
        }
    },

    /**
     * Create a direct conversation
     * @param {string} userId1 - First user ID
     * @param {string} userId2 - Second user ID
     * @returns {Promise<{data: Object|null, error: Error|null}>}
     */
    async createDirectConversation(userId1, userId2) {
        try {
            // Check if conversation already exists
            const { data: existing } = await supabase
                .from("conversations")
                .select("*")
                .eq("type", "direct")
                .or(`and(participant1_id.eq.${userId1},participant2_id.eq.${userId2}),and(participant1_id.eq.${userId2},participant2_id.eq.${userId1})`)
                .maybeSingle();

            if (existing) {
                return { data: existing, error: null };
            }

            const { data, error } = await supabase
                .from("conversations")
                .insert({
                    type: "direct",
                    participant1_id: userId1,
                    participant2_id: userId2,
                })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Error creating conversation:", error);
            return { data: null, error };
        }
    },

    /**
     * Create a group conversation
     * @param {Object} groupData - Group conversation data
     * @returns {Promise<{data: Object|null, error: Error|null}>}
     */
    async createGroupConversation({ name, description, memberIds, createdBy }) {
        try {
            // Create the conversation
            const { data: conversation, error: convError } = await supabase
                .from("conversations")
                .insert({
                    type: "group",
                    name,
                    description,
                    created_by: createdBy,
                })
                .select()
                .single();

            if (convError) throw convError;

            // Add members
            const members = memberIds.map(id => ({
                conversation_id: conversation.id,
                employee_id: id,
                role: id === createdBy ? 'admin' : 'member'
            }));

            const { error: memberError } = await supabase
                .from("conversation_members")
                .insert(members);

            if (memberError) throw memberError;

            return { data: conversation, error: null };
        } catch (error) {
            console.error("Error creating group:", error);
            return { data: null, error };
        }
    },

    /**
     * Mark messages as read
     * @param {string} conversationId - Conversation ID
     * @param {string} userId - User ID
     * @returns {Promise<{error: Error|null}>}
     */
    async markAsRead(conversationId, userId) {
        try {
            const { error } = await supabase
                .from("messages")
                .update({ read_by: supabase.sql`array_append(read_by, ${userId})` })
                .eq("conversation_id", conversationId)
                .not("read_by", "cs", `{${userId}}`);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error("Error marking as read:", error);
            return { error };
        }
    },

    /**
     * Subscribe to new messages in a conversation
     * @param {string} conversationId - Conversation ID
     * @param {Function} callback - Callback for new messages
     * @returns {Object} Subscription object
     */
    subscribeToMessages(conversationId, callback) {
        return supabase
            .channel(`messages:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                async (payload) => {
                    // Fetch full message with sender info
                    const { data } = await supabase
                        .from("messages")
                        .select(`*, sender:employees(id, first_name, last_name, avatar_url)`)
                        .eq("id", payload.new.id)
                        .single();

                    if (data) callback(data);
                }
            )
            .subscribe();
    },

    /**
     * Subscribe to conversation updates
     * @param {string} userId - User ID
     * @param {Function} callback - Callback for updates
     * @returns {Object} Subscription object
     */
    subscribeToConversations(userId, callback) {
        return supabase
            .channel(`conversations:${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "conversations",
                },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();
    },

    /**
     * Get online status of users
     * @param {Array} userIds - Array of user IDs
     * @returns {Promise<{data: Object, error: Error|null}>}
     */
    async getOnlineStatus(userIds) {
        try {
            const { data, error } = await supabase
                .from("user_presence")
                .select("*")
                .in("user_id", userIds);

            if (error) throw error;

            const statusMap = {};
            (data || []).forEach(p => {
                statusMap[p.user_id] = {
                    online: p.online,
                    lastSeen: p.last_seen
                };
            });

            return { data: statusMap, error: null };
        } catch (error) {
            console.error("Error fetching online status:", error);
            return { data: {}, error };
        }
    },

    /**
     * Update user's online status
     * @param {string} userId - User ID
     * @param {boolean} online - Online status
     * @returns {Promise<{error: Error|null}>}
     */
    async updatePresence(userId, online) {
        try {
            const { error } = await supabase
                .from("user_presence")
                .upsert({
                    user_id: userId,
                    online,
                    last_seen: new Date().toISOString()
                });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error("Error updating presence:", error);
            return { error };
        }
    },

    /**
     * Search messages
     * @param {string} query - Search query
     * @param {string} userId - User ID to limit search to their conversations
     * @returns {Promise<{data: Array, error: Error|null}>}
     */
    async searchMessages(query, userId) {
        try {
            const { data, error } = await supabase
                .from("messages")
                .select(`
                    *,
                    sender:employees(id, first_name, last_name),
                    conversation:conversations(id, name, type)
                `)
                .ilike("content", `%${query}%`)
                .order("created_at", { ascending: false })
                .limit(50);

            if (error) throw error;
            return { data: data || [], error: null };
        } catch (error) {
            console.error("Error searching messages:", error);
            return { data: [], error };
        }
    },

    /**
     * Delete a message
     * @param {string} messageId - Message ID
     * @param {string} userId - User ID (for permission check)
     * @returns {Promise<{error: Error|null}>}
     */
    async deleteMessage(messageId, userId) {
        try {
            const { error } = await supabase
                .from("messages")
                .delete()
                .eq("id", messageId)
                .eq("sender_id", userId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error("Error deleting message:", error);
            return { error };
        }
    },

    /**
     * Edit a message
     * @param {string} messageId - Message ID
     * @param {string} content - New content
     * @param {string} userId - User ID (for permission check)
     * @returns {Promise<{data: Object|null, error: Error|null}>}
     */
    async editMessage(messageId, content, userId) {
        try {
            const { data, error } = await supabase
                .from("messages")
                .update({
                    content,
                    edited_at: new Date().toISOString()
                })
                .eq("id", messageId)
                .eq("sender_id", userId)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Error editing message:", error);
            return { data: null, error };
        }
    },

    /**
     * Add reaction to a message
     * @param {string} messageId - Message ID
     * @param {string} userId - User ID
     * @param {string} emoji - Emoji reaction
     * @returns {Promise<{error: Error|null}>}
     */
    async addReaction(messageId, userId, emoji) {
        try {
            const { error } = await supabase
                .from("message_reactions")
                .insert({
                    message_id: messageId,
                    user_id: userId,
                    emoji
                });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error("Error adding reaction:", error);
            return { error };
        }
    },

    /**
     * Remove reaction from a message
     * @param {string} messageId - Message ID
     * @param {string} userId - User ID
     * @param {string} emoji - Emoji reaction
     * @returns {Promise<{error: Error|null}>}
     */
    async removeReaction(messageId, userId, emoji) {
        try {
            const { error } = await supabase
                .from("message_reactions")
                .delete()
                .eq("message_id", messageId)
                .eq("user_id", userId)
                .eq("emoji", emoji);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error("Error removing reaction:", error);
            return { error };
        }
    }
};
