// Mock data for testing Documents & Notes features without database
// This provides realistic sample data for development

export const mockNotes = [
    {
        id: 1,
        employee_id: 1,
        title: 'Quarterly Performance Review - Q4 2024',
        content: 'Excellent performance this quarter. Exceeded all targets by 25% and demonstrated exceptional leadership skills. Led the migration project successfully with zero downtime.',
        category: 'performance',
        is_private: false,
        created_by: 'manager@company.com',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        employee_id: 1,
        title: 'One-on-One Meeting Notes',
        content: 'Discussed career goals and development plans. Employee expressed interest in taking on more leadership responsibilities. Action items: Enroll in leadership training program, assign mentorship role.',
        category: 'meeting',
        is_private: false,
        created_by: 'hr@company.com',
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        employee_id: 1,
        title: 'Outstanding Team Collaboration',
        content: 'Helped onboard 3 new team members this month. Consistently provides helpful code reviews and mentorship. Team members have specifically mentioned their positive impact.',
        category: 'praise',
        is_private: false,
        created_by: 'team.lead@company.com',
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const mockDocuments = [
    {
        id: 1,
        employee_id: 1,
        name: 'Resume_2024.pdf',
        type: 'resume',
        file_url: 'https://illustrations.popsy.co/amber/resume.svg',
        file_size: 2457600, // 2.4 MB
        mime_type: 'application/pdf',
        uploaded_by: 'hr@company.com',
        uploaded_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Updated resume with recent certifications',
    },
    {
        id: 2,
        employee_id: 1,
        name: 'Employment_Contract_2024.pdf',
        type: 'contract',
        file_url: 'https://illustrations.popsy.co/amber/contract.svg',
        file_size: 1048576, // 1 MB
        mime_type: 'application/pdf',
        uploaded_by: 'legal@company.com',
        uploaded_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Signed employment contract',
    },
    {
        id: 3,
        employee_id: 1,
        name: 'AWS_Certification.pdf',
        type: 'certificate',
        file_url: 'https://illustrations.popsy.co/amber/certificate.svg',
        file_size: 524288, // 512 KB
        mime_type: 'application/pdf',
        uploaded_by: 'training@company.com',
        uploaded_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'AWS Solutions Architect Professional certification',
    },
];

// Mock data storage (simulates database)
let mockNotesStore = [...mockNotes];
let mockDocumentsStore = [...mockDocuments];
let nextNoteId = 4;
let nextDocumentId = 4;

// Helper to get notes for an employee
export const getMockNotesByEmployeeId = (employeeId) => {
    return mockNotesStore.filter(note => note.employee_id === employeeId);
};

// Helper to get documents for an employee
export const getMockDocumentsByEmployeeId = (employeeId) => {
    return mockDocumentsStore.filter(doc => doc.employee_id === employeeId);
};

// Helper to add a note
export const addMockNote = (noteData) => {
    const newNote = {
        id: nextNoteId++,
        ...noteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    mockNotesStore = [newNote, ...mockNotesStore];
    return newNote;
};

// Helper to update a note
export const updateMockNote = (id, updates) => {
    const index = mockNotesStore.findIndex(note => note.id === id);
    if (index !== -1) {
        mockNotesStore[index] = {
            ...mockNotesStore[index],
            ...updates,
            updated_at: new Date().toISOString(),
        };
        return mockNotesStore[index];
    }
    return null;
};

// Helper to delete a note
export const deleteMockNote = (id) => {
    mockNotesStore = mockNotesStore.filter(note => note.id !== id);
    return true;
};

// Helper to add a document
export const addMockDocument = (documentData) => {
    const newDocument = {
        id: nextDocumentId++,
        ...documentData,
        uploaded_at: new Date().toISOString(),
    };
    mockDocumentsStore = [newDocument, ...mockDocumentsStore];
    return newDocument;
};

// Helper to delete a document
export const deleteMockDocument = (id) => {
    mockDocumentsStore = mockDocumentsStore.filter(doc => doc.id !== id);
    return true;
};

// Reset mock data (useful for testing)
export const resetMockData = () => {
    mockNotesStore = [...mockNotes];
    mockDocumentsStore = [...mockDocuments];
    nextNoteId = 4;
    nextDocumentId = 4;
};
