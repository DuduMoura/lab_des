import NoticiasSection from "./components/noticias";

export default function Page() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            Listagem de tarefas
          </h2>
        </div>
        <NoticiasSection />
      </div>
    </div>
  );
}
