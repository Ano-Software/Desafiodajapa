import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do registro não informado." },
      { status: 400 }
    );
  }

  let body: { is_confirmed?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Formato do corpo inválido." },
      { status: 400 }
    );
  }

  if (typeof body.is_confirmed !== "boolean") {
    return NextResponse.json(
      { error: "O campo is_confirmed precisa ser booleano." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("challenge_completions")
    .update({ is_confirmed: body.is_confirmed })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao atualizar challenge_completion:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o registro." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do registro não informado." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("challenge_completions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir challenge_completion:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o registro." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
