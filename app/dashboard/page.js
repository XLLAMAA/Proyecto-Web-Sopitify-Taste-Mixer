//Dashboard con widgets

"use client";

import ArtistsWidget from "../components/widgets/ArtistsWidget";
import GenreWidget from "../components/widgets/GenreWidget";
import DecadeWidget from "../components/widgets/DecadeWidget";
import MoodWidget from "../components/widgets/MoodWidget";
import PopularityWidget from "../components/widgets/PopularityWidget";
import PlayListDisplay from "../components/PlayListDisplay";
import Header from "../components/Header";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    //Estados
    const [accessToken, setAccessToken] = useState(null);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedDecades, setSelectedDecades] = useState([]);
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [selectedPopularity, setSelectedPopularity] = useState(50);
    const [recommendedTracks, setRecommendedTracks] = useState([]);
    const [favoritos, setFavoritos] = useState([]);

    // Obtiene el token que hay en el localStorage
    useEffect(() => {
        const token = localStorage.getItem("spotify_access_token");
        console.log("Token en dashboard:", token);
        setAccessToken(token);
    }, []);

    const handleArtistSelect = (artistas) => {
        setSelectedArtists(artistas);
        console.log("Artistas seleccionados:", artistas);
    };

    const handleGenreSelect = (generos) => {
        setSelectedGenres(generos);
        console.log("Generos seleccionados:", generos);
    };

    const handleDecadeSelect = (decades) => {
        setSelectedDecades(decades);
        console.log("Decadas seleccionadas:", decades);
    };

    const handleMoodSelect = (moods) => {
        setSelectedMoods(moods);
        console.log("Moods seleccionados:", moods);
    };

    const handlePopularitySelect = (popularity) => {
        setSelectedPopularity(popularity);
        console.log("Popularidad seleccionada:", popularity);
    };

    const handleRemoveTrack = (track) => {
        setRecommendedTracks((prev) => prev.filter((t) => t.id !== track.id));
    };

    const handleToggleFavorite = (track) => {
        setFavoritos((prev) => {
        const yaEsta = prev.some((t) => t.id === track.id);
        if (yaEsta) {
            return prev.filter((t) => t.id !== track.id);
        } else {
            return [...prev, track];
        }
        });
    };

    //logout simple
    const handleLogout = () => {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("spotify_expires_at");
        window.location.href = "/";
    };

    //Para mostrar la popularidad en texto
    const getPopularityLabel = (valor) => {
        if (valor < 30) return "underground";
        if (valor < 70) return "conocidas";
        return "muy quemadas";
    };

    //Genera la playlist usando /search y mezclando todos los widgets
    const generarPlaylists = async () => {
        if (!accessToken) {
        console.log("No hay access token");
        return;
        }

        try {
        // cojo hasta 2 artistas y 2 generos, una decada y un mood
        const seedArtists = selectedArtists.slice(0, 2).map((a) => a.name);
        const seedGeneros = selectedGenres.slice(0, 2);
        const seedDecade = selectedDecades[0] || null;
        const seedMood = selectedMoods[0] || null;
        const popularidad = selectedPopularity || 50;

        //minimo algun filtro
        if (seedArtists.length === 0 && seedGeneros.length === 0 && !seedDecade && !seedMood) {
            console.log("No hay filtros minimos para generar playlist");
            return;
        }

        const partesQuery=[];

        // artistas: meto nombres sueltos para qued sea mas flexible por que me fallaba
        if (seedArtists.length > 0) {
            const artistasQuery = seedArtists.join(" ");
            partesQuery.push(artistasQuery);
        }

        // generos: palabras sueltas, no uso genero exacto por q me fallaba o no me dejaba meter varios o no lo detectaba
        if (seedGeneros.length > 0) {
            const generosQuery = seedGeneros.join(" ");
            partesQuery.push(generosQuery);
        }

        // decada -> year:1990-1999 por q tambien me daba problemas
        if (seedDecade) {
            const base = parseInt(seedDecade.slice(0, 4), 10);
            if (!isNaN(base)) {
            const yearFrom = base;
            const yearTo = base + 9;
            partesQuery.push(`year:${yearFrom}-${yearTo}`);
            }
        }

        //mood como palabra libre
        if (seedMood) {
            partesQuery.push(seedMood);
        }

        const q = partesQuery.join(" ");

        //Url de busqueda
        const params = new URLSearchParams({
            q,
            type: "track",
            limit: "30", //cojo unas cuantas para luego filtrar y quedarme con 10
        });

        //Url con los parametros y le meto un log para saber cual es la url exacta, que me estaba fallanmdo mucho
        const url = `https://api.spotify.com/v1/search?${params.toString()}`;
        console.log("URL usada para search de playlist:", url);

        //Le paso la autorizacion(token)
        const respuesta = await fetch(url, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log("Respuesta Spotify:", respuesta.status);

        //Compruebo que la respuesta sea ok
        if (!respuesta.ok) {
            const textoError = await respuesta.text();
            console.error(
            "Error al generar playlist",
            respuesta.status,
            textoError
            );
            setRecommendedTracks([]);
            return;
        }

        const data = await respuesta.json();
        console.log("Respuesta JSON de Spotify:", data);

        let tracks = data.tracks?.items || [];

        if (tracks.length === 0) {
            setRecommendedTracks([]);
            console.log("No se han encontrado temas con la busqueda");
            return;
        }

        //filtro por popularidad pero si me paso y me quedo a 0, uso la lista original
        const minPop = Math.max(0, popularidad - 20);
        const maxPop = Math.min(100, popularidad + 20);

        const filtradas = tracks.filter(
            (t) =>
            typeof t.popularity === "number" &&
            t.popularity >= minPop &&
            t.popularity <= maxPop
        );

        let finales = filtradas;
        if (finales.length === 0) {
            console.log("Filtro de popularidad muy estricto, uso todas las pistas");
            finales = tracks;
        }

        // me quedo con 10 maximo
        finales = finales.slice(0, 10);

        setRecommendedTracks(finales);
        console.log("Recomendaciones finales:", finales);
        } catch (err) {
        console.error("Error de red al generar playlist", err);
        setRecommendedTracks([]);
        }
    };

  return (
    <main className="min-h-screen flex flex-col items-center bg-black text-white">
      <Header onLogout={handleLogout} />

      {!accessToken ? (
        <p>No se ha encontrado el acces token vuelve a iniciar sesion</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {/* Columna con todos los widgets */}
          <div className="md:col-span-1 space-y-4">
            <ArtistsWidget
              accessToken={accessToken}
              selectedArtists={selectedArtists}
              onChange={handleArtistSelect}
            />
            <GenreWidget
              accessToken={accessToken}
              selectedGenres={selectedGenres}
              onChange={handleGenreSelect}
            />
            <DecadeWidget
              accessToken={accessToken}
              selectedDecades={selectedDecades}
              onChange={handleDecadeSelect}
            />
            <MoodWidget
              accessToken={accessToken}
              selectedMoods={selectedMoods}
              onChange={handleMoodSelect}
            />
            <PopularityWidget
              accessToken={accessToken}
              selectedPopularity={selectedPopularity}
              onChange={handlePopularitySelect}
            />
          </div>

          {/* Columna para la playlist */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold mb-4">PlayList generada</h2>
            <button
              onClick={generarPlaylists}
              className="mt-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Generar playlist
            </button>

            {recommendedTracks.length > 0 ? (
              <PlayListDisplay
                tracks={recommendedTracks}
                onRemoveTrack={handleRemoveTrack}//quitar pista
                favoriteTracks={favoritos}//estado de favoritos
                onToggleFavorite={handleToggleFavorite} //accion de toggle favorite
              />
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
