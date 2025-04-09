import { useMutation, useQuery } from "@tanstack/react-query";
import { stringify } from "querystring";
import { json } from "stream/consumers";

async function getNoticias() {
    const res = await fetch('/api/tarefas')
    if (!res.ok) {
        throw new Error("Erro na busca de noticias")
    }
    return res.json();
}

async function marcarOuDesmarcar(id: number) {
    const res = await fetch(`/api/tarefas/${id}/marcar-desmarcar`, {
        method: 'PUT'
    })
    if (!res.ok) {
        throw new Error("Erro na busca de noticias")
    }
    return res.json();
}

export function useNoticias() {
    return useQuery({
      queryKey: ["noticias"],
      queryFn: getNoticias,
      refetchOnWindowFocus: false
    });
  }

  
export function useMarcarDesmarcar() {
    return useMutation({
        mutationFn: ({ id }: any) => marcarOuDesmarcar(id)
    });
  }

export function useCreateNoticia() {
    return useMutation({
        mutationFn: (data) => createNoticia(data)
    });
}

async function createNoticia(data: any) {
    const res = await fetch('/api/tarefas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        throw new Error("Erro ao criar noticia")
    }
    return res.json();
}

export function useDeleteNoticia() {
    return useMutation({
        mutationFn: (data: any) => deleteNoticia(data.id)
    });
}

async function deleteNoticia(id: number) {
    const res = await fetch(`/api/tarefas/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    if (!res.ok) {
        throw new Error("Erro ao deletear noticia")
    }
    return res.json();
}