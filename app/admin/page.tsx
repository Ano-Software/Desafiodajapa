'use client'

import { useEffect, useState } from 'react'

type ChallengeCompletion = {
id: string
challenge_slug: string
full_name: string
state: string
city: string
whatsapp: string
order_number: string
strava_screenshot_url: string
created_at: string
}

export default function AdminDashboardPage() {
const [data, setData] = useState<ChallengeCompletion[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
async function load() {
try {
const res = await fetch('/api/admin/challenge-completions', {
cache: 'no-store',
})
const json = await res.json()

    if (!res.ok) {
      throw new Error(json.error || 'Erro ao carregar registros')
    }

    setData(json.data || [])
  } catch (err: any) {
    setError(err.message || 'Erro ao carregar registros')
  } finally {
    setLoading(false)
  }
}

load()


}, [])

return (
<main className="min-h-screen bg-slate-950 text-slate-50 p-6">
<h1 className="text-2xl font-bold mb-4">
Conclusões dos Desafios – Desafio da Japa
</h1>

  {loading && <p>Carregando...</p>}
  {error && <p className="text-red-400">{error}</p>}

  {!loading && !error && (
    <div className="overflow-x-auto border border-slate-800 rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-3 py-2 text-left">Data</th>
            <th className="px-3 py-2 text-left">Desafio</th>
            <th className="px-3 py-2 text-left">Nome</th>
            <th className="px-3 py-2 text-left">Cidade/UF</th>
            <th className="px-3 py-2 text-left">WhatsApp</th>
            <th className="px-3 py-2 text-left">Pedido</th>
            <th className="px-3 py-2 text-left">Print</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t border-slate-800">
              <td className="px-3 py-2">
                {new Date(row.created_at).toLocaleString('pt-BR')}
              </td>
              <td className="px-3 py-2">{row.challenge_slug}</td>
              <td className="px-3 py-2">{row.full_name}</td>
              <td className="px-3 py-2">
                {row.city}/{row.state}
              </td>
              <td className="px-3 py-2">{row.whatsapp}</td>
              <td className="px-3 py-2">{row.order_number}</td>
              <td className="px-3 py-2">
                <a
                  href={row.strava_screenshot_url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-emerald-400"
                >
                  Ver print
                </a>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-3 py-4 text-center text-slate-400"
              >
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</main>


)
}
