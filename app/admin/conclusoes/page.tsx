"use client";

import { useEffect, useState } from "react";

type ChallengeCompletion = {
  id: string;
  challenge_name: string | null;
  challenge_slug: string | null;
  full_name: string;
  state: string;
  city: string;
  whatsapp: string;
  order_number: string;
  strava_screenshot_url: string | null;
  created_at: string;
  is_confirmed: boolean | null;
};

type ModalImage = {
  url: string;
  label: string;
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

const formatWhatsapp = (value: string) => {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11
    )}`;
  }
  return value;
};

export default function AdminConclusoesPage() {
  const [records, setRecords] = useState<ChallengeCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ModalImage | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/challenge-completions", {
        cache: "no-store",
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Erro ao carregar registros.");
      }

      setRecords(json.data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar registros.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleConfirmation(record: ChallengeCompletion) {
    const nextValue = !record.is_confirmed;
    setUpdatingId(record.id);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/challenge-completions/${record.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_confirmed: nextValue }),
        }
      );
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Não foi possível atualizar o registro.");
      }

      const updated = (json.data ?? {
        ...record,
        is_confirmed: nextValue,
      }) as ChallengeCompletion;

      setRecords((prev) =>
        prev.map((item) => (item.id === record.id ? updated : item))
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o registro.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(record: ChallengeCompletion) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este registro? Essa ação não poderá ser desfeita."
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(record.id);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/challenge-completions/${record.id}`,
        { method: "DELETE" }
      );
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Não foi possível excluir o registro.");
      }

      setRecords((prev) => prev.filter((item) => item.id !== record.id));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível excluir o registro.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  function openImageModal(record: ChallengeCompletion) {
    if (!record.strava_screenshot_url) return;
    setSelectedImage({
      url: record.strava_screenshot_url,
      label: record.full_name,
    });
  }

  function closeImageModal() {
    setSelectedImage(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-semibold text-slate-900">
            Conclusões de Desafios – Desafio da Japa
          </h1>
          <p className="text-base text-slate-500">
            Acompanhe os envios registrados na plataforma.
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-md">
            Carregando...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-500 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="rounded-2xl bg-white p-2 shadow-md sm:p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Desafio</th>
                    <th className="px-4 py-3">Nome completo</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Cidade</th>
                    <th className="px-4 py-3">WhatsApp</th>
                    <th className="px-4 py-3">Número do pedido</th>
                    <th className="px-4 py-3">Print Strava</th>
                    <th className="px-4 py-3 text-center">Confirmar</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {records.map((record, index) => {
                    const rowBg = index % 2 === 0 ? "bg-white" : "bg-slate-50";
                    return (
                      <tr key={record.id} className={rowBg}>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                          {formatDateTime(record.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          {record.challenge_name?.trim() ||
                            record.challenge_slug ||
                            "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {record.full_name}
                        </td>
                        <td className="px-4 py-3">{record.state || "—"}</td>
                        <td className="px-4 py-3">{record.city || "—"}</td>
                        <td className="px-4 py-3">
                          {formatWhatsapp(record.whatsapp)}
                        </td>
                        <td className="px-4 py-3">
                          {record.order_number || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {record.strava_screenshot_url ? (
                            <button
                              type="button"
                              onClick={() => openImageModal(record)}
                              className="group inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            >
                              <img
                                src={record.strava_screenshot_url}
                                alt={`Print do Strava de ${record.full_name}`}
                                className="h-14 w-20 rounded-lg border border-slate-200 object-cover transition group-hover:scale-[1.02]"
                              />
                            </button>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                            checked={Boolean(record.is_confirmed)}
                            onChange={() => toggleConfirmation(record)}
                            disabled={updatingId === record.id}
                            aria-label={`Marcar ${record.full_name} como confirmado`}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDelete(record)}
                            disabled={deletingId === record.id}
                            className="rounded-full border border-red-200 px-4 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === record.id ? "Excluindo..." : "Excluir"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {records.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={closeImageModal}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeImageModal}
              className="absolute -right-2 -top-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow"
            >
              Fechar
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.label}
              className="h-full w-full rounded-2xl bg-black object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
