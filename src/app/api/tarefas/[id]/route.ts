import { prisma } from "@/src/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, { params }: any ) {
    await prisma.tarefas.delete({
        where: {
            id: Number(params.id)
        }
    })
    return NextResponse.json({
        message: "Registro deletado"
    })
}