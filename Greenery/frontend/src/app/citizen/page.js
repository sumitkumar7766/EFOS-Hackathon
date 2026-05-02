import Link from "next/link";

const options = [
  "Request a tree near your street",
  "Report a damaged sapling guard",
  "Join the next community planting drive",
];

export default function CitizenPage() {
  return (
    <main className="min-h-screen bg-[#f1faec] px-5 py-8 text-[#17351f] sm:px-8 lg:px-12">
      <section className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-bold text-[#2f8f46]">
          Back to login
        </Link>
        <div className="mt-6 overflow-hidden rounded-[2rem] bg-[#dff4d2] shadow-2xl shadow-green-950/10 lg:grid lg:grid-cols-[1fr_0.8fr]">
          <div className="p-8 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#4d8a31]">
              Citizen Dashboard
            </p>
            <h1 className="mt-4 max-w-2xl text-5xl font-black tracking-tight">
              Your neighborhood can breathe better.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#526b52]">
              Ask for trees, report care needs, and take part in local planting
              events that make your street cooler and cleaner.
            </p>
          </div>
          <div className="bg-[#123d24] p-8 text-white sm:p-10">
            <p className="text-5xl font-black">42</p>
            <p className="mt-2 text-[#d7efcf]">
              Community requests solved this month
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-xl shadow-green-950/5">
          <h2 className="text-2xl font-black">What would you like to do?</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {options.map((option) => (
              <button
                key={option}
                className="rounded-3xl border border-[#d8ead1] bg-[#fbfff8] p-5 text-left font-bold text-[#486347] transition hover:-translate-y-1 hover:border-[#2f8f46] hover:shadow-lg"
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
