import React, { useState } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus } from 'lucide-react';

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
            color: "bg-indigo-100 text-indigo-700 border-indigo-200"
        },
        {
            id: 2,
            title: "Project Review",
            date: new Date(),
            time: "2:00 PM",
            type: "work",
            color: "bg-purple-100 text-purple-700 border-purple-200"
        },
        {
            id: 3,
            title: "Client Call",
            date: addDays(new Date(), 2),
            time: "11:30 AM",
            type: "client",
            color: "bg-orange-100 text-orange-700 border-orange-200"
        },
        {
            id: 4,
            title: "Design Workshop",
            date: addDays(new Date(), 5),
            time: "1:00 PM",
            type: "workshop",
            color: "bg-pink-100 text-pink-700 border-pink-200"
        }
    ];

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const onDateClick = (day) => setSelectedDate(day);

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your schedule and events</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-md text-gray-600 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-x border-gray-200 transition-colors">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-md text-gray-600 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <button className="btn btn-primary">
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
                <div key={i} className="text-center text-sm font-semibold text-gray-400 py-4 uppercase tracking-wider">
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;

                const dayEvents = events.filter(e => isSameDay(e.date, day));
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);

                days.push(
                    <div
                        key={day}
                        className={`
              min-h-[120px] p-3 border-b border-r border-gray-100 transition-all cursor-pointer relative group
              ${!isCurrentMonth ? "bg-gray-50/50 text-gray-400" : "bg-white"}
              ${isSelected ? "bg-indigo-50/30" : "hover:bg-gray-50"}
              ${isToday(day) ? "bg-indigo-50/10" : ""}
            `}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`
                text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                ${isToday(day) ? "bg-indigo-600 text-white shadow-md" : "text-gray-700"}
                ${isSelected && !isToday(day) ? "bg-indigo-100 text-indigo-700" : ""}
              `}>
                                {formattedDate}
                            </span>
                            {dayEvents.length > 0 && (
                                <span className="text-xs font-medium text-gray-400">{dayEvents.length} events</span>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            {dayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={`text-xs px-2 py-1 rounded border truncate ${event.color}`}
                                >
                                    {event.time} - {event.title}
                                </div>
                            ))}
                        </div>

                        {/* Add button that appears on hover */}
                        <button className="absolute bottom-2 right-2 p-1.5 rounded-full bg-indigo-50 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-100">
                            <Plus size={14} />
                        </button>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day} className="grid grid-cols-7 border-l border-t border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm">
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="mb-8">{rows}</div>;
    };

    const renderSidebar = () => {
        const selectedDayEvents = events.filter(e => isSameDay(e.date, selectedDate));

        return (
            <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-sm p-8 h-fit">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                        {format(selectedDate, 'EEEE, MMMM do')}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {selectedDayEvents.length} events scheduled
                    </p>
                </div>

                <div className="space-y-4">
                    {selectedDayEvents.length > 0 ? (
                        selectedDayEvents.map(event => (
                            <div key={event.id} className="flex flex-col gap-1">
                                <div className="text-xs font-semibold text-gray-500 mb-1">
                                    {event.time}
                                </div>
                                <div className={`p-5 rounded-lg border ${event.color}`}>
                                    <div className="px-1">
                                        <h4 className="font-bold text-sm text-gray-900 mb-1.5">{event.title}</h4>
                                        <div className="flex items-center gap-1.5 text-xs opacity-75">
                                            <MapPin size={12} />
                                            <span>Conference Room A</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <p className="text-sm">No events scheduled</p>
                            <button className="mt-4 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                + Add Event
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            {renderHeader()}
            <div className="flex gap-8 items-start">
                <div className="flex-1">
                    {renderDays()}
                    {renderCells()}
                </div>
                {renderSidebar()}
            </div>
        </div>
    );
};

export default CalendarView;
