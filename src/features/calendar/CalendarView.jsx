import React, { useState } from "react";
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
import { ChevronLeft, ChevronRight, MapPin, Plus } from "lucide-react";
import "./calendar-styles.css";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock Events
  const events = [
    {
      id: 1,
      title: "Team Standup",
      date: new Date(),
      time: "10:00 AM",
      type: "meeting",
      colorClass: "event-meeting",
    },
    {
      id: 2,
      title: "Project Review",
      date: new Date(),
      time: "2:00 PM",
      type: "work",
      colorClass: "event-work",
    },
    {
      id: 3,
      title: "Client Call",
      date: addDays(new Date(), 2),
      time: "11:30 AM",
      type: "client",
      colorClass: "event-client",
    },
    {
      id: 4,
      title: "Design Workshop",
      date: addDays(new Date(), 5),
      time: "1:00 PM",
      type: "workshop",
      colorClass: "event-workshop",
    },
  ];

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
                      <MapPin size={12} />
                      <span>Conference Room A</span>
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
