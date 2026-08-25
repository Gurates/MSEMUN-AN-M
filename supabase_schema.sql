-- ==============================================================================
-- MSEMUN 2026 — Supabase Database Schema
-- Run this entire script in your Supabase Project -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Table: registrations (Delegate Applications)
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT NOT NULL,
    school TEXT NOT NULL,
    grade TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    exp_list TEXT,
    committee_preference_1 TEXT NOT NULL,
    committee_preference_2 TEXT NOT NULL,
    committee_preference_3 TEXT NOT NULL,
    motivation_letter TEXT NOT NULL,
    message TEXT,
    "references" TEXT,
    status TEXT DEFAULT 'pending' NOT NULL
);

-- 2. Table: delegations (Delegation Applications)
CREATE TABLE IF NOT EXISTS public.delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT NOT NULL,
    school TEXT NOT NULL,
    delegation_name TEXT NOT NULL,
    expected_members INTEGER NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    all_emails TEXT NOT NULL,
    all_phones TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' NOT NULL
);

-- 3. Table: chairboard_apps (Chairboard Applications)
CREATE TABLE IF NOT EXISTS public.chairboard_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT NOT NULL,
    school TEXT NOT NULL,
    grade TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    exp_list TEXT,
    pref1 TEXT NOT NULL,
    pref2 TEXT NOT NULL,
    pref3 TEXT NOT NULL,
    motivation_letter TEXT NOT NULL,
    crisis_directive TEXT,
    ga_procedure TEXT,
    q_ai_suspicion TEXT NOT NULL,
    q_final_documents TEXT NOT NULL,
    q_directive_help TEXT,
    q_resolution_paper TEXT,
    q_disagreement TEXT NOT NULL,
    message TEXT,
    references_text TEXT,
    status TEXT DEFAULT 'pending' NOT NULL
);

-- 4. Table: admin_apps (Admin Staff Applications)
CREATE TABLE IF NOT EXISTS public.admin_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT NOT NULL,
    school TEXT NOT NULL,
    grade TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    org_exp_list TEXT,
    references_text TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' NOT NULL
);

-- 5. Table: press_apps (Press Corps Applications)
CREATE TABLE IF NOT EXISTS public.press_apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT NOT NULL,
    school TEXT NOT NULL,
    grade TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    org_exp_list TEXT,
    camera_model TEXT,
    references_text TEXT,
    message TEXT,
    status TEXT DEFAULT 'pending' NOT NULL
);

-- ==============================================================================
-- Row Level Security (RLS) & Access Policies
-- Allows anonymous visitors on the website to submit applications (INSERT),
-- while protecting submitted data from public reading.
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chairboard_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_apps ENABLE ROW LEVEL SECURITY;

-- 1. registrations Policies
CREATE POLICY "Allow anonymous insert on registrations" 
ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read on registrations" 
ON public.registrations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update on registrations" 
ON public.registrations FOR UPDATE TO authenticated USING (true);

-- 2. delegations Policies
CREATE POLICY "Allow anonymous insert on delegations" 
ON public.delegations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read on delegations" 
ON public.delegations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update on delegations" 
ON public.delegations FOR UPDATE TO authenticated USING (true);

-- 3. chairboard_apps Policies
CREATE POLICY "Allow anonymous insert on chairboard_apps" 
ON public.chairboard_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read on chairboard_apps" 
ON public.chairboard_apps FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update on chairboard_apps" 
ON public.chairboard_apps FOR UPDATE TO authenticated USING (true);

-- 4. admin_apps Policies
CREATE POLICY "Allow anonymous insert on admin_apps" 
ON public.admin_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read on admin_apps" 
ON public.admin_apps FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update on admin_apps" 
ON public.admin_apps FOR UPDATE TO authenticated USING (true);

-- 5. press_apps Policies
CREATE POLICY "Allow anonymous insert on press_apps" 
ON public.press_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read on press_apps" 
ON public.press_apps FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update on press_apps" 
ON public.press_apps FOR UPDATE TO authenticated USING (true);
