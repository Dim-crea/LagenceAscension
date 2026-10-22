"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(params.get("next") || "/admin/projects");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Une erreur est survenue.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-card border border-line bg-kelp/40 p-8"
      >
        <Image
          src="/images/brand/logo-white.png"
          alt="Ascension"
          width={150}
          height={36}
          className="mb-8 h-8 w-auto"
        />
        <h1 className="mb-1.5 font-display text-xl font-semibold text-white">Administration</h1>
        <p className="mb-6 text-sm text-silver">Connectez-vous pour gérer le contenu du site.</p>

        <label className="mb-5 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.16em] text-silver">Mot de passe</span>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-sm border border-line bg-abyss px-3.5 py-3 text-sm text-mist outline-none focus:border-line2"
          />
        </label>

        {error && <p className="mb-4 text-xs text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm bg-white py-3 text-sm font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
