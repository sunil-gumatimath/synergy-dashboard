-- ========================================
-- Notifications System Schema
-- ========================================

-- 1. NOTIFICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info'
    CHECK (type IN ('info', 'success', 'warning', 'error', 'task', 'event', 'ticket')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT, -- Optional link to navigate to
  metadata JSONB, -- Additional data (task_id, event_id, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON notifications
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- System can create notifications for any user (via service role)
CREATE POLICY "Service can create notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- 2. NOTIFICATION PREFERENCES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  task_assigned BOOLEAN DEFAULT TRUE,
  task_completed BOOLEAN DEFAULT TRUE,
  task_due_soon BOOLEAN DEFAULT TRUE,
  ticket_created BOOLEAN DEFAULT TRUE,
  ticket_resolved BOOLEAN DEFAULT TRUE,
  event_reminder BOOLEAN DEFAULT TRUE,
  employee_updates BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences" ON notification_preferences
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. FUNCTION TO CREATE NOTIFICATIONS
-- ========================================
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS notifications AS $$
DECLARE
  new_notification notifications;
BEGIN
  INSERT INTO notifications (user_id, title, message, type, link, metadata)
  VALUES (p_user_id, p_title, p_message, p_type, p_link, p_metadata)
  RETURNING * INTO new_notification;
  
  RETURN new_notification;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. TRIGGER FOR TASK ASSIGNMENTS
-- ========================================
CREATE OR REPLACE FUNCTION notify_task_assigned()
RETURNS TRIGGER AS $$
DECLARE
  assignee_email TEXT;
  assignee_user_id UUID;
BEGIN
  -- Only notify if assignee changed and is not null
  IF NEW.assignee_id IS NOT NULL AND 
     (OLD.assignee_id IS NULL OR OLD.assignee_id != NEW.assignee_id) THEN
    
    -- Get assignee's email from employees table
    SELECT email INTO assignee_email
    FROM employees
    WHERE id = NEW.assignee_id;
    
    -- Find the auth user with this email
    SELECT id INTO assignee_user_id
    FROM auth.users
    WHERE email = assignee_email;
    
    -- Create notification if user exists
    IF assignee_user_id IS NOT NULL THEN
      PERFORM create_notification(
        assignee_user_id,
        'New Task Assigned',
        'You have been assigned a new task: ' || NEW.title,
        'task',
        '/tasks',
        jsonb_build_object('task_id', NEW.id, 'priority', NEW.priority)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS task_assigned_notification ON tasks;
CREATE TRIGGER task_assigned_notification
  AFTER INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_task_assigned();

-- 5. ENABLE REALTIME FOR NOTIFICATIONS
-- ========================================
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 6. SAMPLE NOTIFICATIONS (Optional - for testing)
-- ========================================
-- Note: These will need actual user_ids from your auth.users table
-- INSERT INTO notifications (user_id, title, message, type, link) VALUES
--   ('your-user-uuid', 'Welcome to Aurora!', 'Thank you for joining our platform.', 'success', '/dashboard'),
--   ('your-user-uuid', 'Complete your profile', 'Add your profile picture and details.', 'info', '/settings');
