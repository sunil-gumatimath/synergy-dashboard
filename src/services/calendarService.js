import { supabase } from "../lib/supabase";

const TABLE_NAME = "calendar_events";

/**
 * Calendar Service - Handles all CRUD operations for calendar events
 */
export const calendarService = {
    /**
     * Fetch all calendar events
     * @returns {Promise<{data: Array, error: Error|null}>}
     */
    async getAll() {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select("*")
                .order("date", { ascending: true });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            return { data: [], error };
        }
    },

    /**
     * Create a new event
     * @param {Object} eventData - Event data
     * @returns {Promise<{data: Object|null, error: Error|null}>}
     */
    async create(eventData) {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert([
                    {
                        title: eventData.title,
                        description: eventData.description,
                        date: eventData.date,
                        time: eventData.time,
                        end_time: eventData.endTime || null,
                        type: eventData.type || "event",
                        location: eventData.location,
                        recurrence: eventData.recurrence || "none",
                        is_all_day: eventData.isAllDay || false,
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Error creating event:", error);
            return { data: null, error };
        }
    },

    /**
     * Update an existing event
     * @param {number} id - Event ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<{data: Object|null, error: Error|null}>}
     */
    async update(id, updates) {
        try {
            // Transform field names from camelCase to snake_case for database
            const dbUpdates = {
                title: updates.title,
                description: updates.description,
                date: updates.date,
                time: updates.time,
                end_time: updates.endTime || null,
                type: updates.type || "event",
                location: updates.location,
                recurrence: updates.recurrence || "none",
                is_all_day: updates.isAllDay || false,
            };

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update(dbUpdates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Error updating event:", error);
            return { data: null, error };
        }
    },

    /**
     * Delete an event
     * @param {number} id - Event ID
     * @returns {Promise<{success: boolean, error: Error|null}>}
     */
    async delete(id) {
        try {
            const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

            if (error) throw error;
            return { success: true, error: null };
        } catch (error) {
            console.error("Error deleting event:", error);
            return { success: false, error };
        }
    },
};
