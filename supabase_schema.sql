
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

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chairboard_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on registrations" 
ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admin full access on registrations" 
ON public.registrations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on delegations" 
ON public.delegations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admin full access on delegations" 
ON public.delegations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on chairboard_apps" 
ON public.chairboard_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admin full access on chairboard_apps" 
ON public.chairboard_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on admin_apps" 
ON public.admin_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admin full access on admin_apps" 
ON public.admin_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on press_apps" 
ON public.press_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admin full access on press_apps" 
ON public.press_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);
