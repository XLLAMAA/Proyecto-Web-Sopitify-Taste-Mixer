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
                    </div>
                </div>
            )}   
        </main>
    );
}