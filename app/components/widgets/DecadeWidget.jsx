"use client";

import { useState } from "react";

//Enumeraacion de decadas
const Decades = [
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

export default function DecadeWidget({ selectedDecades, onChange }) {
  const [error, setError] = useState(null);

  //Manejo la seleccion de decadas
  const toggleDecade = (decade) => {
    const yaSeleccionada = selectedDecades.includes(decade);

    //Lo limito a poder seleccionar 3 decadas
    if (!yaSeleccionada && selectedDecades.length >= 3) {
      setError("Solo puedes seleccionar hasta 3 decadas");
      return;
    }

    setError(null);

    const nuevaSeleccion = yaSeleccionada
      ? selectedDecades.filter((d) => d !== decade) //si estaba la quito
      : [...selectedDecades, decade]; //si no estaba la anado

    onChange(nuevaSeleccion);
  };

  const isSelected = (decade) => selectedDecades.includes(decade);

  return (
    <div className="bg-zinc-900 p-4 rounded-lg w-full shadow-lg border border-zinc-800">
      <h3 className="text-xl font-semibold mb-3 text-purple-400">Decadas</h3>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      <div className="flex flex-wrap gap-2 text-xs">
        {Decades.map((decade) => (
          <button
            key={decade}
            type="button"
            onClick={() => toggleDecade(decade)}
            className={`px-3 py-1 rounded-full border transition ${
              isSelected(decade)
                ? "bg-purple-500 text-white border-purple-400"
                : "bg-zinc-800 text-zinc-200 border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            {decade}
          </button>
        ))}
      </div>

      {selectedDecades.length > 0 && (
        <p className="mt-3 text-xs text-zinc-300">
          Decadas seleccionadas:{" "}
          <span className="font-semibold">
            {selectedDecades.join(" ")}
          </span>
        </p>
      )}
    </div>
  );
}
