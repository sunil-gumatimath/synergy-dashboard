import { supabase } from "../lib/supabase";
import {
  getMockNotesByEmployeeId,
  addMockNote,
  updateMockNote,
  deleteMockNote,
} from "./mockData";

/**
 * Employee Notes Service
 * Handles CRUD operations for employee notes
 * Auto-falls back to mock data if database tables don't exist
 */

// Helper to detect if we should use mock data
const shouldUseMock = (error) => {
  return (
    error?.message?.includes("relation") ||
    error?.message?.includes("does not exist") ||
    error?.message?.includes("employee_notes")
  );
};

export const noteService = {
  /**
   * Get all notes for an employee
   * @param {number} employeeId - The employee ID
   * @returns {Promise<{data: Array, error: Error}>}
   */
  async getByEmployeeId(employeeId) {
    try {
      const { data, error } = await supabase
        .from("employee_notes")
        .select("*")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      // Use mock data if database table doesn't exist
      if (shouldUseMock(error)) {
        const mockData = getMockNotesByEmployeeId(employeeId);
        return { data: mockData, error: null };
      }
      return { data: null, error };
    }
  },

  /**
   * Create a new note
   * @param {Object} noteData - The note data
   * @returns {Promise<{data: Object, error: Error}>}
   */
  async create(noteData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("employee_notes")
        .insert([
          {
            ...noteData,
            created_by: user?.email || "demo@company.com",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      // Use mock data if database table doesn't exist
      if (shouldUseMock(error)) {
        const mockData = addMockNote({
          ...noteData,
          created_by: "demo@company.com",
        });
        return { data: mockData, error: null };
      }
      return { data: null, error };
    }
  },

  /**
   * Update an existing note
   * @param {number} id - The note ID
   * @param {Object} updates - The fields to update
   * @returns {Promise<{data: Object, error: Error}>}
   */
  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from("employee_notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      // Use mock data if database table doesn't exist
      if (shouldUseMock(error)) {
        const mockData = updateMockNote(id, updates);
        return { data: mockData, error: null };
      }
      return { data: null, error };
    }
  },

  /**
   * Delete a note
   * @param {number} id - The note ID
   * @returns {Promise<{success: boolean, error: Error}>}
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from("employee_notes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      // Use mock data if database table doesn't exist
      if (shouldUseMock(error)) {
        deleteMockNote(id);
        return { success: true, error: null };
      }
      return { success: false, error };
    }
  },
};

export default noteService;
