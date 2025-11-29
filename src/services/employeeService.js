import { supabase } from "../lib/supabase";

const TABLE_NAME = "employees";

/**
 * Employee Service - Handles all CRUD operations for employees
 */
export const employeeService = {
  /**
   * Fetch all employees
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching employees:", error);
      return { data: [], error };
    }
  },

  /**
   * Get a single employee by ID
   * @param {number} id - Employee ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching employee:", error);
      return { data: null, error };
    }
  },

  /**
   * Create a new employee
   * @param {Object} employeeData - Employee data
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async create(employeeData) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([
          {
            name: employeeData.name,
            email: employeeData.email,
            role: employeeData.role,
            department: employeeData.department,
            status: employeeData.status || "Active",
            avatar:
              employeeData.avatar ||
              `https://api.dicebear.com/9.x/micah/svg?seed=${employeeData.name}`,
            join_date:
              employeeData.joinDate || new Date().toISOString().split("T")[0],
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error creating employee:", error);
      return { data: null, error };
    }
  },

  /**
   * Update an existing employee
   * @param {number} id - Employee ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async update(id, updates) {
    try {
      const updateData = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.role !== undefined) updateData.role = updates.role;
      if (updates.department !== undefined)
        updateData.department = updates.department;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
      if (updates.joinDate !== undefined)
        updateData.join_date = updates.joinDate;

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error updating employee:", error);
      return { data: null, error };
    }
  },

  /**
   * Delete an employee
   * @param {number} id - Employee ID
   * @returns {Promise<{success: boolean, error: Error|null}>}
   */
  async delete(id) {
    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting employee:", error);
      return { success: false, error };
    }
  },

  /**
   * Search employees by name, email, or department
   * @param {string} query - Search query
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async search(query) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .or(
          `name.ilike.%${query}%,email.ilike.%${query}%,department.ilike.%${query}%`,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error searching employees:", error);
      return { data: null, error };
    }
  },

  /**
   * Filter employees by department and/or status
   * @param {Object} filters - Filter criteria
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async filter(filters = {}) {
    try {
      let query = supabase.from(TABLE_NAME).select("*");

      if (filters.department) {
        query = query.eq("department", filters.department);
      }

      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error filtering employees:", error);
      return { data: null, error };
    }
  },
};
