import { supabase } from "../lib/supabase";

const TABLE_NAME = "tasks";

// Mock data for initial development/fallback
const MOCK_TASKS = [
    {
        id: "1",
        title: "Onboard new designers",
        description: "Prepare welcome kit and system access for the 3 new UX designers joining next week.",
        status: "todo",
        priority: "high",
        due_date: "2025-12-05",
        assignee: {
            name: "Sarah Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        comments: 2,
        attachments: 1
    },
    {
        id: "2",
        title: "Q4 Performance Reviews",
        description: "Complete initial self-assessments and peer reviews for the engineering team.",
        status: "in-progress",
        priority: "medium",
        due_date: "2025-12-15",
        assignee: {
            name: "Michael Chang",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
        },
        comments: 5,
        attachments: 0
    },
    {
        id: "3",
        title: "Update Employee Handbook",
        description: "Revise the remote work policy section to reflect new guidelines.",
        status: "review",
        priority: "low",
        due_date: "2025-11-30",
        assignee: {
            name: "Emma Davis",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma"
        },
        comments: 0,
        attachments: 3
    },
    {
        id: "4",
        title: "Fix Payroll Discrepancy",
        description: "Investigate the overtime calculation issue reported by the sales team.",
        status: "done",
        priority: "high",
        due_date: "2025-11-20",
        assignee: {
            name: "James Wilson",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
        },
        comments: 8,
        attachments: 2
    }
];

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

            if (error) {
                console.warn("Error fetching tasks (using mock data):", error);
                return { data: MOCK_TASKS, error: null };
            }

            return { data, error: null };
        } catch (error) {
            console.error("Error in taskService:", error);
            return { data: MOCK_TASKS, error: null };
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
