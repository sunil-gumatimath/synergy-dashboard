import React, { useState, useEffect, useCallback } from "react";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  isToday,
  addDays,
  subDays,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, Plus, Award, Clock, Trash2, Edit2, Calendar } from "lucide-react";
import { employeeService } from "../../services/employeeService";
import { calendarService } from "../../services/calendarService";
import LoadingSpinner from "../../components/LoadingSpinner";
import AddEventModal from "../../components/AddEventModal";
import ConfirmModal from "../../components/ConfirmModal";
import "./calendar-styles.css";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState("month"); // "month", "week", "day"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch employees for anniversaries
      const { data: employees } = await employeeService.getAll();

      // Fetch calendar events
      const { data: calendarEvents } = await calendarService.getAll();

      let allEvents = [];

      // Process Anniversaries
      if (employees) {
        const currentYear = currentMonth.getFullYear();
        const anniversaryEvents = employees.map(emp => {
          if (!emp.join_date) return null;

          const joinDate = new Date(emp.join_date);
          const anniversaryDate = new Date(currentYear, joinDate.getMonth(), joinDate.getDate());
          const years = currentYear - joinDate.getFullYear();

          if (years <= 0) return null;

          return {
            id: `anniversary-${emp.id}`,
            title: `${emp.name}'s ${years}${getOrdinal(years)} Work Anniversary`,
            date: anniversaryDate,
            time: "All Day",
            type: "anniversary",
            colorClass: "event-client",
            location: "Office Celebration",
            isAnniversary: true
          };
        }).filter(Boolean);
        allEvents = [...allEvents, ...anniversaryEvents];
      }

      // Process Calendar Events
      if (calendarEvents) {
        const formattedEvents = calendarEvents.map(evt => ({
          ...evt,
          date: parseISO(evt.date), // Ensure date object correctly parsed from ISO string
          colorClass: getEventColorClass(evt.type),
          isAnniversary: false
        }));
        allEvents = [...allEvents, ...formattedEvents];
      }

      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const getEventColorClass = (type) => {
    switch (type) {
      case "meeting": return "event-meeting"; // You might need to define these in CSS if not existing
      case "holiday": return "event-holiday";
      case "deadline": return "event-deadline";
      default: return "event-personal"; // Default color
    }
  };

  const next = () => {
    if (view === "month") setCurrentMonth(addMonths(currentMonth, 1));
    else if (view === "week") setCurrentMonth(addWeeks(currentMonth, 1));
    else if (view === "day") setCurrentMonth(addDays(currentMonth, 1));
  };

  const prev = () => {
    if (view === "month") setCurrentMonth(subMonths(currentMonth, 1));
    else if (view === "week") setCurrentMonth(subWeeks(currentMonth, 1));
    else if (view === "day") setCurrentMonth(subDays(currentMonth, 1));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
    if (view === "month") {
      // Optional: switch to day view on click?
      // setView("day");
      // setCurrentMonth(day);
    }
  };

  const handleAddEvent = (date = null) => {
    if (date) setSelectedDate(date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEvent = async (formData) => {
    setIsLoading(true);
    try {
      if (editingEvent) {
        await calendarService.update(editingEvent.id, formData);
      } else {
        await calendarService.create(formData);
      }
      await fetchEvents();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsLoading(true);
    try {
      await calendarService.delete(eventToDelete.id);
      await fetchEvents();
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <div className="calendar-header-title">
          <h2 className="flex items-center gap-2">
            <Calendar size={28} className="text-primary" />
            {view === "month" && format(currentMonth, "MMMM yyyy")}
            {view === "week" && `Week of ${format(startOfWeek(currentMonth), "MMM d, yyyy")}`}
            {view === "day" && format(currentMonth, "MMMM d, yyyy")}
          </h2>
          <p>Manage your schedule and events</p>
        </div>
        <div className="calendar-header-actions">
          <div className="calendar-nav">
            <button
              type="button"
              onClick={prev}
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
              onClick={next}
              className="calendar-nav-button"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="view-switcher">
            <button
              className={`view-switcher-btn ${view === "month" ? "active" : ""}`}
              onClick={() => setView("month")}
            >
              Month
            </button>
            <button
              className={`view-switcher-btn ${view === "week" ? "active" : ""}`}
              onClick={() => setView("week")}
            >
              Week
            </button>
            <button
              className={`view-switcher-btn ${view === "day" ? "active" : ""}`}
              onClick={() => setView("day")}
            >
              Day
            </button>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleAddEvent(new Date())}
          >
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
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={`calendar-event ${event.colorClass}`}
                title={event.title}
              >
                {event.time && event.time !== "All Day" ? event.time.substring(0, 5) : ""} {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-muted pl-1">
                + {dayEvents.length - 3} more
              </div>
            )}
          </div>

          <button
            type="button"
            className="calendar-day-add-button"
            aria-label="Add event"
            onClick={(e) => {
              e.stopPropagation();
              handleAddEvent(cloneDay);
            }}
          >
            <Plus size={14} />
          </button>
        </div>,
      );
      day = addDays(day, 1);
    }

    return <div className="calendar-days">{cells}</div>;
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentMonth);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const dayEvents = events.filter((e) => isSameDay(e.date, day));
      const isSelected = isSameDay(day, selectedDate);
      const isTodayDate = isToday(day);

      days.push(
        <div
          key={day.toISOString()}
          className={`calendar-week-day ${isSelected ? "selected" : ""} ${isTodayDate ? "today" : ""}`}
          onClick={() => onDateClick(day)}
        >
          <div className="calendar-week-header">
            <span className="week-day-name">{format(day, "EEE")}</span>
            <span className="week-day-number">{format(day, "d")}</span>
          </div>
          <div className="calendar-week-events">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`calendar-event ${event.colorClass}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEvent(event);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{event.title}</span>
                  {event.time && <span className="text-[10px] opacity-80">{event.time}</span>}
                </div>
              </div>
            ))}
            <button
              className="add-event-week-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleAddEvent(day);
              }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      );
    }

    return <div className="calendar-week-view">{days}</div>;
  };

  const renderDayView = () => {
    const day = currentMonth;
    const dayEvents = events.filter((e) => isSameDay(e.date, day));

    // Generate time slots from 8 AM to 8 PM (or 24h)
    const timeSlots = [];
    for (let i = 8; i <= 20; i++) {
      timeSlots.push(i);
    }

    return (
      <div className="calendar-day-view">
        <div className="day-view-header">
          <div className="day-view-date">
            <span className="text-3xl font-bold text-main">{format(day, "d")}</span>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-muted">{format(day, "EEEE")}</span>
              <span className="text-sm text-muted">{format(day, "MMMM yyyy")}</span>
            </div>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => handleAddEvent(day)}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>

        <div className="day-view-timeline">
          {timeSlots.map(hour => {
            // Find events that start in this hour
            // This is a simple approximation. Real implementation would parse time strings properly.
            const hourEvents = dayEvents.filter(e => {
              if (!e.time) return false;
              const [h] = e.time.split(':');
              return parseInt(h) === hour;
            });

            return (
              <div key={hour} className="day-view-hour">
                <div className="day-view-time">{hour}:00</div>
                <div className="day-view-content">
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={`day-event-card ${event.colorClass}`}
                      onClick={() => handleEditEvent(event)}
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-xs opacity-80 flex gap-2">
                        <span>{event.time}</span>
                        {event.location && <span>📍 {event.location}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* All day events or events without time */}
          <div className="day-view-hour">
            <div className="day-view-time">All Day</div>
            <div className="day-view-content">
              {dayEvents.filter(e => !e.time || e.time === "All Day").map(event => (
                <div
                  key={event.id}
                  className={`day-event-card ${event.colorClass}`}
                  onClick={() => handleEditEvent(event)}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-xs opacity-80">All Day</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
              <div key={event.id} className="calendar-event-card group relative">
                <div className="calendar-event-time">
                  <Clock size={14} className="inline mr-1" />
                  {event.time}
                </div>
                <div className={`calendar-event-details ${event.colorClass}`}>
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="calendar-event-location mt-1">
                      {event.isAnniversary ? <Award size={12} /> : <MapPin size={12} />}
                      <span>{event.location || "No location"}</span>
                    </div>
                    {event.description && (
                      <p className="text-xs mt-2 opacity-80 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                </div>

                {!event.isAnniversary && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-1.5 bg-white/90 rounded-md hover:bg-white text-blue-600 shadow-sm"
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(event)}
                      className="p-1.5 bg-white/90 rounded-md hover:bg-white text-red-600 shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="calendar-empty-state">
              <p>No events scheduled</p>
              <button type="button" onClick={() => handleAddEvent(selectedDate)}>+ Add Event</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading && !events.length) {
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
              {view === "month" && (
                <>
                  {renderDays()}
                  {renderCells()}
                </>
              )}
              {view === "week" && renderWeekView()}
              {view === "day" && renderDayView()}
            </div>
          </div>
        </div>
        <div className="card p-8">{renderSidebar()}</div>
      </div>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialDate={selectedDate}
        eventToEdit={editingEvent}
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default CalendarView;
