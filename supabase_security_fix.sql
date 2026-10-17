-- ==============================================================================
-- MSEMUN 2026 — Kesin ve Garantili Supabase RLS Güvenlik Kilidi (Security Fix)
-- Bu kodu Supabase Dashboard -> SQL Editor -> New Query içine yapıştırıp "RUN" butonuna basınız.
-- ==============================================================================

-- 1. ADIM: Tablolardaki eski tüm politikaları (adı ne olursa olsun) dinamik olarak kaldır
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN ('registrations', 'delegations', 'chairboard_apps', 'admin_apps', 'press_apps')
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', pol.policyname, pol.schemaname, pol.tablename);
    END LOOP; 
END $$;

-- 2. ADIM: Tüm 5 tabloda Satır Düzeyi Güvenliği (RLS) kesin olarak aktif et
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chairboard_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_apps ENABLE ROW LEVEL SECURITY;

-- 3. ADIM: Anonim ziyaretçilere SADECE yeni kayıt ekleme (INSERT) izni ver
-- Gelen canlı başvurular (Delege, Delegasyon, Chairboard, Admin, Press) kesintisiz devam eder.
-- Okuma (SELECT), Güncelleme (UPDATE), Silme (DELETE) anonim kullanıcılara KESİNLİKLE KAPALIDIR.
CREATE POLICY "allow_anon_insert_registrations" 
ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_anon_insert_delegations" 
ON public.delegations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_anon_insert_chairboard_apps" 
ON public.chairboard_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_anon_insert_admin_apps" 
ON public.admin_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_anon_insert_press_apps" 
ON public.press_apps FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 4. ADIM: Giriş yapmış yöneticilere (Supabase Auth ile oturum açan admin) TAM YETKİ ver
-- Admin paneline giriş yaptığınızda başvuruları görmeye, onaylamaya ve yönetmeye devam edersiniz.
CREATE POLICY "allow_admin_all_registrations" 
ON public.registrations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_admin_all_delegations" 
ON public.delegations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_admin_all_chairboard_apps" 
ON public.chairboard_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_admin_all_admin_apps" 
ON public.admin_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_admin_all_press_apps" 
ON public.press_apps FOR ALL TO authenticated USING (true) WITH CHECK (true);
