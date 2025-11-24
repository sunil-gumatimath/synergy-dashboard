import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Plus, Edit, Trash, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import AddNoteModal from './AddNoteModal';
import EditNoteModal from './EditNoteModal';
import ConfirmModal from './ConfirmModal';

const NotesList = ({ employeeId, notes, onNoteAdded, onNoteUpdated, onNoteDeleted, isLoading }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    const getCategoryColor = (category) => {
        const colors = {
            performance: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            general: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
            disciplinary: 'bg-red-500/10 text-red-500 border-red-500/20',
            praise: 'bg-green-500/10 text-green-500 border-green-500/20',
            meeting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
            other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        };
        return colors[category] || colors.other;
    };

    const getCategoryIcon = (category) => {
        const icons = {
            performance: '📊',
            general: '📝',
            disciplinary: '⚠️',
            praise: '⭐',
            meeting: '💼',
            other: '📄',
        };
        return icons[category] || icons.other;
    };

    const handleEditNote = (note) => {
        setSelectedNote(note);
        setShowEditModal(true);
    };

    const handleDeleteNote = (note) => {
        setSelectedNote(note);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (selectedNote) {
            await onNoteDeleted(selectedNote.id);
            setShowDeleteModal(false);
            setSelectedNote(null);
        }
    };

    if (isLoading) {
        return (
            <div className="card employee-detail-section">
                <h2 className="section-title">Notes</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-color"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="card employee-detail-section">
            <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0">Notes</h2>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={16} />
                    Add Note
                </button>
            </div>

            {notes && notes.length > 0 ? (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className="p-4 bg-secondary rounded-lg border border-border-color hover:border-primary-color transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getCategoryIcon(note.category)}</span>
                                    <h3 className="font-semibold text-main">{note.title}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-1.5 hover:bg-tertiary rounded transition-colors"
                                        onClick={() => handleEditNote(note)}
                                        title="Edit note"
                                    >
                                        <Edit size={14} className="text-muted hover:text-main" />
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-tertiary rounded transition-colors"
                                        onClick={() => handleDeleteNote(note)}
                                        title="Delete note"
                                    >
                                        <Trash size={14} className="text-muted hover:text-danger-color" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-muted mb-3 whitespace-pre-wrap">{note.content}</p>

                            <div className="flex items-center gap-4 text-xs text-muted">
                                <span className={`px-2 py-1 rounded border ${getCategoryColor(note.category)}`}>
                                    {note.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User size={12} />
                                    <span>by {note.created_by}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-3">📝</div>
                    <p className="text-muted mb-4">No notes yet</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus size={16} />
                        Add First Note
                    </button>
                </div>
            )}

            {/* Add Note Modal */}
            <AddNoteModal
                isOpen={showAddModal}
                employeeId={employeeId}
                onClose={() => setShowAddModal(false)}
                onNoteAdded={(note) => {
                    onNoteAdded(note);
                    setShowAddModal(false);
                }}
            />

            {/* Edit Note Modal */}
            {selectedNote && (
                <EditNoteModal
                    isOpen={showEditModal}
                    note={selectedNote}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedNote(null);
                    }}
                    onNoteUpdated={(updatedNote) => {
                        onNoteUpdated(updatedNote);
                        setShowEditModal(false);
                        setSelectedNote(null);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete Note"
                message={`Are you sure you want to delete "${selectedNote?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedNote(null);
                }}
                variant="danger"
            />
        </div>
    );
};

NotesList.propTypes = {
    employeeId: PropTypes.number.isRequired,
    notes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            category: PropTypes.string,
            created_by: PropTypes.string.isRequired,
            created_at: PropTypes.string.isRequired,
            updated_at: PropTypes.string,
        })
    ),
    onNoteAdded: PropTypes.func.isRequired,
    onNoteUpdated: PropTypes.func.isRequired,
    onNoteDeleted: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

NotesList.defaultProps = {
    notes: [],
    isLoading: false,
};

export default NotesList;
