//Dashboard con widgets

"use client";

import ArtistsWidget from "../components/widgets/ArtistsWidget";
import GenreWidget from "../components/widgets/GenreWidget";
import DecadeWidget from "../components/widgets/DecadeWidget";
import MoodWidget from "../components/widgets/MoodWidget";
import PopularityWidget from "../components/widgets/PopularityWidget";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [accessToken, setAccessToken] = useState(null);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedDecades, setSelectedDecades] = useState([]);
    const [selectedMoods, setSelectedMoods] = useState([]);
    const [selectedPopularity, setSelectedPopularity] = useState(50);
    const [recommendedTracks, setRecommendedTracks] = useState([]);

    //Obtiene el token que hay en el localStorage
    useEffect(() => {
        const token = localStorage.getItem("spotify_access_token");
        setAccessToken(token);
    }, []);

    const handleArtistSelect =  (artistas) => {
        setSelectedArtists(artistas);
        console.log("Artistas seleccionados: ", artistas);
    }

    const handleGenreSelect = (generos) => {
        setSelectedGenres(generos);
        console.log("Generos seleccionados: ", generos);
    }

    const handleDecadeSelect = (decades) => {
        setSelectedDecades(decades);
        console.log("Decadas seleccionadas: ", decades);
    }

    const handleMoodSelect = (mood) => {
        setSelectedMoods(mood);
        console.log("Moods seleccionados: ", mood);
    }

    const handlePopularitySelect = (popularity) => {
        setSelectedPopularity(popularity);
        console.log("Popularidad seleccionada: ", popularity);
    }

    //Para que me sea mas sencillo mostrar la popularidad en texto
    const getPopularityLabel = (valor) => {
     if (valor < 30) return "underground";
     if (valor < 70) return "conocidas";
     return "muy quemadas";
    };

    //Esta funcion es para generar las playlist en funcion de los widgets 
    const generarPlaylists = async () => {
        if (!accessToken) {
            console.log("No hay acces token");
            return;
        }

        try {
            const seedArtists = selectedArtists.slice(0, 2).map((a) => a.id);   //Pilla los 2 primeros artistas seleccionados
            const seedGeneros = selectedGenres.slice(0, 2); //Pilla los 2 primeros generos seleccionados
            const seedMoods = selectedMoods[0] || null; //Pilla el primer mood seleccionado
            const popularidad = selectedPopularity || 50;   //Pilla la popularidad seleccionada o 50 por defecto

            //Si no hay ningun artista ni genero no creo la playlist
            if (seedArtists.length === 0 && seedGeneros.length === 0) {
            console.log("No hay filtros minimos para generar playlist");
            return;
            }

            const busqueda = new URLSearchParams();

            if (seedArtists.length > 0) {
            busqueda.append("seed_artists", seedArtists.join(","));
            }

            if (seedGeneros.length > 0) {
            busqueda.append("seed_genres", seedGeneros.join(","));
            }

            //Numero de canciones, lo limito a 15
            busqueda.append("limit", "15");

            busqueda.append("target_popularity", String(selectedPopularity));

            const respuesta = await fetch (
                `https://api.spotify.com/v1/recommendations?${busqueda.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            );

            if (!respuesta.ok) {
                const textoError = await respuesta.text();
                console.error("Error al generar playlist", respuesta.status, textoError);
                setRecommendedTracks([]);
                return;
            }

            const data = await respuesta.json();

            setRecommendedTracks(data.tracks || []);
            console.log("Recomendaciones", data.tracks);

        }catch (err) {
            console.error("Error de red al generar playlist", err);
            setRecommendedTracks([]);
        }


    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            
            {!accessToken ? (
                <p>No se han encontrado el acces token, vuelve a iniciar sesion :( </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/*Columna con todos los widgets*/}
                    <div className="md:col-span-1 space-y-4">
                        <ArtistsWidget 
                            accessToken={accessToken}
                            selectedArtists={selectedArtists}
                            onChange={handleArtistSelect}   /*sto es para avisar al padre cuando cambian*/                                          
                        />
                        {/*Aqui van el resto de los widgets*/}
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

                    {/*Columna para las playlists*/}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-2xl font-semibold mb-4">PlayList Generada</h2>
                          <button
                            onClick={generarPlaylists}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            Generar Playlist
                        </button>

                        {recommendedTracks.length > 0 ? (
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                            {recommendedTracks.map((track) => (
                                 <li key={track.id}>
                                     {track.name}{" "}
                                        <span className="text-xs text-zinc-400">
                                          - {track.artists.map((a) => a.name).join(" ")}
                                        </span>
                                </li>
                            ))}
                        </ul>
                        ) : (

                        <ul className="mt-4 space-y-2 list-disc list-inside">
                            Artistas:{" "}
                            {selectedArtists.map((artists) => (
                                <li key={artists.id}>{artists.name}</li>
                            ))}
                            <li>
                                Generos:{" "}
                                 {selectedGenres.length > 0 ? selectedGenres.join(" ") : "ninguno"}
                            </li>
                            <li>
                                Decadas:{" "}
                                 {selectedDecades.length > 0 ? selectedDecades.join(" ") : "ninguna"}
                            </li>
                            <li>
                                 Mood:{" "}
                                 {selectedMoods.length > 0 ? selectedMoods.join(" ") : "ninguno"}
                            </li>
                            <li>
                                Popularidad: {" "}
                                {selectedPopularity} {getPopularityLabel(selectedPopularity)}
                            </li>
                        </ul>
                        )}
                    </div>
                </div>
            )}  
        </main>
    );
}