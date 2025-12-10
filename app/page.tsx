/*Esta es la pagina principal*/

"use client";

import { JSX } from "react";

/*Permisos que le pido a la aplicacion de soptify*/ 
const PermisosSpotify =[
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
].join(" ");  /*El .join los junta en una array*/

const urlSpotify = "https://accounts.spotify.com/authorize"; 

/* Construye la url de login para spotify con los parametros necesarios*/
function buildLoginUrl(): string {
  const  idCliente = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  const parametros = new URLSearchParams ({
    client_id: idCliente ?? "",
    response_type: "code",
    redirect_uri: redirectUri ?? "",
    scope: PermisosSpotify,
  });

  return `${urlSpotify}?${parametros.toString()}`;
}
export default function Home(): JSX.Element {
  const handleLogin = () => {
    const url = buildLoginUrl();
    window.location.href = url
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-green-600 bg-gradient-to-b from-black via-zinc-900 to-emerald-900">
      <h1 className="text-3xl font-bold mb-4">Spotify Taste Mixer</h1>
      <p className="mb-6 text-center max-w-md">Aplicacion web para generar playlist personalizadas en funcion de tus gustos, tanto de artistas, generos...</p>
      <button onClick={(handleLogin)} 
      className="px-6 py-3 rounded-full bg-green-900 hover:opacity-90 hover:bg-green-600">🎧</button>
    </main>
    
  );
}
