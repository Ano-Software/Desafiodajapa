"use client";

import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Loader2, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { getSupabaseBrowserClient } from "@/lib/supabase-client";

type ChallengeInfo = {
  slug: string;
  name: string;
};

type ChallengeFormProps = {
  slug: string;
  challenge: ChallengeInfo;
};

type FormValues = {
  fullName: string;
  state: string;
  city: string;
  whatsapp: string;
  orderNumber: string;
  screenshot: FileList;
};

type SubmissionStatus =
  | { type: "idle" }
  | { type: "success" }
  | { type: "error"; message: string };

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const WHATSAPP_REGEX = /^\(\d{2}\) \d{5}-\d{4}$/;

const formatWhatsapp = (input: string) => {
  const digits = input.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length < 2) return `(${digits}`;
  if (digits.length === 2) return `(${digits}) `;
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export function ChallengeForm({ slug, challenge }: ChallengeFormProps) {
  const challengeName = challenge?.name?.trim() || "Desafio Virtual";
  let decodedSlug = "";
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    decodedSlug = slug;
  }
  const challengeSlugLabel = decodedSlug.trim() || slug || "desafio";
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      state: "",
      city: "",
      whatsapp: "",
      orderNumber: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>({ type: "idle" });

  const screenshotList = watch("screenshot");
  const screenshotName =
    screenshotList && screenshotList.length > 0
      ? screenshotList[0]?.name
      : undefined;

  const stateRegister = register("state", {
    required: "Informe o estado (UF).",
    minLength: {
      value: 2,
      message: "Use a sigla com 2 letras.",
    },
  });

  const screenshotRegister = register("screenshot", {
    required: "Envie o print do Strava.",
    validate: {
      maxSize: (files) => {
        const file = files?.[0];
        if (!file) return "Envie o print do Strava.";
        return (
          file.size <= MAX_FILE_SIZE || "A imagem deve ter no maximo 5MB."
        );
      },
      isImage: (files) => {
        const file = files?.[0];
        if (!file) return "Envie o print do Strava.";
        return (
          file.type.startsWith("image/") || "Envie um arquivo de imagem."
        );
      },
    },
  });

  const onSubmit = async (values: FormValues) => {
    setStatus({ type: "idle" });
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const screenshotFile = values.screenshot?.[0];

      if (!screenshotFile) {
        throw new Error(
          "Envie o print do Strava para concluir o registro do desafio."
        );
      }

      const extension =
        screenshotFile.name.split(".").pop()?.toLowerCase() ??
        screenshotFile.type.split("/").pop() ??
        "png";
      const filePath = `${slug}/${uuidv4()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("challenge-prints")
        .upload(filePath, screenshotFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: screenshotFile.type,
        });

      if (uploadError) {
        throw new Error(
          `Nao foi possivel enviar sua imagem. (${uploadError.message})`
        );
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("challenge-prints").getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("challenge_completions")
        .insert({
          challenge_slug: slug,
          challenge_name: challengeName,
          full_name: values.fullName,
          state: values.state,
          city: values.city,
          whatsapp: values.whatsapp,
          order_number: values.orderNumber,
          strava_screenshot_url: publicUrl,
        });

      if (insertError) {
        throw new Error(
          `Nao foi possivel salvar suas informacoes. (${insertError.message})`
        );
      }

      reset({
        fullName: "",
        state: "",
        city: "",
        whatsapp: "",
        orderNumber: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setStatus({ type: "success" });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Houve um problema ao registrar sua conclusao. Tente novamente.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 text-slate-800">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
          Desafio selecionado
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {challengeName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Slug:{" "}
          <span className="font-mono text-slate-700">
            /conclusao/{challengeSlugLabel}
          </span>
        </p>
      </div>

      {status.type === "success" && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
          <p>
            Conclusao registrada com sucesso! Obrigado por participar do
            Desafio da Japa / Superando Limites.
          </p>
        </div>
      )}

      {status.type === "error" && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 text-red-500" aria-hidden />
          <p>{status.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
            <span>Nome completo</span>
            <input
              type="text"
              autoComplete="name"
              {...register("fullName", {
                required: "Informe seu nome completo.",
                minLength: {
                  value: 3,
                  message: "Digite pelo menos 3 caracteres.",
                },
              })}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
          </label>
          {errors.fullName && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
              <span>Estado</span>
              <input
                type="text"
                inputMode="text"
                maxLength={2}
                {...stateRegister}
                onChange={(event) => {
                  const sanitized = event.target.value
                    .replace(/[^a-zA-Z]/g, "")
                    .toUpperCase()
                    .slice(0, 2);
                  event.target.value = sanitized;
                  stateRegister.onChange(event);
                }}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base uppercase tracking-wide text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>
            {errors.state && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.state.message}
              </span>
            )}
          </div>

          <div>
            <label className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
              <span>Cidade</span>
              <input
                type="text"
                autoComplete="address-level2"
                {...register("city", {
                  required: "Informe a cidade.",
                })}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>
            {errors.city && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.city.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
              <span>WhatsApp</span>
              <Controller
                name="whatsapp"
                control={control}
                rules={{
                  required: "Informe seu contato de WhatsApp.",
                  validate: (value) =>
                    WHATSAPP_REGEX.test(value) ||
                    "Use o formato (99) 99999-9999.",
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    inputMode="numeric"
                    placeholder="(11) 91234-5678"
                    onChange={(event) =>
                      field.onChange(formatWhatsapp(event.target.value))
                    }
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                  />
                )}
              />
            </label>
            {errors.whatsapp && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.whatsapp.message}
              </span>
            )}
          </div>

          <div>
            <label className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
              <span>Numero do pedido (Nuvemshop)</span>
              <input
                type="text"
                autoComplete="off"
                {...register("orderNumber", {
                  required: "Informe o numero do pedido.",
                })}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              />
            </label>
            {errors.orderNumber && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.orderNumber.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <span>Upload da foto (print do Strava)</span>
            <div className="rounded-xl border border-slate-300 bg-white p-4">
              <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 focus-within:ring-2 focus-within:ring-emerald-500/40">
                <Upload className="h-4 w-4" aria-hidden />
                Escolher arquivo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  {...screenshotRegister}
                  ref={(element) => {
                    screenshotRegister.ref(element);
                    fileInputRef.current = element;
                  }}
                />
              </label>
              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {screenshotName ? (
                  <>
                    Arquivo selecionado:{" "}
                    <span className="font-medium text-slate-800">
                      {screenshotName}
                    </span>
                  </>
                ) : (
                  "Nenhum arquivo selecionado ainda."
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Envie o print do Strava ou app de corrida (ate 5MB).
              </p>
            </div>
          </label>
          {errors.screenshot && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.screenshot.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 text-base font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:text-emerald-700/70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Enviando...
            </>
          ) : (
            "Enviar conclusao"
          )}
        </button>
      </form>
    </section>
  );
}
