"use client";

import TrackCard from "./TrackCard";

export default function PlaylistDisplay({ tracks, onRemoveTrack, favoriteTracks = [], onToggleFavorite }) {
  if (!tracks || tracks.length === 0) {
    return (
      <p className="text-sm text-zinc-300">
        Aun no has generado ninguna playlist
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track) => (
        <TrackCard
          key={track.id}
          track={track}
          onRemove={onRemoveTrack}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteTracks.some((t) => t.id === track.id)}
        />
      ))}
    </div>
  );
}
