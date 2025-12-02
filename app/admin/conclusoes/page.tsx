"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ChallengeCompletion = {
  id: string;
  challenge_name: string | null;
  challenge_slug: string | null;
  full_name: string;
  state: string | null;
  city: string | null;
  whatsapp: string | null;
  order_number: string | null;
  strava_screenshot_url: string | null;
  created_at: string;
  is_confirmed: boolean | null;
};

type ModalImage = {
  url: string;
  label: string;
};

type StatusFilter = "all" | "confirmed" | "pending";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

const formatWhatsapp = (value: string | null) => {
  if (!value) return "-";
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
  const router = useRouter();
  const [records, setRecords] = useState<ChallengeCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ModalImage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    loadData();
  }, []);

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const bySearch = term
      ? records.filter((record) => {
          const fullName = record.full_name?.toLowerCase() ?? "";
          const orderNumber = record.order_number?.toLowerCase() ?? "";
          return fullName.includes(term) || orderNumber.includes(term);
        })
      : records;

    if (statusFilter === "all") {
      return bySearch;
    }

    return bySearch.filter((record) => {
      const isConfirmed = Boolean(record.is_confirmed);
      if (statusFilter === "confirmed") {
        return isConfirmed;
      }
      return !isConfirmed;
    });
  }, [records, searchTerm, statusFilter]);

  useEffect(() => {
    const maxPage = Math.max(
      1,
      Math.ceil(filteredRecords.length / pageSize) || 1
    );
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredRecords.length, page, pageSize]);

  const totalRecords = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize) || 1);
  const startIndex = (page - 1) * pageSize;
  const pageItems = filteredRecords.slice(startIndex, startIndex + pageSize);
  const displayStart = totalRecords === 0 ? 0 : startIndex + 1;
  const displayEnd =
    totalRecords === 0 ? 0 : Math.min(totalRecords, startIndex + pageItems.length);

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
    const confirmation = window.confirm(
      "Tem certeza de que deseja excluir este registro? Essa ação não poderá ser desfeita."
    );

    if (!confirmation) {
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

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
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

  const emptyMessage =
    searchTerm.trim().length > 0
      ? "Nenhum registro encontrado para essa busca."
      : "Nenhum registro encontrado.";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-slate-900">
              Conclusões de Desafios – Desafio da Japa
            </h1>
            <p className="text-base text-slate-500">
              Acompanhe os envios registrados na plataforma.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Buscar por nome ou número do pedido
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Ex.: Ana Silva ou 12345"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="w-full sm:max-w-xs">
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Filtrar por status
            </label>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="confirmed">Confirmados</option>
            </select>
          </div>
        </div>

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
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {pageItems.map((record, index) => {
                    const rowBg = index % 2 === 0 ? "bg-white" : "bg-slate-50";
                    const isConfirmed = Boolean(record.is_confirmed);
                    const badgeClasses = isConfirmed
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600";
                    const badgeLabel = isConfirmed ? "Confirmado" : "Pendente";

                    return (
                      <tr key={record.id} className={rowBg}>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                          {formatDateTime(record.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          {record.challenge_name?.trim() ||
                            record.challenge_slug ||
                            "-"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {record.full_name}
                        </td>
                        <td className="px-4 py-3">{record.state || "-"}</td>
                        <td className="px-4 py-3">{record.city || "-"}</td>
                        <td className="px-4 py-3">
                          {formatWhatsapp(record.whatsapp)}
                        </td>
                        <td className="px-4 py-3">
                          {record.order_number || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {record.strava_screenshot_url ? (
                            <div className="flex flex-col items-start gap-2">
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
                              <a
                                href={record.strava_screenshot_url}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-emerald-600 underline hover:text-emerald-500"
                              >
                                Baixar
                              </a>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleConfirmation(record)}
                            disabled={updatingId === record.id}
                            className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition ${
                              updatingId === record.id
                                ? "opacity-60"
                                : "hover:opacity-90"
                            } ${badgeClasses}`}
                          >
                            {updatingId === record.id ? "Atualizando..." : badgeLabel}
                          </button>
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

                  {filteredRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 px-2 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <p>
                {totalRecords === 0
                  ? "Mostrando 0 de 0 registros"
                  : `Mostrando ${displayStart}-${displayEnd} de ${totalRecords} registros`}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="rounded-full border border-slate-300 px-4 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {totalRecords === 0 ? 0 : page} de{" "}
                    {totalRecords === 0 ? 0 : totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={page >= totalPages || totalRecords === 0}
                    className="rounded-full border border-slate-300 px-4 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Próxima
                  </button>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  Por página
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
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
