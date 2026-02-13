
-- Departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Departments are publicly readable" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage departments" ON public.departments FOR ALL USING (true);

INSERT INTO public.departments (name) VALUES
  ('Surgery'), ('Anesthesia'), ('Internal Medicine'), ('Emergency Medicine'),
  ('Critical Care'), ('Pediatrics'), ('Advanced Practice Providers');

-- Students/trainees table
CREATE TABLE public.trainees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  unit TEXT NOT NULL,
  training_due_date DATE NOT NULL,
  walkthrough_complete INTEGER NOT NULL DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'Not Started',
  verification_attempts INTEGER NOT NULL DEFAULT 0,
  verification_failures INTEGER NOT NULL DEFAULT 0,
  latest_score INTEGER NOT NULL DEFAULT 0,
  cases_completed INTEGER NOT NULL DEFAULT 0,
  needs_practice BOOLEAN NOT NULL DEFAULT false,
  last_activity TEXT DEFAULT 'Not yet active',
  current_module TEXT DEFAULT 'Module 1: Anatomy Review',
  assigned_modules TEXT[] NOT NULL DEFAULT ARRAY['walkthrough', 'patient-cases', 'verification'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainees are publicly readable" ON public.trainees FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage trainees" ON public.trainees FOR ALL USING (true);

-- Seed trainees from mock data
INSERT INTO public.trainees (first_name, last_name, email, unit, training_due_date, walkthrough_complete, verification_status, verification_attempts, verification_failures, latest_score, cases_completed, needs_practice, last_activity, current_module) VALUES
  ('Sarah', 'Chen', 'sarah.chen@mercygeneral.edu', 'Anesthesia', '2026-02-20', 100, 'Verified', 1, 0, 94, 15, false, '2 hrs ago', 'Module 5: Advanced Lines'),
  ('James', 'Rodriguez', 'james.rodriguez@mercygeneral.edu', 'Surgery', '2026-02-14', 72, 'In Progress', 3, 2, 68, 8, true, '1 day ago', 'Module 3: Femoral Access'),
  ('Emily', 'Thompson', 'emily.thompson@mercygeneral.edu', 'Internal Medicine', '2026-02-12', 45, 'Not Started', 0, 0, 55, 4, true, '3 days ago', 'Module 2: Ultrasound Guidance'),
  ('Michael', 'Park', 'michael.park@mercygeneral.edu', 'Anesthesia', '2026-02-25', 100, 'In Progress', 2, 1, 82, 14, false, '5 hrs ago', 'Module 5: Advanced Lines'),
  ('Aisha', 'Patel', 'aisha.patel@mercygeneral.edu', 'Surgery', '2026-02-18', 88, 'In Progress', 1, 0, 76, 10, false, '12 hrs ago', 'Module 4: Subclavian Access'),
  ('David', 'Kim', 'david.kim@mercygeneral.edu', 'Internal Medicine', '2026-02-11', 0, 'Not Started', 0, 0, 42, 0, true, '5 days ago', 'Module 1: Anatomy Review'),
  ('Lisa', 'Wang', 'lisa.wang@mercygeneral.edu', 'Anesthesia', '2026-02-28', 100, 'Verified', 1, 0, 97, 17, false, '1 hr ago', 'Module 5: Advanced Lines'),
  ('Ryan', 'Foster', 'ryan.foster@mercygeneral.edu', 'Surgery', '2026-02-13', 60, 'Not Started', 2, 2, 61, 6, true, '2 days ago', 'Module 3: Femoral Access'),
  ('Maria', 'Gonzalez', 'maria.gonzalez@mercygeneral.edu', 'Internal Medicine', '2026-02-22', 95, 'In Progress', 2, 1, 88, 13, false, '4 hrs ago', 'Module 5: Advanced Lines'),
  ('Tom', 'Bradley', 'tom.bradley@mercygeneral.edu', 'Anesthesia', '2026-02-10', 0, 'Not Started', 0, 0, 38, 0, true, '1 week ago', 'Module 1: Anatomy Review'),
  ('Rachel', 'Nguyen', 'rachel.nguyen@mercygeneral.edu', 'Advanced Practice Providers', '2026-02-19', 80, 'In Progress', 1, 0, 79, 9, false, '6 hrs ago', 'Module 4: Subclavian Access'),
  ('Chris', 'Howard', 'chris.howard@mercygeneral.edu', 'Advanced Practice Providers', '2026-02-15', 55, 'Not Started', 0, 0, 52, 3, true, '2 days ago', 'Module 2: Ultrasound Guidance');

-- Coordinators table
CREATE TABLE public.coordinators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  assigned_areas TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.coordinators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coordinators are publicly readable" ON public.coordinators FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage coordinators" ON public.coordinators FOR ALL USING (true);

INSERT INTO public.coordinators (name, email, assigned_areas) VALUES
  ('Dr. Sarah Miller', 's.miller@mercygeneral.edu', ARRAY['Anesthesia', 'Surgery']),
  ('Dr. John Adams', 'j.adams@mercygeneral.edu', ARRAY['Surgery', 'Emergency Medicine']),
  ('Nancy Drew, RN', 'n.drew@mercygeneral.edu', ARRAY['Internal Medicine', 'Critical Care']);

-- Messages/Inbox table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_type TEXT NOT NULL DEFAULT 'coordinator',
  sender_name TEXT NOT NULL,
  recipient_ids TEXT[] NOT NULL DEFAULT '{}',
  recipient_names TEXT[] NOT NULL DEFAULT '{}',
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages are publicly readable" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage messages" ON public.messages FOR ALL USING (true);

-- Licenses table
CREATE TABLE public.licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainee_id UUID REFERENCES public.trainees(id) ON DELETE CASCADE,
  purchased_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expires_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Licenses are publicly readable" ON public.licenses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage licenses" ON public.licenses FOR ALL USING (true);

-- Training errors per student
CREATE TABLE public.trainee_errors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainee_id UUID REFERENCES public.trainees(id) ON DELETE CASCADE,
  error_type TEXT NOT NULL,
  case_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.trainee_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainee errors are publicly readable" ON public.trainee_errors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage trainee errors" ON public.trainee_errors FOR ALL USING (true);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_trainees_updated_at
  BEFORE UPDATE ON public.trainees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
