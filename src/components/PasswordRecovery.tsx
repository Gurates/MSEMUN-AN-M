import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

export function PasswordRecovery() {
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [complete, setComplete] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage('Bağlantı geçersiz veya süresi dolmuş. Giriş ekranından yeni bağlantı isteyin.');
        return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage(error.message);
        return;
      }
      setPassword('');
      setComplete(true);
      setMessage('Şifreniz güncellendi.');
    } catch {
      setMessage('Şifre kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#060608] text-white grid place-items-center p-6">
      <form onSubmit={save} className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 p-8">
        <h1 className="text-2xl font-bold">Şifre yenileme</h1>
        {!complete && <>
          <label className="block">Yeni şifre
            <input type="password" autoComplete="new-password" required value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg bg-white/10 p-3" />
          </label>
          <button disabled={saving} className="btn-primary">{saving ? 'Kaydediliyor…' : 'Şifreyi kaydet'}</button>
        </>}
        {message && <p role="status">{message}</p>}
        <a href="/admin" className="block text-amber-400 underline">Yönetici girişine dön</a>
      </form>
    </main>
  );
}
