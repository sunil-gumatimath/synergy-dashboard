import React from "react";
import { Info } from "lucide-react";

const MockDataBanner = () => {
  return (
    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-blue-500 font-semibold mb-1">
            📦 Mock Data Mode Active
          </h4>
          <p className="text-sm text-muted">
            The Documents and Notes features are currently using{" "}
            <span className="font-semibold text-main">
              sample data for testing
            </span>
            . All changes are stored in memory only and will reset when you
            refresh the page.
          </p>
          <p className="text-xs text-muted mt-2">
            💡 <strong>To enable full functionality:</strong> Run the database
            migration and set up Supabase Storage. See{" "}
            <code className="px-1 py-0.5 bg-tertiary rounded text-xs">
              migrations/002_employee_documents_notes.sql
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockDataBanner;
