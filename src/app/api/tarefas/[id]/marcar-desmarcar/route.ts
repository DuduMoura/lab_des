import { prisma } from "@/src/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
  
export async function PUT(
  req: NextRequest,
  { params }: any
) {
  const tarefa = await prisma.tarefas.findFirst({
    where: {
      id: Number(params.id),
    },
  });
  await prisma.tarefas.update({
    where: {
      id: Number(params.id),
    },
    data: {
      concluido: !tarefa?.concluido,
    },
  });
  return NextResponse.json({
    message: "Registro alterado",
  });
}
