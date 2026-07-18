"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy route — photography now lives under Beyond the Lab */
export default function PhotographyRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/beyond#photography");
  }, [router]);

  return (
    <main className="section-pad flex min-h-[50vh] items-center justify-center pt-28">
      <p className="text-sm text-ink-400">Opening Beyond the Lab…</p>
    </main>
  );
}
