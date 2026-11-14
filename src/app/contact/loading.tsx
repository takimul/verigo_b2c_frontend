import { ContactDetailsSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-neutral-200 bg-[#f7f5f0] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-3.5 w-32 animate-pulse rounded-xs bg-neutral-200" />
          <div className="mt-3 h-10 w-80 animate-pulse rounded-xs bg-neutral-300 sm:h-12" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-xs bg-neutral-200" />
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ContactDetailsSkeleton />
      </div>
    </main>
  );
}

