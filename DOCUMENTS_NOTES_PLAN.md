# 📋 Implementation Plan: Documents & Notes Features

## 🎯 Overview
Implement full CRUD functionality for employee documents and notes on the Employee Detail Page.

---

## 📊 Database Schema

### 1. Employee Documents Table
```sql
CREATE TABLE employee_documents (
  id BIGSERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'resume', 'contract', 'certificate', 'other'
  file_url TEXT NOT NULL,
  file_size INTEGER, -- in bytes
  uploaded_by TEXT, -- user email/id who uploaded
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Enable RLS
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (for now)
CREATE POLICY "Enable all operations for authenticated users" 
ON employee_documents FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX idx_employee_documents_employee_id ON employee_documents(employee_id);
CREATE INDEX idx_employee_documents_uploaded_at ON employee_documents(uploaded_at DESC);
```

### 2. Employee Notes Table
```sql
CREATE TABLE employee_notes (
  id BIGSERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- 'performance', 'general', 'disciplinary', 'praise'
  is_private BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL, -- user email/id who created
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Enable RLS
ALTER TABLE employee_notes ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (for now)
CREATE POLICY "Enable all operations for authenticated users" 
ON employee_notes FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Indexes
CREATE INDEX idx_employee_notes_employee_id ON employee_notes(employee_id);
CREATE INDEX idx_employee_notes_created_at ON employee_notes(created_at DESC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employee_notes_updated_at BEFORE UPDATE
ON employee_notes FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🏗️ Implementation Steps

### Phase 1: Database Setup (10 min)
1. Create SQL migration file
2. Run migration in Supabase
3. Set up Supabase Storage bucket for documents
4. Configure storage policies

### Phase 2: Documents Feature (60 min)
1. Create `documentService.js` for CRUD operations
2. Create `DocumentList` component
3. Create `DocumentUploadModal` component
4. Update `EmployeeDetailPage` to use Documents
5. Add styles

**Features:**
- Upload documents (PDF, DOCX, images)
- List all documents
- Download documents
- Delete documents
- Filter by type (resume, contract, certificate)
- Show file size and upload date

### Phase 3: Notes Feature (45 min)
1. Create `noteService.js` for CRUD operations
2. Create `NotesList` component
3. Create `AddNoteModal` component
4. Create `EditNoteModal` component
5. Update `EmployeeDetailPage` to use Notes
6. Add styles

**Features:**
- Add notes with title, content, category
- Edit existing notes
- Delete notes
- Filter by category
- Show creation/update timestamps
- Show who created the note

### Phase 4: Testing & Polish (15 min)
1. Test file upload/download
2. Test CRUD for notes
3. Add loading states
4. Add error handling
5. Add toast notifications
6. Responsive design check

---

## 📁 Files to Create

```
src/
├── services/
│   ├── documentService.js       (NEW)
│   └── noteService.js           (NEW)
├── components/
│   ├── DocumentList.jsx         (NEW)
│   ├── DocumentUploadModal.jsx  (NEW)
│   ├── NotesList.jsx            (NEW)
│   ├── AddNoteModal.jsx         (NEW)
│   └── EditNoteModal.jsx        (NEW)
└── pages/
    └── EmployeeDetailPage.jsx   (UPDATE)
```

---

## 🎨 UI/UX Design

### Documents Section
```
┌─────────────────────────────────────────┐
│ Documents                    [+ Upload] │
├─────────────────────────────────────────┤
│ 📄 Resume.pdf          2.3 MB  Nov 20   │
│ 📄 Contract.pdf        1.1 MB  Nov 15   │
│ 📄 Certificate.pdf     0.8 MB  Nov 10   │
└─────────────────────────────────────────┘
```

### Notes Section
```
┌─────────────────────────────────────────┐
│ Notes                        [+ Add]     │
├─────────────────────────────────────────┤
│ 📝 Quarterly Performance Review         │
│    Excellent work on Q4 project...      │
│    Performance • Nov 20 • by John Doe   │
├─────────────────────────────────────────┤
│ 📝 One-on-One Meeting Notes             │
│    Discussed career goals and...        │
│    General • Nov 15 • by Jane Smith     │
└─────────────────────────────────────────┘
```

---

## 🚀 Total Estimated Time: **2-3 hours**

---

## ⚙️ Configuration Notes

- Max file size: 10MB
- Allowed file types: PDF, DOCX, DOC, JPG, PNG
- Storage bucket name: `employee-documents`
- Notes max length: 5000 characters

