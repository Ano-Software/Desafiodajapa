'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
const router = useRouter()
const [password, setPassword] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

async function handleSubmit(e: FormEvent) {
e.preventDefault()
setLoading(true)
setError(null)

try {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json.error || 'Erro ao fazer login')
  }

  router.push('/admin')
} catch (err: any) {
  setError(err.message || 'Erro ao fazer login')
} finally {
  setLoading(false)
}


}

return (
<main className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
<div className="w-full max-w-sm bg-slate-800 rounded-xl p-6 shadow-lg">
<h1 className="text-xl font-semibold mb-4 text-center">
Login Admin – Desafio da Japa
</h1>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Senha do painel</label>
        <input
          type="password"
          className="w-full rounded-md px-3 py-2 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-md font-semibold bg-emerald-500 disabled:opacity-60"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  </div>
</main>


)
}
