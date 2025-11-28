import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, Plus, Award } from "lucide-react";
import { employeeService } from "../../services/employeeService";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./calendar-styles.css";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const { data: employees } = await employeeService.getAll();

      if (employees) {
        const currentYear = new Date().getFullYear();

        const anniversaryEvents = employees.map(emp => {
          if (!emp.join_date) return null;

          const joinDate = new Date(emp.join_date);
          const anniversaryDate = new Date(currentYear, joinDate.getMonth(), joinDate.getDate());
          const years = currentYear - joinDate.getFullYear();

          if (years <= 0) return null; // Hasn't completed a year yet

          return {
            id: `anniversary-${emp.id}`,
            title: `${emp.name}'s ${years}${getOrdinal(years)} Work Anniversary`,
            date: anniversaryDate,
            time: "All Day",
            type: "anniversary",
            colorClass: "event-client", // Using purple/client color for celebrations
            location: "Office Celebration",
            isAnniversary: true
          };
        }).filter(Boolean);

        setEvents(anniversaryEvents);
      } else {
        setEvents([]); // No mock events, so set to empty if no employees
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, [currentMonth]); // Changed dependency to currentMonth for potential re-fetch logic, assuming 'currentDate' was a typo.

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onDateClick = (day) => setSelectedDate(day);

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <div className="calendar-header-title">
          <h2>{format(currentMonth, "MMMM yyyy")}</h2>
          <p>Manage your schedule and events</p>
        </div>
        <div className="calendar-header-actions">
          <div className="calendar-nav">
            <button
              type="button"
              onClick={prevMonth}
              className="calendar-nav-button"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date())}
              className="calendar-nav-today"
            >
              Today
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="calendar-nav-button"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button type="button" className="btn btn-primary">
            <Plus size={18} />
            <span>Add Event</span>
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="calendar-weekday">
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }
    return <div className="calendar-weekdays">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const cells = [];
    let day = startDate;

    while (day <= endDate) {
      const formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const dayEvents = events.filter((e) => isSameDay(e.date, day));
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const today = isToday(day);

      const dayClasses = [
        "calendar-day",
        !isCurrentMonth && "not-current-month",
        isSelected && "selected",
        today && "today",
      ]
        .filter(Boolean)
        .join(" ");

      cells.push(
        <div
          key={cloneDay.toISOString()}
          role="button"
          tabIndex={0}
          onClick={() => onDateClick(cloneDay)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onDateClick(cloneDay);
            }
          }}
          className={dayClasses}
          aria-pressed={isSelected}
        >
          <div className="calendar-day-header">
            <span className="calendar-day-number">{formattedDate}</span>
            {dayEvents.length > 0 && (
              <span className="calendar-day-event-count">
                {dayEvents.length} evt
              </span>
            )}
          </div>

          <div className="calendar-day-events">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`calendar-event ${event.colorClass}`}
              >
                {event.time} - {event.title}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="calendar-day-add-button"
            aria-label="Add event"
          >
            <Plus size={14} />
          </button>
        </div>,
      );
      day = addDays(day, 1);
    }

    return <div className="calendar-days">{cells}</div>;
  };

  const renderSidebar = () => {
    const selectedDayEvents = events.filter((e) =>
      isSameDay(e.date, selectedDate),
    );

    return (
      <div className="calendar-sidebar">
        <div className="calendar-sidebar-header">
          <h3>{format(selectedDate, "EEEE, MMMM do")}</h3>
          <p>{selectedDayEvents.length} events scheduled</p>
        </div>

        <div className="calendar-sidebar-events">
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((event) => (
              <div key={event.id} className="calendar-event-card">
                <div className="calendar-event-time">{event.time}</div>
                <div className={`calendar-event-details ${event.colorClass}`}>
                  <div>
                    <h4>{event.title}</h4>
                    <div className="calendar-event-location">
                      {event.isAnniversary ? <Award size={12} /> : <MapPin size={12} />}
                      <span>{event.location || "Conference Room A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="calendar-empty-state">
              <p>No events scheduled</p>
              <button type="button">+ Add Event</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="calendar-container">
        <LoadingSpinner size="lg" message="Loading calendar events..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">{renderHeader()}</div>
      <div className="calendar-layout">
        <div className="card p-0">
          <div className="calendar-grid-wrapper">
            <div className="calendar-grid-container">
              {renderDays()}
              {renderCells()}
            </div>
          </div>
        </div>
        <div className="card p-8">{renderSidebar()}</div>
      </div>
    </div>
  );
};

export default CalendarView;
