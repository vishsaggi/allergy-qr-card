"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, HeartPulse, Phone, UserRound } from "lucide-react";

type AllergyCard = {
  childName?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  name?: string;
  emergencyContact?: string;
  allergyInformation: string;
};

function decodeCard(hash: string): AllergyCard | null {
  try {
    const encoded = hash.replace(/^#/, "");
    if (!encoded) {
      return null;
    }

    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = decodeURIComponent(atob(padded));
    const data = JSON.parse(decoded) as AllergyCard;

    if (
      !(data.childName || data.name) ||
      !(data.emergencyPhone || data.emergencyContact) ||
      !data.allergyInformation
    ) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export default function AllergyPublicCardPage() {
  const [card, setCard] = useState<AllergyCard | null>(null);

  useEffect(() => {
    setCard(decodeCard(window.location.hash));
  }, []);

  if (!card) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#191919] px-5 text-white">
        <section className="w-full max-w-xl rounded-[28px] bg-[#2a2a28] p-8 text-center">
          <HeartPulse className="mx-auto h-9 w-9 fill-red-500/15 text-red-500" />
          <h1 className="mt-5 text-2xl font-bold">Allergy card unavailable</h1>
          <p className="mt-3 text-base font-semibold text-white/55">
            Scan a generated QR code to view allergy information.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#191919] px-4 py-6 text-white sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[500px] items-center justify-center">
        <div className="w-full rounded-[24px] bg-[#2a2a28] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.34)] sm:p-6">
          <header className="flex items-center gap-3 text-[#ff7777]">
            <AlertTriangle className="h-7 w-7" />
            <span className="text-sm font-black uppercase tracking-[0.18em]">Allergy Alert</span>
          </header>

          <h1 className="mt-5 text-3xl font-black leading-tight">{card.childName ?? card.name}</h1>

          <div className="mt-5 rounded-2xl border border-white/10 bg-[#20201f] p-4">
            <h2 className="text-base font-bold text-white/55">Allergy information</h2>
            <p className="mt-2 whitespace-pre-wrap text-xl font-black leading-snug">
              {card.allergyInformation}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#20201f] px-4 py-3">
            <UserRound className="h-6 w-6 shrink-0 text-[#5fa0ff]" />
            <span>
              <span className="block text-sm font-bold text-white/52">Emergency contact</span>
              <span className="block text-lg font-black">{card.emergencyName ?? "Contact"}</span>
            </span>
          </div>

          <a
            href={`tel:${(card.emergencyPhone ?? card.emergencyContact ?? "").replace(/[^\d+]/g, "")}`}
            className="mt-3 flex min-h-[68px] items-center gap-3 rounded-2xl bg-[#2f80dc] px-4 text-left text-white"
          >
            <Phone className="h-7 w-7 shrink-0" />
            <span>
              <span className="block text-sm font-bold text-white/72">Phone number</span>
              <span className="block text-xl font-black">
                {card.emergencyPhone ?? card.emergencyContact}
              </span>
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
