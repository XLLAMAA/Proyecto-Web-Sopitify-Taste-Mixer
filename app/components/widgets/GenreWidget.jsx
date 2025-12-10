"use client";

import { useState, useEffect } from "react";

// Lista local de generos por si la API falla
const FullGeneros = [
  "rock",
  "pop",
  "spanish",
  "hip-hop",
  "indie",
  "reggaeton",
  "electronic",
  "dance",
  "r&b",
  "jazz"
];

export default function GenreWidget({ accessToken, selectedGenres, onChange }) {
  const [generos, setGeneros] = useState(FullGeneros);
  const [error, setError] = useState(null);

  // Cargo los generos de spotify
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

        // Si la respuesta no es ok no intento hacer json
        if (!respuesta.ok) {
          const texto = await respuesta.text();
          console.log(
            "Error al cargar generos desde spotify usando lista local",
            respuesta.status,
            texto
          );
          return; // me quedo con FullGeneros
        }

        const data = await respuesta.json();

        if (Array.isArray(data.genres) && data.genres.length > 0) {
          setGeneros(data.genres);
        }
      } catch (err) {
        console.error("Error de red al buscar generos", err);
        setError("Error de red al buscar generos");
      }
    };

    buscarGeneros();
  }, [accessToken]);

  // Seleccionar o deseleccionar un genero
  const toggleGenero = (genero) => {
    const yaSeleccionado = selectedGenres.includes(genero);

    const nuevaSeleccion = yaSeleccionado
      ? selectedGenres.filter((g) => g !== genero) // lo quito si ya estaba
      : [...selectedGenres, genero]; // lo anado si no estaba

    onChange(nuevaSeleccion);
  };

  const isSelected = (genero) => selectedGenres.includes(genero);

  return (
    <div className="bg-zinc-900 p-4 rounded-lg w-full shadow-lg border border-zinc-800">
      <h3 className="text-xl font-semibold mb-3 text-blue-400">Generos</h3>

      <p className="text-xs text-zinc-400 mb-2">
        Selecciona uno o varios generos para la playlist
      </p>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto text-xs">
        {generos.map((genero) => (
          <button
            key={genero}
            type="button"
            onClick={() => toggleGenero(genero)}
            className={`px-3 py-1 rounded-full capitalize border transition ${
              isSelected(genero)
                ? "bg-blue-500 text-white border-blue-400"
                : "bg-zinc-800 text-zinc-200 border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            {genero}
          </button>
        ))}
      </div>

      {selectedGenres.length > 0 && (
        <p className="mt-3 text-xs text-zinc-300">
          Generos seleccionados:{" "}
          <span className="font-semibold">
            {selectedGenres.join(" ")}
          </span>
        </p>
      )}
    </div>
  );
}
