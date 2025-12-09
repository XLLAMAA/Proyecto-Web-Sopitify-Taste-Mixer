"use client";

import { useState } from "react";

export default function PopularityWidget({ selectedPopularity, onChange }) {
  const [valor, setValor] = useState(50);

  const handleChange = (nuevoValor) => {
    setValor(nuevoValor);
    onChange(nuevoValor);
  }

  const getLabel = (valor) => {
    if (valor < 30) return "underground";
    if (valor < 70) return "conocidas";
    if (valor < 100) return "muy quemadas" 
    if (valor > 100) return; 
  }

  return (
    <div className="bg-zinc-900 p-4 rounded-lg w-full shadow-lg border border-zinc-800">
      <h3 className="text-xl font-semibold mb-3 text-yellow-400">Nivel popularidad</h3>

      <div className="flex flex-wrap gap-2 text-xs">
        <span>0</span>
        <span>{valor}</span>
        <span>100</span>
      </div>
      <input type="range" min="0" max="100" value={valor} 
      onChange={(e) => handleChange(Number(e.target.value))} 
      />

     <p className="text-xs text-zinc-300">
        Nivel aprox: {" "}
        <span className="font-semibold">{getLabel(valor)}</span>
     </p>
    </div>
  );
}
