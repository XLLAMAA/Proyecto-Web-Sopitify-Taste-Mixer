"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");

    // Si no hay code, volvemos a la home
    if (!code) {
      router.push("/");
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        const response = await fetch("/api/spotify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
         const errorText = await response.text();
          console.error("Error al obtener el token de Spotify:", response.status, errorText);
          return;
        }   

        const data = await response.json();

        // OJO: ajusta estos nombres si en tu route.js se llaman distinto
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        const expiresIn = data.expires_in; //en segundos

        if (!accessToken || !refreshToken) {
          console.error("Tokens incompletos:", data);
          router.push("/");
          return;
        }

        //Guardar tokens en localStorage
        const expiresAt = Date.now() + expiresIn * 1000;
        localStorage.setItem("spotify_access_token", accessToken);
        localStorage.setItem("spotify_refresh_token", refreshToken);
        localStorage.setItem("spotify_expires_at", expiresAt.toString());

        //Ir al dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Error intercambiando el code por token:", error);
        router.push("/");
      }
    };

    exchangeCodeForToken();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Callback de Spotify</h1>
      <p>Procesando el inicio de sesión con Spotify...</p>
    </main>
  );
}
