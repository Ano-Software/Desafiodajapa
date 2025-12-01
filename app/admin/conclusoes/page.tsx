"use client";

import { useEffect, useState } from "react";

type ChallengeCompletion = {
  id: string;
  challenge_slug: string;
  full_name: string;
  state: string;
  city: string;
  whatsapp: string;
  order_number: string;
  strava_screenshot_url: string;
  created_at: string;
};

export default function AdminConclusoesPage() {
  const [records, setRecords] = useState<ChallengeCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/admin/challenge-completions", {
          cache: "no-store",
        });
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || "Erro ao carregar registros");
        }

        setRecords(json.data ?? []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro ao carregar registros";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">
            Conclusoes de Desafios – Desafio da Japa
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Acompanhe os envios registrados na plataforma.
          </p>
        </header>

        {loading && <p>Carregando...</p>}
        {error && (
          <p className="rounded-lg border border-red-400 bg-red-500/10 p-3 text-red-200">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Nome completo</th>
                  <th className="px-4 py-3">Cidade/UF</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Numero do pedido</th>
                  <th className="px-4 py-3">Print Strava</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-900/60">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-200">
                      {new Date(record.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.challenge_slug}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-50">
                      {record.full_name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.city}/{record.state}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.whatsapp}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {record.order_number}
                    </td>
                    <td className="px-4 py-3">
                      {record.strava_screenshot_url ? (
                        <a
                          href={record.strava_screenshot_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 underline"
                        >
                          Ver print
                        </a>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}

                {records.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
