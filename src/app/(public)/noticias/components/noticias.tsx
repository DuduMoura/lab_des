"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCreateNoticia,
  useDeleteNoticia,
  useMarcarDesmarcar,
  useNoticias,
} from "../actions/fetchNoticias";

export default function NoticiasSection() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading, data, isFetching } = useNoticias();

  const { mutateAsync: marcarDesmarcar, isPending } = useMarcarDesmarcar();
  const { mutateAsync: create, isPending: isLoadingCriacao } =
    useCreateNoticia();
  const { mutateAsync: deletaNoticia, isPending: isLoadingDelete } =
    useDeleteNoticia();

  function onSubmit(data: any) {
    create(data, {
      onSuccess: () => {
        console.log("Sucesso");
        queryClient.invalidateQueries({ queryKey: ["noticias"] });
      },
      onError: () => {
        console.log("Erro");
      },
    });
  }

  return (
    <>
      {isLoadingCriacao && <span>Criando noticia ...</span>}
      <div className="flex justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit({
              titulo: formData.get("titulo"),
            });
          }}
        >
          <input name="titulo" placeholder="titulo" />
          <button type="submit">Criar</button>
        </form>
        {isLoadingDelete && <span>Deletando noticia ...</span>}
      </div>
      {!isFetching ? (
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {data?.map((post: any) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="group relative">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                  <button onClick={() => {
                    marcarDesmarcar({
                      id: post.id
                    }, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ["noticias"],
                        });
                      }
                    })
                  }}>
                    <span className="absolute inset-0" />
                    {post.titulo} {post.concluido ? '(Concluido)' : ''}
                  </button>
                </h3>
              </div>

              <button
                className="text-red-500"
                onClick={() => {
                  deletaNoticia(
                    {
                      id: post.id,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ["noticias"],
                        });
                      },
                    }
                  );
                }}
              >
                Deletar
              </button>
              <div className="relative mt-8 flex items-center gap-x-4">
                <div className="text-sm/6">
                  <p className="font-semibold text-gray-900">
                    <span>
                      <span className="absolute inset-0" />
                      {post.usuario.nome}
                    </span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <>Carregando noticias ....</>
      )}
    </>
  );
}
