import React, { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { employees } from "../../data/employees";

const EmployeeList = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredEmployees = employees.filter(
		(emp) =>
			emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
			emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const getStatusClass = (status) => {
		switch (status) {
			case "Active":
				return "status-active";
			case "On Leave":
				return "status-leave";
			default:
				return "status-offline";
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="mb-6 flex justify-between items-center gap-4">
				<input
					type="text"
					placeholder="Search employees..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="search-input"
				/>
				<Button onClick={() => alert("Add Employee modal would open here")}>
					Add Employee
				</Button>
			</div>

			<div className="employee-grid">
				{filteredEmployees.map((employee) => (
					<Card key={employee.id}>
						<div className="employee-card-header">
							<div className="employee-info">
								<img
									src={employee.avatar}
									alt={employee.name}
									className="employee-avatar"
								/>
								<div className="employee-details">
									<h3>{employee.name}</h3>
									<p>{employee.role}</p>
								</div>
							</div>
							<span
								className={`status-badge ${getStatusClass(employee.status)}`}
							>
								{employee.status}
							</span>
						</div>

						<div className="employee-meta">
							<div className="meta-row">
								<span className="meta-label">Department</span>
								<span className="meta-value">{employee.department}</span>
							</div>
							<div className="meta-row">
								<span className="meta-label">Email</span>
								<span className="meta-value">{employee.email}</span>
							</div>
						</div>

						<div className="card-actions">
							<Button
								variant="ghost"
								className="flex-1 justify-center"
								onClick={() => alert(`Edit ${employee.name}`)}
							>
								Edit
							</Button>
							<Button
								variant="ghost"
								className="flex-1 justify-center btn-danger-ghost"
								onClick={() =>
									confirm(`Are you sure you want to delete ${employee.name}?`)
								}
							>
								Delete
							</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

export default EmployeeList;
