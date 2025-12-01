"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ChallengeCompletion = {
  id: string;
  created_at: string;
  full_name: string;
  state: string;
  city: string;
  whatsapp: string;
  order_number: string;
  challenge_slug: string;
  strava_screenshot_url: string;
  status: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminConclusoesPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [records, setRecords] = useState<ChallengeCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const isAuthenticated = useMemo(() => Boolean(authToken), [authToken]);

  const fetchRecords = useCallback(async () => {
    if (!authToken) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/conclusoes", {
        headers: {
          "x-admin-token": authToken,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Nao foi possivel carregar os dados.");
      }

      const payload = (await response.json()) as { data: ChallengeCompletion[] };
      setRecords(payload.data ?? []);
      setFeedback(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel carregar os dados.";
      setFeedback(message);
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecords();
    }
  }, [fetchRecords, isAuthenticated]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordInput.trim()) {
      setFeedback("Informe a senha de acesso.");
      return;
    }
    setAuthToken(passwordInput.trim());
    setFeedback(null);
  };

  const handleArchive = async (id: string) => {
    if (!authToken) return;

    try {
      const response = await fetch("/api/admin/conclusoes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": authToken,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao arquivar registro.");
      }

      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel arquivar o registro.";
      setFeedback(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!authToken) return;
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este registro? Esta acao nao pode ser desfeita."
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin/conclusoes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": authToken,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao excluir registro.");
      }

      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nao foi possivel excluir o registro.";
      setFeedback(message);
    }
  };

  const handleDownloadCsv = async () => {
    if (!authToken) return;
    try {
      const response = await fetch(
        "/api/admin/conclusoes?format=csv=true",
        {
          headers: {
            "x-admin-token": authToken,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao gerar CSV.");
      }

      const csvText = await response.text();
      const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "conclusoes.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Nao foi possivel baixar o CSV.";
      setFeedback(message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Painel de conclusoes - Desafio da Japa</h1>
          <p className="mt-2 text-sm text-slate-600">
            Gerencie os envios registrados na plataforma.
          </p>
        </header>

        {!isAuthenticated ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              Area restrita
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Informe a senha para acessar as conclusoes.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Senha do painel
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(event) => setPasswordInput(event.target.value)}
                  className="mt-1 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Digite a senha"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-emerald-600 px-6 text-base font-semibold text-white transition hover:bg-emerald-500"
              >
                Entrar
              </button>
            </form>

            {feedback && (
              <p className="mt-4 text-sm text-red-600">
                {feedback}
              </p>
            )}
          </section>
        ) : (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Acesso concedido
                </p>
                <p className="text-xs text-slate-500">
                  Token aplicado para requisicoes administrativas.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={fetchRecords}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Atualizar lista
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Baixar CSV
                </button>
              </div>
            </div>

            {feedback && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {feedback}
              </div>
            )}

            <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
              {isLoading ? (
                <p className="p-6 text-center text-sm text-slate-500">
                  Carregando registros...
                </p>
              ) : records.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">
                  Nenhuma conclusao ativa encontrada.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-4 py-3">Nome</th>
                      <th className="px-4 py-3">Cidade / Estado</th>
                      <th className="px-4 py-3">WhatsApp</th>
                      <th className="px-4 py-3">Nº do pedido</th>
                      <th className="px-4 py-3">Slug</th>
                      <th className="px-4 py-3">Print</th>
                      <th className="px-4 py-3 text-center">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((record) => (
                      <tr key={record.id} className="align-top">
                        <td className="px-4 py-3 text-slate-600">
                          {formatDate(record.created_at)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {record.full_name}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {record.city} / {record.state}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {record.whatsapp}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {record.order_number}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {record.challenge_slug}
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={record.strava_screenshot_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 underline"
                          >
                            Abrir
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-2 text-sm sm:flex-row">
                            <button
                              onClick={() => handleArchive(record.id)}
                              className="rounded-full border border-slate-300 px-3 py-1 font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                              Arquivar
                            </button>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="rounded-full border border-red-200 px-3 py-1 font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
