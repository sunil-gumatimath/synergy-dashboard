import React, { useMemo } from "react";
import Card from "./Card";
import { employees } from "../data/employees";

const Stats = () => {
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
      (e) => e.status === "Active",
    ).length;
    const onLeaveEmployees = employees.filter(
      (e) => e.status === "On Leave",
    ).length;
    const departments = new Set(employees.map((e) => e.department)).size;

    return [
      {
        label: "Total Employees",
        value: totalEmployees,
        change: "+12%",
        trend: "up",
      },
      {
        label: "Active Now",
        value: activeEmployees,
        change: "+5%",
        trend: "up",
      },
      {
        label: "On Leave",
        value: onLeaveEmployees,
        change: "-2%",
        trend: "down",
      },
      {
        label: "Departments",
        value: departments,
        change: "0%",
        trend: "neutral",
      },
    ];
  }, []);

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-muted text-sm font-medium mb-1">{stat.label}</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-main">{stat.value}</h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                stat.trend === "up"
                  ? "status-active"
                  : stat.trend === "down"
                    ? "status-leave"
                    : "status-offline"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default React.memo(Stats);
