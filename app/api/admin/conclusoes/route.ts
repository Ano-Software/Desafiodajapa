import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ChallengeCompletion = {
  id: string;
  challenge_slug: string;
  full_name: string;
  state: string;
  city: string;
  whatsapp: string;
  order_number: string;
  strava_screenshot_url: string;
  status: string;
  created_at: string;
};

const TABLE_NAME = "challenge_completions";

function getSupabaseAdminClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY precisam estar definidos."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

function isAuthorized(request: NextRequest) {
  const headerToken = request.headers.get("x-admin-token");
  const adminPassword = process.env.ADMIN_DASHBOARD_PASSWORD;

  return Boolean(
    adminPassword && headerToken && headerToken === adminPassword
  );
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
}

function toCsv(rows: ChallengeCompletion[]) {
  const headers = [
    "id",
    "created_at",
    "full_name",
    "state",
    "city",
    "whatsapp",
    "order_number",
    "challenge_slug",
    "strava_screenshot_url",
    "status",
  ];

  const escape = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (stringValue.includes(",") || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => escape((row as Record<string, unknown>)[header] as string))
        .join(",")
    ),
  ];

  return lines.join("\n");
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const challengeCompletions = (data ?? []) as ChallengeCompletion[];

    const wantsCsv =
      request.nextUrl.searchParams.get("format")?.toLowerCase().includes("csv") ||
      false;

    if (wantsCsv) {
      const csv = toCsv(challengeCompletions);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=conclusoes.csv",
        },
      });
    }

    return NextResponse.json({ data: challengeCompletions });
  } catch (error) {
    console.error("GET /api/admin/conclusoes error:", error);
    return NextResponse.json(
      { error: "Nao foi possivel carregar as conclusoes." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { error: "O campo id eh obrigatorio." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ status: "archived" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const updatedCompletion = data as ChallengeCompletion | null;

    return NextResponse.json({ data: updatedCompletion });
  } catch (error) {
    console.error("PATCH /api/admin/conclusoes error:", error);
    return NextResponse.json(
      { error: "Nao foi possivel arquivar a conclusao." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { error: "O campo id eh obrigatorio." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/conclusoes error:", error);
    return NextResponse.json(
      { error: "Nao foi possivel excluir a conclusao." },
      { status: 500 }
    );
  }
}
