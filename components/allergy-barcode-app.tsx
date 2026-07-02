"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Download, HeartPulse, QrCode, Save, Trash2 } from "lucide-react";

type AllergyForm = {
  childName: string;
  emergencyName: string;
  emergencyPhone: string;
  allergyInformation: string;
};

const emptyForm: AllergyForm = {
  childName: "",
  emergencyName: "",
  emergencyPhone: "",
  allergyInformation: "",
};

function encodeCard(form: AllergyForm) {
  return btoa(encodeURIComponent(JSON.stringify(form)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function isFilled(value: string) {
  return value.trim().length > 0;
}

function normalizeForm(form: AllergyForm): AllergyForm {
  return {
    childName: form.childName.trim(),
    emergencyName: form.emergencyName.trim(),
    emergencyPhone: form.emergencyPhone.trim(),
    allergyInformation: form.allergyInformation.trim(),
  };
}

function cleanUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function getPublicBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return cleanUrl(configuredUrl);
  }

  return `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
}

export function AllergyBarcodeApp() {
  const [form, setForm] = useState<AllergyForm>(emptyForm);
  const [savedForm, setSavedForm] = useState<AllergyForm | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isLocalPreview, setIsLocalPreview] = useState(false);

  const isComplete = useMemo(
    () =>
      isFilled(form.childName) &&
      isFilled(form.emergencyName) &&
      isFilled(form.emergencyPhone) &&
      isFilled(form.allergyInformation),
    [form],
  );
  const hasUnsavedChanges =
    savedForm == null || JSON.stringify(normalizeForm(form)) !== JSON.stringify(savedForm);
  const canGenerateQr = savedForm != null && isComplete && !hasUnsavedChanges;

  useEffect(() => {
    setIsLocalPreview(["localhost", "127.0.0.1"].includes(window.location.hostname));
  }, []);

  function updateField(key: keyof AllergyForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setQrDataUrl("");
  }

  function saveCard() {
    if (!isComplete) {
      return;
    }

    setSavedForm(normalizeForm(form));
    setQrDataUrl("");
  }

  async function generateQrCode() {
    if (!canGenerateQr || savedForm == null) {
      return;
    }

    const publicCardUrl = `${getPublicBaseUrl()}/card#${encodeCard(savedForm)}`;
    const dataUrl = await QRCode.toDataURL(publicCardUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 640,
      color: {
        dark: "#111111",
        light: "#ffffff",
      },
    });
    setQrDataUrl(dataUrl);
  }

  function clearCard() {
    setForm(emptyForm);
    setSavedForm(null);
    setQrDataUrl("");
  }

  function downloadQrCode() {
    if (!qrDataUrl || savedForm == null) {
      return;
    }

    const link = document.createElement("a");
    const fileName = savedForm.childName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "allergy-card";
    link.href = qrDataUrl;
    link.download = `${fileName}-qr.png`;
    link.click();
  }

  return (
    <main className="min-h-screen bg-[#191919] px-4 py-6 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[500px] items-center justify-center">
        <div className="w-full rounded-[24px] bg-[#2a2a28] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.34)] sm:p-6">
          <header className="flex items-center gap-3">
            <HeartPulse className="h-7 w-7 fill-red-500/15 text-red-500" />
            <h1 className="text-2xl font-bold">My allergy card</h1>
          </header>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-base font-bold text-white/72">Name</span>
              <input
                required
                value={form.childName}
                onChange={(event) => updateField("childName", event.target.value)}
                className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-transparent px-4 text-base font-semibold text-white outline-none transition focus:border-[#5fa0ff] focus:ring-4 focus:ring-[#5fa0ff]/15"
              />
            </label>

            <div>
              <h2 className="text-base font-bold text-white/72">Emergency Details</h2>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <input
                  required
                  aria-label="Emergency contact name"
                  value={form.emergencyName}
                  onChange={(event) => updateField("emergencyName", event.target.value)}
                  className="h-12 rounded-xl border border-white/10 bg-transparent px-4 text-base font-semibold text-white outline-none transition focus:border-[#5fa0ff] focus:ring-4 focus:ring-[#5fa0ff]/15"
                />
                <input
                  required
                  aria-label="Emergency phone number"
                  value={form.emergencyPhone}
                  onChange={(event) => updateField("emergencyPhone", event.target.value)}
                  className="h-12 rounded-xl border border-white/10 bg-transparent px-4 text-base font-semibold text-white outline-none transition focus:border-[#5fa0ff] focus:ring-4 focus:ring-[#5fa0ff]/15"
                />
              </div>
            </div>

            <label className="block">
              <span className="text-base font-bold text-white/72">Allergy information</span>
              <textarea
                required
                value={form.allergyInformation}
                onChange={(event) => updateField("allergyInformation", event.target.value)}
                className="mt-2 min-h-[104px] w-full resize-y rounded-xl border border-white/10 bg-transparent px-4 py-3 text-base font-semibold leading-snug text-white outline-none transition focus:border-[#5fa0ff] focus:ring-4 focus:ring-[#5fa0ff]/15"
              />
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={!isComplete}
              onClick={saveCard}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2f80dc] px-4 text-base font-bold text-white transition hover:bg-[#3b8cec] disabled:cursor-not-allowed disabled:bg-[#3b3b38] disabled:text-white/35"
            >
              <Save className="h-5 w-5" />
              Save
            </button>
            <button
              type="button"
              onClick={clearCard}
              aria-label="Clear card"
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/16 text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white/72">Your QR code</h2>
                <p className="mt-1 max-w-[300px] text-xs font-semibold leading-5 text-white/42">
                  {isLocalPreview
                    ? "Local QR works only on this computer. Deploy before printing."
                    : "Same QR after edits needs a saved online profile."}
                </p>
                {savedForm && hasUnsavedChanges ? (
                  <p className="mt-1 text-xs font-semibold text-[#ffcc75]">Save changes before QR.</p>
                ) : null}
              </div>

              {qrDataUrl ? (
                <button
                  type="button"
                  onClick={downloadQrCode}
                  aria-label="Download QR code"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white p-2 transition hover:scale-[1.02]"
                >
                  <span
                    aria-hidden="true"
                    className="h-full w-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${qrDataUrl})` }}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canGenerateQr}
                  onClick={generateQrCode}
                  aria-label="Generate QR code"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#171717] text-white transition hover:bg-[#101010] disabled:cursor-not-allowed disabled:text-white/22"
                >
                  <QrCode className="h-8 w-8" />
                </button>
              )}
            </div>

            {qrDataUrl ? (
              <button
                type="button"
                onClick={downloadQrCode}
                className="mt-4 flex h-10 items-center gap-2 rounded-lg border border-white/16 px-3 text-xs font-bold text-white/80 transition hover:bg-white/5"
              >
                <Download className="h-4 w-4" />
                Download QR
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
