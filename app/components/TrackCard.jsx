"use client";

export default function TrackCard({ track, onRemove, onToggleFavorite, isFavorite }) {
  const imagen = track.album?.images?.[0]?.url;
  const artistas = track.artists?.map((a) => a.name).join(" ") || "";
  const popularidad = track.popularity;

  return (
    <div className="flex items-center gap-3 bg-zinc-900 rounded-lg p-2 border border-zinc-800">
      {imagen && (
        <img
          src={imagen}
          alt={track.name}
          className="w-12 h-12 rounded object-cover"
        />
      )}

      <div className="flex-1">
        <p className="text-sm font-semibold truncate">{track.name}</p>
        <p className="text-xs text-zinc-400 truncate">{artistas}</p>
        {typeof popularidad === "number" && (
          <p className="text-[10px] text-zinc-500">pop {popularidad}</p>
        )}
      </div>

      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(track)}
          className="text-xs mr-2"
          title="Marcar como favorita"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      )}

      {onRemove && (
        <button
          onClick={() => onRemove(track)}
          className="text-xs bg-red-600 px-2 py-1 rounded hover:bg-red-700"
          title="Quitar de la playlist"
        >
          X
        </button>
      )}
    </div>
  );
}
