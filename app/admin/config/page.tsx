"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminChallenge = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminConfigPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  async function loadChallenges() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/challenges", {
        cache: "no-store",
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Erro ao carregar desafios.");
      }

      setChallenges(json.data ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar desafios.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddChallenge(event: FormEvent) {
    event.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      setError("Nome e slug são obrigatórios.");
      return;
    }

    setFormLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim(), slug: formSlug.trim() }),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Não foi possível adicionar o desafio.");
      }

      setChallenges((prev) => [json.data, ...prev]);
      setFormName("");
      setFormSlug("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível adicionar o desafio.";
      setError(message);
    } finally {
      setFormLoading(false);
    }
  }

  function startEditing(challenge: AdminChallenge) {
    setEditingId(challenge.id);
    setEditName(challenge.name);
    setEditSlug(challenge.slug);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
    setSavingId(null);
  }

  async function saveEdit(challenge: AdminChallenge) {
    if (!editName.trim() || !editSlug.trim()) {
      setError("Nome e slug são obrigatórios.");
      return;
    }

    setSavingId(challenge.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/challenges/${challenge.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          slug: editSlug.trim(),
        }),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Não foi possível atualizar o desafio.");
      }

      setChallenges((prev) =>
        prev.map((item) => (item.id === challenge.id ? json.data : item))
      );
      cancelEditing();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o desafio.";
      setError(message);
    } finally {
      setSavingId(null);
    }
  }

  async function toggleActive(challenge: AdminChallenge) {
    const nextValue = !challenge.is_active;
    setTogglingId(challenge.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/challenges/${challenge.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextValue }),
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Não foi possível atualizar o status.");
      }

      setChallenges((prev) =>
        prev.map((item) => (item.id === challenge.id ? json.data : item))
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o status.";
      setError(message);
    } finally {
      setTogglingId(null);
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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-slate-900">
              Configurações do Painel – Desafio da Japa
            </h1>
            <p className="text-base text-slate-500">
              Gerencie os desafios e faça logout do painel.
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

        <section className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold text-slate-900">
            Adicionar novo desafio
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Informe o nome e o slug para registrar um desafio.
          </p>

          <form
            onSubmit={handleAddChallenge}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">
                Nome do desafio
              </label>
              <input
                type="text"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                placeholder="Ex.: Corrida 5K"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">
                Slug
              </label>
              <input
                type="text"
                value={formSlug}
                onChange={(event) => setFormSlug(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                placeholder="ex.: corrida-5k"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formLoading ? "Adicionando..." : "Adicionar desafio"}
              </button>
            </div>
          </form>
        </section>

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-500 shadow-sm">
            {error}
          </div>
        )}

        <section className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Desafios configurados
              </h2>
              <p className="text-sm text-slate-500">
                Edite nomes, slugs e status dos desafios ativos.
              </p>
            </div>
            <button
              type="button"
              onClick={loadChallenges}
              className="self-start rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Recarregar lista
            </button>
          </div>

          {loading ? (
            <p className="mt-6 text-center text-sm text-slate-500">
              Carregando desafios...
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Status</th>
                     <th className="px-4 py-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        Nenhum desafio cadastrado até o momento.
                      </td>
                    </tr>
                  )}
                  {challenges.map((challenge, index) => {
                    const rowBg = index % 2 === 0 ? "bg-white" : "bg-slate-50";
                    const isEditing = editingId === challenge.id;
                    const statusClasses = challenge.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700";
                    const statusLabel = challenge.is_active
                      ? "Ativo"
                      : "Inativo";

                    return (
                      <tr key={challenge.id} className={rowBg}>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={(event) => setEditName(event.target.value)}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            />
                          ) : (
                            <span className="font-medium text-slate-900">
                              {challenge.name}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editSlug}
                              onChange={(event) => setEditSlug(event.target.value)}
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                            />
                          ) : (
                            <span>{challenge.slug}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => saveEdit(challenge)}
                                  disabled={savingId === challenge.id}
                                  className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {savingId === challenge.id
                                    ? "Salvando..."
                                    : "Salvar"}
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditing}
                                  className="rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEditing(challenge)}
                                  className="rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleActive(challenge)}
                                  disabled={togglingId === challenge.id}
                                  className="rounded-full border border-slate-300 px-4 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {togglingId === challenge.id
                                    ? "Atualizando..."
                                    : challenge.is_active
                                    ? "Desativar"
                                    : "Ativar"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
