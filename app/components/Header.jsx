"use client";

export default function Header({ onLogout }) {
  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between mb-6 px-4 py-3 rounded-xl 
    bg-gradient-to-r from-emerald-700/60 via-zinc-900/80 to-black/80 border border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-green-600 justify-center text-center">Spotify Taste Mixer</h1>
        <p className="text-xs text-green-500">
          Genera playlists en funcion de tus gustos con estos widgets
        </p>
      </div>
      <button onClick={onLogout} className="text-xs bg-red-600 px-3 py-1 rounded hover:bg-red-800 text-red-200 shadow-lg">
        Cerrar sesion
      </button>
    </header>
  );
}
