-- ==============================================================================
-- MSEMUN 2026 — Supabase Güvenlik Sıkılaştırma & RLS Onarımı (Security Patch)
-- Bu SQL betiğini Supabase Dashboard -> SQL Editor -> New Query içine yapıştırıp "Run" butonuna basınız.
-- ==============================================================================

-- 1. ADIM: Güvenlik açığı oluşturan Anonim OKUMA (SELECT) ve GÜNCELLEME (UPDATE) izinlerini kaldır
DROP POLICY IF EXISTS "Allow anonymous read on registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow anonymous update on registrations" ON public.registrations;

DROP POLICY IF EXISTS "Allow anonymous read on delegations" ON public.delegations;
DROP POLICY IF EXISTS "Allow anonymous update on delegations" ON public.delegations;

DROP POLICY IF EXISTS "Allow anonymous read on chairboard_apps" ON public.chairboard_apps;
DROP POLICY IF EXISTS "Allow anonymous update on chairboard_apps" ON public.chairboard_apps;

DROP POLICY IF EXISTS "Allow anonymous read on admin_apps" ON public.admin_apps;
DROP POLICY IF EXISTS "Allow anonymous update on admin_apps" ON public.admin_apps;

DROP POLICY IF EXISTS "Allow anonymous read on press_apps" ON public.press_apps;
DROP POLICY IF EXISTS "Allow anonymous update on press_apps" ON public.press_apps;

-- 2. ADIM: Tablolarda RLS'nin (Row Level Security) aktif olduğundan emin ol
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chairboard_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_apps ENABLE ROW LEVEL SECURITY;

-- 3. ADIM: Anonim ziyaretçilere SADECE yeni başvuru ekleme (INSERT) izni ver (Okuma ASLA YOK)
-- Böylece siteye gelen delegeler başvurabilir, ancak veritabanındaki hiçbir kaydı okuyamaz/çekemez!

DROP POLICY IF EXISTS "Allow anonymous insert on registrations" ON public.registrations;
CREATE POLICY "Allow anonymous insert on registrations" 
ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert on delegations" ON public.delegations;
CREATE POLICY "Allow anonymous insert on delegations" 
ON public.delegations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert on chairboard_apps" ON public.chairboard_apps;
CREATE POLICY "Allow anonymous insert on chairboard_apps" 
ON public.chairboard_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert on admin_apps" ON public.admin_apps;
CREATE POLICY "Allow anonymous insert on admin_apps" 
ON public.admin_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert on press_apps" ON public.press_apps;
CREATE POLICY "Allow anonymous insert on press_apps" 
ON public.press_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 4. ADIM: Giriş yapmış yöneticilere (Supabase Auth ile oturum açan admin) TAM ERİŞİM ver (SELECT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admin full access on registrations" ON public.registrations;
CREATE POLICY "Admin full access on registrations"
ON public.registrations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access on delegations" ON public.delegations;
CREATE POLICY "Admin full access on delegations"
ON public.delegations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access on chairboard_apps" ON public.chairboard_apps;
CREATE POLICY "Admin full access on chairboard_apps"
ON public.chairboard_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access on admin_apps" ON public.admin_apps;
CREATE POLICY "Admin full access on admin_apps"
ON public.admin_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access on press_apps" ON public.press_apps;
CREATE POLICY "Admin full access on press_apps"
ON public.press_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);
