import { supabase } from "../lib/supabase";
import {
  getMockDocumentsByEmployeeId,
  addMockDocument,
  deleteMockDocument,
} from "./mockData";

/**
 * Employee Documents Service
 * Handles CRUD operations for employee documents
 * Auto-falls back to mock data if Storage/database isn't set up
 */

const STORAGE_BUCKET = "employee-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Helper to detect if we should use mock data
const shouldUseMock = (error) => {
  return (
    error?.message?.includes("relation") ||
    error?.message?.includes("does not exist") ||
    error?.message?.includes("employee_documents") ||
    error?.message?.includes("bucket") ||
    error?.message?.includes("not found")
  );
};

export const documentService = {
  /**
   * Get all documents for an employee
   * @param {number} employeeId - The employee ID
   * @returns {Promise<{data: Array, error: Error}>}
   */
  async getByEmployeeId(employeeId) {
    try {
      const { data, error } = await supabase
        .from("employee_documents")
        .select("*")
        .eq("employee_id", employeeId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      // Use mock data if database table doesn't exist
      if (shouldUseMock(error)) {
        const mockData = getMockDocumentsByEmployeeId(employeeId);
        return { data: mockData, error: null };
      }
      return { data: null, error };
    }
  },

  /**
   * Upload a document
   * @param {number} employeeId - The employee ID
   * @param {File} file - The file to upload
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<{data: Object, error: Error}>}
   */
  async upload(employeeId, file, metadata = {}) {
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Create unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${employeeId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      // Save document metadata to database
      const { data, error } = await supabase
        .from("employee_documents")
        .insert([
          {
            employee_id: employeeId,
            name: file.name,
            type: metadata.type || "other",
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: user?.email || "demo@company.com",
            notes: metadata.notes || null,
          },
        ])
        .select()
        .single();

      if (error) {
        await supabase.storage.from(STORAGE_BUCKET).remove([fileName]);
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      // Use mock data if storage/database isn't set up
      if (shouldUseMock(error)) {
        const mockData = addMockDocument({
          employee_id: employeeId,
          name: file.name,
          type: metadata.type || "other",
          file_url:
            "https://illustrations.popsy.co/amber/uploaded-document.svg",
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: "demo@company.com",
          notes: metadata.notes || null,
        });
        return { data: mockData, error: null };
      }
      return { data: null, error };
    }
  },

  /**
   * Delete a document
   * @param {number} id - The document ID
   * @returns {Promise<{success: boolean, error: Error}>}
   */
  async delete(id) {
    try {
      const { data: doc, error: fetchError } = await supabase
        .from("employee_documents")
        .select("file_url")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      const fileUrl = doc.file_url;
      const filePath = fileUrl.split(`${STORAGE_BUCKET}/`)[1];

      if (filePath) {
        await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
      }

      const { error } = await supabase
        .from("employee_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      if (shouldUseMock(error)) {
        deleteMockDocument(id);
        return { success: true, error: null };
      }
      return { success: false, error };
    }
  },

  /**
   * Download a document
   * @param {string} fileUrl - The file URL
   * @param {string} fileName - The original file name
   */
  async download(fileUrl, fileName) {
    try {
      // For SVG illustrations or placeholders, open in new tab
      if (
        fileUrl.includes("illustrations.popsy.co") ||
        fileUrl.includes("placeholder.com")
      ) {
        window.open(fileUrl, "_blank");
        return { success: true, error: null };
      }

      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true, error: null };
    } catch (error) {
      console.error("Error downloading document:", error);
      return { success: false, error };
    }
  },

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  /**
   * Get file icon based on type
   */
  getFileIcon(mimeType) {
    if (!mimeType) return "File";
    if (mimeType.includes("pdf")) return "PDF";
    if (mimeType.includes("word") || mimeType.includes("document"))
      return "DOC";
    if (mimeType.includes("image")) return "IMG";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet"))
      return "XLS";
    return "File";
  },
};

export default documentService;
