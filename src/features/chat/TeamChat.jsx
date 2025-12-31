import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    MessageCircle,
    Send,
    Search,
    Plus,
    Users,
    User,
    MoreVertical,
    Phone,
    Video,
    Paperclip,
    Smile,
    Image as ImageIcon,
    Check,
    CheckCheck,
    Circle,
    X,
    Hash,
    ChevronLeft,
    Loader2,
    Edit2,
    Trash2,
    Reply,
    Star,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { chatService } from "../../services/chatService";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import "./team-chat.css";

/**
 * TeamChat - Real-time team messaging component
 */
const TeamChat = () => {
    const { user } = useAuth();
    const toast = useToast();

    // State
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showMobileConversations, setShowMobileConversations] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [typingUsers, setTypingUsers] = useState([]);

    const messagesEndRef = useRef(null);
    const messageInputRef = useRef(null);

    // Load conversations
    useEffect(() => {
        const loadConversations = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                const { data, error } = await chatService.getConversations(user.id);
                if (error) throw error;
                setConversations(data || []);
            } catch (err) {
                console.error("Failed to load conversations:", err);
                toast.error("Failed to load conversations");
            } finally {
                setIsLoading(false);
            }
        };

        loadConversations();
    }, [user?.id, toast]);

    // Load messages when conversation changes
    useEffect(() => {
        const loadMessages = async () => {
            if (!activeConversation?.id) return;

            try {
                const { data, error } = await chatService.getMessages(activeConversation.id);
                if (error) throw error;
                setMessages(data || []);

                // Mark as read
                await chatService.markAsRead(activeConversation.id, user.id);
            } catch (err) {
                console.error("Failed to load messages:", err);
                toast.error("Failed to load messages");
            }
        };

        loadMessages();
    }, [activeConversation?.id, user?.id, toast]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Subscribe to real-time messages
    useEffect(() => {
        if (!activeConversation?.id) return;

        const subscription = chatService.subscribeToMessages(
            activeConversation.id,
            (newMsg) => {
                setMessages((prev) => [...prev, newMsg.new]);
            }
        );

        return () => {
            subscription?.unsubscribe?.();
        };
    }, [activeConversation?.id]);

    // Format timestamp
    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        if (isToday(date)) {
            return format(date, "h:mm a");
        } else if (isYesterday(date)) {
            return `Yesterday ${format(date, "h:mm a")}`;
        }
        return format(date, "MMM d, h:mm a");
    };

    // Format last message time for conversation list
    const formatLastMessageTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        if (isToday(date)) {
            return format(date, "h:mm a");
        } else if (isYesterday(date)) {
            return "Yesterday";
        }
        return format(date, "MMM d");
    };

    // Send message
    const handleSendMessage = async (e) => {
        e?.preventDefault();

        if (!newMessage.trim() || !activeConversation?.id || isSending) return;

        setIsSending(true);
        const messageContent = newMessage.trim();
        setNewMessage("");

        try {
            const { data, error } = await chatService.sendMessage({
                conversationId: activeConversation.id,
                senderId: user.id,
                content: messageContent,
                type: "text",
            });

            if (error) throw error;

            // Optimistically add message
            setMessages((prev) => [...prev, {
                id: data?.id || Date.now(),
                content: messageContent,
                sender_id: user.id,
                sender: { name: user.name, avatar: user.avatar },
                created_at: new Date().toISOString(),
                read: false,
            }]);

        } catch (err) {
            console.error("Failed to send message:", err);
            toast.error("Failed to send message");
            setNewMessage(messageContent); // Restore message on error
        } finally {
            setIsSending(false);
        }
    };

    // Handle conversation selection
    const handleSelectConversation = (conversation) => {
        setActiveConversation(conversation);
        setShowMobileConversations(false);
    };

    // Filter conversations by search
    const filteredConversations = conversations.filter((conv) => {
        if (!searchQuery) return true;
        const name = conv.is_group
            ? conv.name
            : conv.participants?.find(p => p.user_id !== user?.id)?.name || "";
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Get conversation display name
    const getConversationName = (conv) => {
        if (conv.is_group) return conv.name;
        const otherParticipant = conv.participants?.find(p => p.user_id !== user?.id);
        return otherParticipant?.name || "Unknown";
    };

    // Get conversation avatar
    const getConversationAvatar = (conv) => {
        if (conv.is_group) {
            return `https://api.dicebear.com/9.x/shapes/svg?seed=${conv.name}`;
        }
        const otherParticipant = conv.participants?.find(p => p.user_id !== user?.id);
        return otherParticipant?.avatar ||
            `https://api.dicebear.com/9.x/initials/svg?seed=${otherParticipant?.name || 'U'}`;
    };

    // Check if user is online
    const isUserOnline = (userId) => onlineUsers[userId]?.online;

    // Render conversation list item
    const renderConversationItem = (conv) => {
        const isActive = activeConversation?.id === conv.id;
        const unreadCount = conv.unread_count || 0;

        return (
            <button
                key={conv.id}
                className={`chat-conversation-item ${isActive ? "active" : ""}`}
                onClick={() => handleSelectConversation(conv)}
            >
                <div className="chat-conversation-avatar">
                    <img src={getConversationAvatar(conv)} alt="" />
                    {!conv.is_group && isUserOnline(conv.participants?.[0]?.user_id) && (
                        <span className="online-indicator" />
                    )}
                </div>
                <div className="chat-conversation-info">
                    <div className="chat-conversation-header">
                        <span className="chat-conversation-name">{getConversationName(conv)}</span>
                        <span className="chat-conversation-time">
                            {formatLastMessageTime(conv.last_message_at)}
                        </span>
                    </div>
                    <div className="chat-conversation-preview">
                        <span className="chat-last-message">
                            {conv.last_message || "No messages yet"}
                        </span>
                        {unreadCount > 0 && (
                            <span className="chat-unread-badge">{unreadCount}</span>
                        )}
                    </div>
                </div>
            </button>
        );
    };

    // Render message
    const renderMessage = (msg, index, messages) => {
        const isOwn = msg.sender_id === user?.id;
        const showAvatar = index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;
        const showTimestamp = index === 0 ||
            new Date(msg.created_at) - new Date(messages[index - 1]?.created_at) > 300000; // 5 minutes

        return (
            <div
                key={msg.id}
                className={`chat-message ${isOwn ? "own" : "other"} ${showAvatar ? "with-avatar" : ""}`}
            >
                {showTimestamp && (
                    <div className="chat-message-timestamp">
                        {formatMessageTime(msg.created_at)}
                    </div>
                )}
                <div className="chat-message-wrapper">
                    {!isOwn && showAvatar && (
                        <img
                            src={msg.sender?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${msg.sender?.name || 'U'}`}
                            alt=""
                            className="chat-message-avatar"
                        />
                    )}
                    <div className="chat-message-content">
                        {!isOwn && showAvatar && (
                            <span className="chat-message-sender">{msg.sender?.name}</span>
                        )}
                        <div className="chat-message-bubble">
                            <p>{msg.content}</p>
                        </div>
                        {isOwn && (
                            <span className="chat-message-status">
                                {msg.read ? <CheckCheck size={14} /> : <Check size={14} />}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="chat-container">
                <div className="chat-loading">
                    <Loader2 size={40} className="animate-spin" />
                    <span>Loading chats...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {/* Sidebar - Conversations List */}
            <aside className={`chat-sidebar ${showMobileConversations ? "mobile-visible" : ""}`}>
                <div className="chat-sidebar-header">
                    <div className="chat-header-top">
                        <h2>
                            <MessageCircle size={22} />
                            Team Chat
                        </h2>
                        <button
                            className="chat-new-btn"
                            onClick={() => setShowNewChatModal(true)}
                            title="New conversation"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="chat-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="chat-conversations">
                    {filteredConversations.length === 0 ? (
                        <div className="chat-empty">
                            <Users size={48} />
                            <p>No conversations yet</p>
                            <button onClick={() => setShowNewChatModal(true)}>
                                Start a conversation
                            </button>
                        </div>
                    ) : (
                        filteredConversations.map(renderConversationItem)
                    )}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="chat-main">
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="chat-main-header">
                            <button
                                className="chat-back-btn"
                                onClick={() => setShowMobileConversations(true)}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div className="chat-contact-info">
                                <img
                                    src={getConversationAvatar(activeConversation)}
                                    alt=""
                                    className="chat-contact-avatar"
                                />
                                <div className="chat-contact-details">
                                    <span className="chat-contact-name">
                                        {getConversationName(activeConversation)}
                                    </span>
                                    <span className="chat-contact-status">
                                        {activeConversation.is_group
                                            ? `${activeConversation.participants?.length || 0} members`
                                            : isUserOnline(activeConversation.participants?.[0]?.user_id)
                                                ? "Online"
                                                : "Offline"
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="chat-header-actions">
                                <button title="Voice call" disabled>
                                    <Phone size={20} />
                                </button>
                                <button title="Video call" disabled>
                                    <Video size={20} />
                                </button>
                                <button title="More options">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="chat-messages">
                            {messages.length === 0 ? (
                                <div className="chat-messages-empty">
                                    <MessageCircle size={64} />
                                    <h3>No messages yet</h3>
                                    <p>Send a message to start the conversation</p>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg, index) => renderMessage(msg, index, messages))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}

                            {typingUsers.length > 0 && (
                                <div className="chat-typing-indicator">
                                    <span className="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                    <span>{typingUsers.join(", ")} is typing...</span>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <button type="button" className="chat-attach-btn" title="Attach file" disabled>
                                <Paperclip size={20} />
                            </button>
                            <div className="chat-input-wrapper">
                                <input
                                    ref={messageInputRef}
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    disabled={isSending}
                                />
                                <button type="button" className="chat-emoji-btn" title="Add emoji" disabled>
                                    <Smile size={20} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="chat-send-btn"
                                disabled={!newMessage.trim() || isSending}
                            >
                                {isSending ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    // Empty state when no conversation selected
                    <div className="chat-empty-state">
                        <div className="chat-empty-icon">
                            <MessageCircle size={80} />
                        </div>
                        <h2>Welcome to Team Chat</h2>
                        <p>Select a conversation to start messaging or create a new one</p>
                        <button
                            className="chat-start-btn"
                            onClick={() => setShowNewChatModal(true)}
                        >
                            <Plus size={20} />
                            Start New Conversation
                        </button>
                    </div>
                )}
            </main>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <NewChatModal
                    onClose={() => setShowNewChatModal(false)}
                    onCreateConversation={(conv) => {
                        setConversations((prev) => [conv, ...prev]);
                        setActiveConversation(conv);
                        setShowNewChatModal(false);
                        toast.success("Conversation created!");
                    }}
                    currentUserId={user?.id}
                />
            )}
        </div>
    );
};

/**
 * NewChatModal - Modal for creating new conversations
 */
const NewChatModal = ({ onClose, onCreateConversation, currentUserId }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [employees, setEmployees] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    // Load employees
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const { data } = await chatService.getOnlineStatus([]);
                // For demo, use mock data if no employees
                setEmployees(data?.users || [
                    { id: "1", name: "John Doe", avatar: null, department: "Engineering" },
                    { id: "2", name: "Jane Smith", avatar: null, department: "Design" },
                    { id: "3", name: "Mike Johnson", avatar: null, department: "Marketing" },
                ]);
            } catch (err) {
                console.error("Failed to load employees:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadEmployees();
    }, []);

    const handleCreateConversation = async () => {
        if (selectedUsers.length === 0) {
            toast.error("Please select at least one user");
            return;
        }

        if (isGroup && !groupName.trim()) {
            toast.error("Please enter a group name");
            return;
        }

        try {
            let result;
            if (isGroup) {
                result = await chatService.createGroupConversation({
                    name: groupName,
                    description: "",
                    memberIds: selectedUsers.map(u => u.id),
                    createdBy: currentUserId,
                });
            } else {
                result = await chatService.createDirectConversation(
                    currentUserId,
                    selectedUsers[0].id
                );
            }

            if (result.error) throw result.error;
            onCreateConversation(result.data);
        } catch (err) {
            console.error("Failed to create conversation:", err);
            toast.error("Failed to create conversation");
        }
    };

    const toggleUserSelection = (emp) => {
        setSelectedUsers((prev) => {
            const exists = prev.find((u) => u.id === emp.id);
            if (exists) {
                return prev.filter((u) => u.id !== emp.id);
            }
            if (!isGroup && prev.length > 0) {
                return [emp]; // Single selection for direct chat
            }
            return [...prev, emp];
        });
    };

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.id !== currentUserId &&
            emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="chat-modal-overlay" onClick={onClose}>
            <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                <div className="chat-modal-header">
                    <h3>New Conversation</h3>
                    <button className="chat-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="chat-modal-content">
                    {/* Toggle Group/Direct */}
                    <div className="chat-type-toggle">
                        <button
                            className={!isGroup ? "active" : ""}
                            onClick={() => {
                                setIsGroup(false);
                                setSelectedUsers([]);
                            }}
                        >
                            <User size={18} />
                            Direct Message
                        </button>
                        <button
                            className={isGroup ? "active" : ""}
                            onClick={() => setIsGroup(true)}
                        >
                            <Users size={18} />
                            Group Chat
                        </button>
                    </div>

                    {/* Group Name Input */}
                    {isGroup && (
                        <div className="chat-group-name">
                            <Hash size={18} />
                            <input
                                type="text"
                                placeholder="Group name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Search Users */}
                    <div className="chat-modal-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                        <div className="chat-selected-users">
                            {selectedUsers.map((u) => (
                                <span key={u.id} className="chat-selected-user">
                                    {u.name}
                                    <button onClick={() => toggleUserSelection(u)}>
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* User List */}
                    <div className="chat-user-list">
                        {isLoading ? (
                            <div className="chat-loading-small">
                                <Loader2 size={24} className="animate-spin" />
                            </div>
                        ) : filteredEmployees.length === 0 ? (
                            <div className="chat-no-users">No users found</div>
                        ) : (
                            filteredEmployees.map((emp) => {
                                const isSelected = selectedUsers.find((u) => u.id === emp.id);
                                return (
                                    <button
                                        key={emp.id}
                                        className={`chat-user-item ${isSelected ? "selected" : ""}`}
                                        onClick={() => toggleUserSelection(emp)}
                                    >
                                        <img
                                            src={emp.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${emp.name}`}
                                            alt=""
                                        />
                                        <div className="chat-user-info">
                                            <span className="chat-user-name">{emp.name}</span>
                                            <span className="chat-user-dept">{emp.department}</span>
                                        </div>
                                        {isSelected && (
                                            <span className="chat-user-check">
                                                <Check size={16} />
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="chat-modal-footer">
                    <button className="chat-modal-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="chat-modal-create"
                        onClick={handleCreateConversation}
                        disabled={selectedUsers.length === 0 || (isGroup && !groupName.trim())}
                    >
                        {isGroup ? "Create Group" : "Start Chat"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamChat;
