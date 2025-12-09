"use client";

import { useState, useEffect } from "react";

const FULL_GENEROS = [
  "pop",
  "rock",
  "indie",
  "rap español",
  "tecno",
  "hard core",
  "reggaeton",
  "hip-hop",
  "trap",
  "edm",
  "latin",
  "metal",
  "jazz",
  "r&b",
  "soul",
];

export default function GenreWidget({ accessToken, selectedGenres, onChange }) {
  const [generos, setGeneros] = useState(FULL_GENEROS);
  const [error, setError] = useState(null);

  // Intento cargar los géneros reales de Spotify (si falla, me quedo con FULL_GENEROS)
  useEffect(() => {
    const buscarGeneros = async () => {
      if (!accessToken) return;

      try {
        const respuesta = await fetch(
          "https://api.spotify.com/v1/recommendations/available-genre-seeds",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await respuesta.json();

        if (!respuesta.ok) {
          console.log("No se han podido cargar los géneros desde Spotify:", data);
          // No hago setGeneros para quedarme con la lista local
          return;
        }

        if (Array.isArray(data.genres) && data.genres.length > 0) {
          setGeneros(data.genres);
        }
      } catch (err) {
        console.error("Error de red al buscar géneros:", err);
        setError("Error de red al buscar géneros.");
      }
    };

    buscarGeneros();
  }, [accessToken]);

  const toggleGenre = (genre) => {
    const yaSeleccionado = selectedGenres.includes(genre);

    const nuevaSeleccion = yaSeleccionado
      ? selectedGenres.filter((g) => g !== genre) // si estaba, lo quito
      : [...selectedGenres, genre]; // si no estaba, lo añado

    onChange(nuevaSeleccion);
  };

  const isSelected = (genre) => selectedGenres.includes(genre);

  return (
    <div className="bg-zinc-900 p-4 rounded-lg w-full shadow-lg border border-zinc-800">
      <h3 className="text-xl font-semibold mb-3 text-blue-400">Géneros</h3>

      <p className="text-xs text-zinc-400 mb-2">
        Selecciona uno o varios géneros. Se usarán como base para generar la playlist.
      </p>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto text-xs">
        {generos.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => toggleGenre(genre)}
            className={`px-3 py-1 rounded-full capitalize border transition ${
              isSelected(genre)
                ? "bg-blue-500 text-white border-blue-400"
                : "bg-zinc-800 text-zinc-200 border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {selectedGenres.length > 0 && (
        <p className="mt-3 text-xs text-zinc-300">
          Géneros seleccionados:{" "}
          <span className="font-semibold">
            {selectedGenres.join(", ")}
          </span>
        </p>
      )}
    </div>
  );
}
