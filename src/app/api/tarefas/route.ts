import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    const registros = await prisma.tarefas.findMany({
        include: {
            usuario: {
                select: {
                    id: true,
                    nome: true
                }
            }
        }
    })
    return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
    const data = await req.json()
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return NextResponse.json({
            message: 'Usuário precisa estar autenticado!'
        }, {
            status: 400
        })
    }
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

    const registro = await prisma.tarefas.create({
        data: {
            titulo: data.titulo,
            usuario_id: Number(user.id)
        }
    })

    return NextResponse.json(registro)
}