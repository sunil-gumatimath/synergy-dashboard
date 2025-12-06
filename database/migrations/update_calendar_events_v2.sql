-- Migration to update calendar_events table with new fields for enhanced features
-- Adds end_time, recurrence, and is_all_day columns

ALTER TABLE public.calendar_events
ADD COLUMN IF NOT EXISTS end_time TEXT,
ADD COLUMN IF NOT EXISTS recurrence TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN DEFAULT FALSE;

-- Add comment to columns for clarity
COMMENT ON COLUMN public.calendar_events.end_time IS 'End time of the event in HH:MM format';
COMMENT ON COLUMN public.calendar_events.recurrence IS 'Recurrence pattern: none, daily, weekly, monthly, yearly';
COMMENT ON COLUMN public.calendar_events.is_all_day IS 'Flag to indicate if the event lasts all day';
