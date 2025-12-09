"use client";

import { useState } from 'react';

export default function ArtistsWidget ({ accessToken, selectedArtists, onChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (i) => {
    i.preventDefault();

    if (!query.trim()) {
      return;
    }

    if (!accessToken) {
      setError("No se han encontrado los token de acceso");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const input = new URLSearchParams({
        q: query,
        type: 'artist',
        limit: 5
      });

      //Adapto el fetch para que me busque en funcion del input del usuario
      const busqueda = await fetch(`https://api.spotify.com/v1/search?${input.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
        }
    );

    //Lo obtenido lo meto en esta variable y lo agrupo en una cadena
    const data = await busqueda.json();

    //Si no me encuentra nada cambio los estados 
    if (!busqueda.ok) {
      console.log("No se han encontrado artistas con este nombre :(", data);
      setError("Error en la busqueda de spotify");
      setResults([]);
      return;
    }

    //Me encuentra artistas
    setResults(data.artists?.items || []);

    //Caso de erorr de red 
    }catch (err) {
      console.error("Error de red:", err);
      setError("Error de red al buscar artistas.");
      setResults([]);
    }finally {
      setIsLoading(false);
    }
  };

  const toggleArtist = (artist) => {
  //Verifico que el artista ya esta en la lista de seleccionados
  const artistaSeleccionado = selectedArtists.some((a) => a.id === artist.id);

  //Configuro el estado de la lista por si 
  const nuevaSelecion = artistaSeleccionado
  ? selectedArtists.filter((a) => a.id !== artist.id) //Si esta lo quito
  : [...selectedArtists, artist]; //Si no esta lo añado

  //Aviso al padre de que ha cambiado la lista
  onChange(nuevaSelecion);

}

  const isSelected = (artistId) => {
    return selectedArtists.some((a) => a.id === artistId);
  }

  return (
    <div className="bg-zinc-900 p-4 rounded-lg w-full shadow-lg border border-zinc-800">
      <h3 className="text-xl font-semibold mb-3 text-yellow-800">Artistas</h3>
    <form onSubmit={handleSearch} className="flex gap-2 mb-3">
        <input
          type="text"
          value={query}
          placeholder="Busca un artista..."
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded bg-green-600 text-sm hover:bg-green-500 active:bg-green-700 transition"
        >🔍</button>
    </form>

      {isLoading && <p className="text-sm text-zinc-300">Buscando...</p>}
      {error && <p className="text-sm text-yellow-800">{error}</p>}

      <ul className="mt-2 space-y-1 max-h-60 overflow-y-auto text-sm">
        {results.map((artist) => (
          <li
            key={artist.id}
            className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
              isSelected(artist.id) 
               ? "bg-yellow-600 hover:bg-red-400 border-yellow-600"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
            onClick={() => toggleArtist(artist)}
          >
            <span className="truncate">{artist.name}</span>
            <span className="text-xs opacity-80">
              {isSelected(artist.id) ? "✓" : "+"}
            </span>
          </li>
        ))}
      </ul>

      {selectedArtists.length > 0 && (
        <p className="mt-3 text-xs text-zinc-300">
          Seleccionados:{" "}
        <span className="font-semibold">
          {selectedArtists.map((a) => a.name).join(", ")}
        </span>
        </p>
      )}
    </div>
  );
  
}



