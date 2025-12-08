"use client";

export default function ArtistsWidget({ accessToken, selectedArtists, onChange }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Artistas</h3>
      <p className="text-sm text-zinc-300">
        Aquí irá el buscador de artistas. Token:{" "}
        {accessToken ? "disponible" : "NO disponible"}
      </p>
    </div>
  );
}
