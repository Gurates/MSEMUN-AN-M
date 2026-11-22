-- Mevcut veritabanında Supabase SQL Editor ile tek işlem olarak çalıştırın.
BEGIN;

CREATE SCHEMA IF NOT EXISTS msemun_private;
REVOKE ALL ON SCHEMA msemun_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA msemun_private TO authenticated;

CREATE TABLE IF NOT EXISTS msemun_private.panel_admins (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
REVOKE ALL ON msemun_private.panel_admins FROM PUBLIC, anon, authenticated;
ALTER TABLE msemun_private.panel_admins ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON msemun_private.panel_admins TO authenticated;
DROP POLICY IF EXISTS own_membership ON msemun_private.panel_admins;
CREATE POLICY own_membership ON msemun_private.panel_admins FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.is_panel_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM msemun_private.panel_admins WHERE user_id = (SELECT auth.uid())
    );
$$;
REVOKE ALL ON FUNCTION public.is_panel_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_panel_admin() TO authenticated;

DO $$
DECLARE
    app record;
    old_policy record;
BEGIN
    FOR app IN SELECT * FROM (VALUES
        ('registrations', 'full_name, school, grade, email, phone, exp_list, committee_preference_1, committee_preference_2, committee_preference_3, motivation_letter, message, "references"'),
        ('delegations', 'full_name, school, delegation_name, expected_members, email, phone, all_emails, all_phones, message'),
        ('chairboard_apps', 'full_name, school, grade, email, phone, exp_list, pref1, pref2, pref3, motivation_letter, crisis_directive, ga_procedure, q_ai_suspicion, q_final_documents, q_directive_help, q_resolution_paper, q_disagreement, message, references_text'),
        ('admin_apps', 'full_name, school, grade, email, phone, org_exp_list, references_text, message'),
        ('press_apps', 'full_name, school, grade, email, phone, org_exp_list, camera_model, references_text, message')
    ) AS forms(table_name, input_columns) LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', app.table_name);
        FOR old_policy IN SELECT policyname FROM pg_policies
            WHERE schemaname = 'public' AND tablename = app.table_name
        LOOP
            EXECUTE format('DROP POLICY %I ON public.%I', old_policy.policyname, app.table_name);
        END LOOP;

        EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC, anon, authenticated', app.table_name);
        EXECUTE format('ALTER TABLE public.%I ALTER COLUMN status SET DEFAULT %L', app.table_name, 'pending');
        EXECUTE format('GRANT INSERT (%s) ON public.%I TO anon, authenticated', app.input_columns, app.table_name);
        EXECUTE format('GRANT SELECT, UPDATE (status) ON public.%I TO authenticated', app.table_name);
        EXECUTE format('CREATE POLICY submit_application ON public.%I FOR INSERT TO anon, authenticated
                        WITH CHECK (status = %L)', app.table_name, 'pending');
        EXECUTE format('CREATE POLICY review_applications ON public.%I FOR SELECT TO authenticated
                        USING ((SELECT public.is_panel_admin()))', app.table_name);
        EXECUTE format('CREATE POLICY decide_application ON public.%I FOR UPDATE TO authenticated
                        USING ((SELECT public.is_panel_admin()))
                        WITH CHECK ((SELECT public.is_panel_admin()) AND status IN (''pending'', ''approved'', ''rejected'', ''waitlist''))', app.table_name);
    END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
COMMIT;
