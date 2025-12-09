"use client";

import { useState } from "react";

//Enumeraacion de decadas
const Mood = [
  "feliz",
    "triste",
    "energetico",
    "relajado",
    "romantico",
    "melancolico",
    "optimista",
    "introspectivo",
    "animado",
    "calmado",
];

export default function MoodWidget({ selectedMoods, onChange }) {
  const [error, setError] = useState(null);

  //Manejo la seleccion de decadas
  const toggleMood = (mood) => {
    const yaSeleccionada = selectedMoods.includes(mood);

    //Lo limito a poder seleccionar 2 moods
    if (!yaSeleccionada && selectedMoods.length >= 2) {
      setError("Solo puedes seleccionar hasta 2 moods");
      return;
    }

    setError(null);

    const nuevaSeleccion = yaSeleccionada
      ? selectedMoods.filter((d) => d !== mood) //si estaba la quito
      : [...selectedMoods, mood]; //si no estaba la anado

    onChange(nuevaSeleccion);
  };

  const isSelected = (mood) => selectedMoods.includes(mood);

  return (
    <div className="bg-zinc-900 p-4 rounded-lg w-full shadow-lg border border-zinc-800">
      <h3 className="text-xl font-semibold mb-3 text-yellow-400">Mood</h3>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      <div className="flex flex-wrap gap-2 text-xs">
        {Mood.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => toggleMood(mood)}
            className={`px-3 py-1 rounded-full border transition ${
              isSelected(mood)
                ? "bg-yellow-500 text-white border-yellow-400"
                : "bg-zinc-800 text-zinc-200 border-zinc-600 hover:bg-zinc-700"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {selectedMoods.length > 0 && (
        <p className="mt-3 text-xs text-zinc-300">
          Moods seleccionados:{" "}
          <span className="font-semibold">
            {selectedMoods.join(" ")}
          </span>
        </p>
      )}
    </div>
  );
}
