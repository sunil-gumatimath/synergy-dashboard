import { supabase } from "../lib/supabase";

const TABLE_NAME = "tasks";

export const taskService = {
    async getAll() {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select(`
          *,
          assignee:employees(name, avatar)
        `)
                .order("created_at", { ascending: false });

            if (error) throw error;

            return { data, error: null };
        } catch (error) {
            console.error("Error in taskService:", error);
            return { data: [], error };
        }
    },

    async updateStatus(taskId, newStatus) {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update({ status: newStatus })
                .eq("id", taskId)
                .select();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Error updating task status:", error);
            return { data: null, error };
        }
    },

    async create(task) {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .insert([task])
                .select();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Error creating task:", error);
            return { data: null, error };
        }
    },

    async update(taskId, updates) {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update(updates)
                .eq("id", taskId)
                .select();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error("Error updating task:", error);
            return { data: null, error };
        }
    },

    async delete(taskId) {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq("id", taskId);

            if (error) throw error;
            return { success: true, error: null };
        } catch (error) {
            console.error("Error deleting task:", error);
            return { success: false, error };
        }
    }
};
