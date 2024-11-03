import Link from "next/link";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col">
        <div className=" mb-10">
          <h1 className="font-bold text-6xl">Election Map</h1>
          <p>Generate various paths to victory</p>
        </div>

        <Link
          href={"/ScenarioBuilder"}
          className="px-4 py-3 rounded hover:bg-zinc-600 bg-zinc-700"
        >
          Build an election scenario
        </Link>
      </main>
    </div>
  );
}
