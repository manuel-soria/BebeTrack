-- BebeTrack Events Table
-- Simple table to store all baby tracking events

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id TEXT, -- 'santi' or 'jero', NULL for extraction events
  type TEXT NOT NULL, -- 'feed', 'pee', 'poop', 'bath', 'extraction', 'other'
  subtype TEXT, -- for feed: 'breast', 'pumped', 'formula', 'solid'
  other_subtype TEXT, -- for other: 'weighing', 'illness', 'generic'
  date_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_min INTEGER, -- for breast feeding
  ml INTEGER, -- for pumped, formula, extraction
  consistency TEXT, -- for poop
  poop_color TEXT, -- for poop
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries by date
CREATE INDEX IF NOT EXISTS idx_events_date_time ON public.events(date_time DESC);

-- Create index for filtering by baby
CREATE INDEX IF NOT EXISTS idx_events_baby_id ON public.events(baby_id);

-- Enable RLS but allow all operations (simple shared app without auth)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read events
CREATE POLICY "Allow anonymous read" ON public.events
  FOR SELECT USING (true);

-- Allow anyone to insert events
CREATE POLICY "Allow anonymous insert" ON public.events
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update events
CREATE POLICY "Allow anonymous update" ON public.events
  FOR UPDATE USING (true);

-- Allow anyone to delete events
CREATE POLICY "Allow anonymous delete" ON public.events
  FOR DELETE USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
