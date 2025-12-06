import { supabase } from "../lib/supabase";

const TABLE_NAME = "calendar_events";

/**
 * Calendar Service - Handles all CRUD operations for calendar events
 */
export const calendarService = {
    /**
     * Fetch all calendar events
     */
    async getAll() {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select("*")
                .order("date", { ascending: true });

            if (error) {
                console.error("Error fetching calendar events:", error);
                return { data: null, error };
            }
            return { data, error: null };
        } catch (error) {
            console.error("Error in getAll:", error);
            return { data: null, error };
        }
    },

    /**
     * Create a new calendar event
     */
    async create(eventData) {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert([eventData])
                .select()
                .single();

            if (error) {
                console.error("Error creating calendar event:", error);
                return { data: null, error };
            }
            return { data, error: null };
        } catch (error) {
            console.error("Error in create:", error);
            return { data: null, error };
        }
    },

    /**
     * Update an existing calendar event
     */
    async update(id, eventData) {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update(eventData)
                .eq("id", id)
                .select()
                .single();

            if (error) {
                console.error("Error updating calendar event:", error);
                return { data: null, error };
            }
            return { data, error: null };
        } catch (error) {
            console.error("Error in update:", error);
            return { data: null, error };
        }
    },

    /**
     * Delete a calendar event
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq("id", id);

            if (error) {
                console.error("Error deleting calendar event:", error);
                return { success: false, error };
            }
            return { success: true, error: null };
        } catch (error) {
            console.error("Error in delete:", error);
            return { success: false, error };
        }
    }
};
