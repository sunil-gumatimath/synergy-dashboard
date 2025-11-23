# Employee Service API Reference

Quick reference for using the employee service layer with Supabase.

## Import

```javascript
import { employeeService } from "../services/employeeService";
```

## Methods

### `getAll()`

Fetch all employees from the database, ordered by creation date (newest first).

```javascript
const { data, error } = await employeeService.getAll();

if (error) {
  console.error("Error:", error);
} else {
  console.log("Employees:", data);
}
```

**Returns:** `{ data: Employee[] | null, error: Error | null }`

---

### `getById(id)`

Get a single employee by their ID.

```javascript
const { data, error } = await employeeService.getById(5);

if (error) {
  console.error("Error:", error);
} else {
  console.log("Employee:", data);
}
```

**Parameters:**

- `id` (number) - Employee ID

**Returns:** `{ data: Employee | null, error: Error | null }`

---

### `create(employeeData)`

Create a new employee.

```javascript
const newEmployee = {
  name: "Priya Sharma",
  email: "priya.sharma@company.com",
  role: "Full Stack Developer",
  department: "Engineering",
  status: "Active", // Optional, defaults to 'Active'
  joinDate: "2024-01-15", // Optional, defaults to today
};

const { data, error } = await employeeService.create(newEmployee);

if (error) {
  console.error("Error:", error);
} else {
  console.log("Created employee:", data);
}
```

**Parameters:**

- `employeeData` (object)
  - `name` (string, required) - Employee's full name
  - `email` (string, required) - Employee's email address
  - `role` (string, required) - Job role/title
  - `department` (string, required) - Department name
  - `status` (string, optional) - One of: 'Active', 'On Leave', 'Offline'
  - `avatar` (string, optional) - Avatar URL (auto-generated if not provided)
  - `joinDate` (string, optional) - Join date in YYYY-MM-DD format

**Returns:** `{ data: Employee | null, error: Error | null }`

---

### `update(id, updates)`

Update an existing employee's information.

```javascript
const updates = {
  role: "Senior Developer",
  department: "Engineering",
  status: "Active",
};

const { data, error } = await employeeService.update(5, updates);

if (error) {
  console.error("Error:", error);
} else {
  console.log("Updated employee:", data);
}
```

**Parameters:**

- `id` (number) - Employee ID to update
- `updates` (object) - Fields to update (same as create, all optional)

**Returns:** `{ data: Employee | null, error: Error | null }`

---

### `delete(id)`

Delete an employee from the database.

```javascript
const { success, error } = await employeeService.delete(5);

if (error) {
  console.error("Error:", error);
} else {
  console.log("Employee deleted successfully");
}
```

**Parameters:**

- `id` (number) - Employee ID to delete

**Returns:** `{ success: boolean, error: Error | null }`

---

### `search(query)`

Search employees by name, email, or department.

```javascript
const { data, error } = await employeeService.search("john");

if (error) {
  console.error("Error:", error);
} else {
  console.log("Search results:", data);
}
```

**Parameters:**

- `query` (string) - Search term

**Returns:** `{ data: Employee[] | null, error: Error | null }`

---

### `filter(filters)`

Filter employees by department and/or status.

```javascript
const filters = {
  department: "Engineering",
  status: "Active",
};

const { data, error } = await employeeService.filter(filters);

if (error) {
  console.error("Error:", error);
} else {
  console.log("Filtered employees:", data);
}
```

**Parameters:**

- `filters` (object, optional)
  - `department` (string, optional) - Filter by department
  - `status` (string, optional) - Filter by status

**Returns:** `{ data: Employee[] | null, error: Error | null }`

---

## Employee Data Structure

```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "On Leave" | "Offline";
  avatar: string;
  join_date: string; // YYYY-MM-DD format
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}
```

## Example: Complete CRUD Flow

```javascript
// 1. Create an employee
const { data: newEmp } = await employeeService.create({
  name: "Amit Kumar",
  email: "amit.k@company.com",
  role: "DevOps Engineer",
  department: "Engineering",
});

console.log("Created:", newEmp);

// 2. Get all employees
const { data: allEmployees } = await employeeService.getAll();
console.log("Total employees:", allEmployees.length);

// 3. Update the employee
const { data: updated } = await employeeService.update(newEmp.id, {
  role: "Senior DevOps Engineer",
  status: "Active",
});

console.log("Updated:", updated);

// 4. Search for the employee
const { data: searchResults } = await employeeService.search("amit");
console.log("Found:", searchResults);

// 5. Delete the employee
const { success } = await employeeService.delete(newEmp.id);
console.log("Deleted:", success);
```

## Error Handling Best Practices

Always check for errors before using data:

```javascript
const { data, error } = await employeeService.getAll();

if (error) {
  // Show user-friendly error message
  setToast({
    type: "error",
    message: "Failed to load employees. Please try again.",
  });

  // Log full error for debugging
  console.error("Supabase error:", error);

  return;
}

// Safe to use data here
setEmployees(data);
```

## Notes

- All methods are async and return Promises
- Errors are caught internally and returned in the response
- The service handles Supabase connection details automatically
- Avatar URLs are auto-generated using DiceBear API if not provided
- All database operations respect Row Level Security (RLS) policies
