import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("admin_challenges")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar admin_challenges:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os desafios." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  let body: { name?: unknown; slug?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Formato do corpo inválido." },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Nome e slug são obrigatórios." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("admin_challenges")
    .insert({
      name,
      slug,
      is_active: true,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao criar admin_challenge:", error);
    return NextResponse.json(
      { error: "Não foi possível criar o desafio." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
