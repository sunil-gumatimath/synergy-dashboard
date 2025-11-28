import React, { useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { Upload, Download, Trash, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
const DocumentUploadModal = lazy(() => import("./DocumentUploadModal"));
const ConfirmModal = lazy(() => import("./ConfirmModal"));
import documentService from "../services/documentService";

const DocumentList = ({
  employeeId,
  documents,
  onDocumentAdded,
  onDocumentDeleted,
  isLoading,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getDocumentIcon = (mimeType) => {
    const icon = documentService.getFileIcon(mimeType);
    const icons = {
      PDF: "📄",
      DOC: "📝",
      IMG: "🖼️",
      XLS: "📊",
      File: "📎",
    };
    return icons[icon] || icons.File;
  };

  const getDocumentTypeColor = (type) => {
    const colors = {
      resume: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      contract: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      certificate: "bg-green-500/10 text-green-500 border-green-500/20",
      id_proof: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      other: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    };
    return colors[type] || colors.other;
  };

  const handleDownload = async (document) => {
    setDownloadingId(document.id);
    await documentService.download(document.file_url, document.name);
    setDownloadingId(null);
  };

  const handleDeleteDocument = (document) => {
    setSelectedDocument(document);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedDocument) {
      setActionLoading(true);
      try {
        await onDocumentDeleted(selectedDocument.id);
        setShowDeleteModal(false);
        setSelectedDocument(null);
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card employee-detail-section">
        <h2 className="section-title">Documents</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card employee-detail-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Documents</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload size={16} />
          Upload
        </button>
      </div>

      {documents && documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border-color hover:border-primary-color transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0">
                  {getDocumentIcon(document.mime_type)}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-main truncate">
                    {document.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted mt-1">
                    <span
                      className={`px-2 py-0.5 rounded border ${getDocumentTypeColor(document.type)}`}
                    >
                      {document.type}
                    </span>
                    <span>
                      {documentService.formatFileSize(document.file_size)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      <span>
                        {formatDistanceToNow(new Date(document.uploaded_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  {document.notes && (
                    <p className="text-xs text-muted mt-1 italic">
                      {document.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  className="p-2 hover:bg-tertiary rounded transition-colors"
                  onClick={() => handleDownload(document)}
                  disabled={downloadingId === document.id}
                  title="Download document"
                >
                  {downloadingId === document.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-color"></div>
                  ) : (
                    <Download
                      size={16}
                      className="text-muted hover:text-main"
                    />
                  )}
                </button>
                <button
                  className="p-2 hover:bg-tertiary rounded transition-colors"
                  onClick={() => handleDeleteDocument(document)}
                  title="Delete document"
                >
                  <Trash
                    size={16}
                    className="text-muted hover:text-danger-color"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-3">📁</div>
          <p className="text-muted mb-4">No documents uploaded yet</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={16} />
            Upload First Document
          </button>
        </div>
      )}

      {/* Upload Document Modal */}
      <Suspense fallback={null}>
        <DocumentUploadModal
          isOpen={showUploadModal}
          employeeId={employeeId}
          onClose={() => setShowUploadModal(false)}
          onDocumentUploaded={(document) => {
            onDocumentAdded(document);
            setShowUploadModal(false);
          }}
        />
      </Suspense>

      {/* Delete Confirmation Modal */}
      <Suspense fallback={null}>
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Document"
          message={`Are you sure you want to delete "${selectedDocument?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedDocument(null);
          }}
          isLoading={actionLoading}
          type="danger"
        />
      </Suspense>
    </div>
  );
};

DocumentList.propTypes = {
  employeeId: PropTypes.number.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      file_url: PropTypes.string.isRequired,
      file_size: PropTypes.number,
      mime_type: PropTypes.string,
      uploaded_at: PropTypes.string.isRequired,
      notes: PropTypes.string,
    }),
  ),
  onDocumentAdded: PropTypes.func.isRequired,
  onDocumentDeleted: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

DocumentList.defaultProps = {
  documents: [],
  isLoading: false,
};

export default DocumentList;
