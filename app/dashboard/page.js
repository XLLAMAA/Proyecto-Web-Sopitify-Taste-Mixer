//Dashboard con widgets

"use client";

import ArtistsWidget from "../components/widgets/ArtistsWidget";
import GenreWidget from "../components/widgets/GenreWidget";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const [accessToken, setAccessToken] = useState(null);
    const [selectedArtist, setSelectedArtist] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    //Obtiene el token que hay en el localStorage
    useEffect(() => {
        const token = localStorage.getItem("spotify_access_token");
        setAccessToken(token);
    }, []);

    const handleArtistSelect =  (artistas) => {
        setSelectedArtist(artistas);
        console.log("Artistas seleccionados: ", artistas);
    }

    const handleGenreSelect = (generos) => {
        setSelectedGenres(generos);
        console.log("Generos seleccionados: ", generos);
    }

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
                            selectedArtists={selectedArtist}
                            onChange={handleArtistSelect}   /*sto es para avisar al padre cuando cambian*/                                          
                        />
                        {/*Aqui van el resto de los widgets*/}
                        <GenreWidget
                            accessToken={accessToken}
                            selectedGenres={selectedGenres}
                            onChange={handleGenreSelect}
                        />  
                    </div>

                    {/*Columna para las playlists*/}
                    <div className="md:col-span-1 space-y-4">
                        <h2 className="text-2xl font-semibold mb-4">PlayList Generada</h2>
                            <p>de momento aqui muestro los artistas seleccionados</p>
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                            {selectedArtist.map((artists) => (
                                <li key={artists.id}>{artists.name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}   
        </main>
    );
}