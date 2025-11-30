-- Trigger to automatically create an employee record when a new user signs up via Supabase Auth

-- 1. Create the function handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.employees (
    email,
    name,
    role,
    department,
    status,
    avatar,
    join_date
  )
  VALUES (
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    'Employee', -- Default role
    'Engineering', -- Default department (can be updated later)
    'Active',
    COALESCE(
      new.raw_user_meta_data->>'avatar_url', 
      'https://api.dicebear.com/9.x/micah/svg?seed=' || (new.raw_user_meta_data->>'full_name')
    ),
    CURRENT_DATE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
