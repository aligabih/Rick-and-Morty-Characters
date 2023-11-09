import React, { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Episode {
  id: number;
  name: string;
}

interface EpisodeListProps {
  onEpisodeSelect: (episodeId: number) => void;
  selectedEpisode: number | null;
}

const EpisodeList: FC<EpisodeListProps & { episodes: Episode[] }> = ({
  episodes,
  onEpisodeSelect,
  selectedEpisode,
}) => {
  const navigate = useNavigate();

  const handleEpisodeClick = (episodeId: number) => {
    onEpisodeSelect(episodeId);
    navigate(`/episodes/${episodeId}`); // Update the route to /episodes/:id
  };

  return (
    <div className="episode-list">
      <h2>Episodes</h2>
      <ul>
        {episodes.map((episode) => (
          <li
            key={episode.id}
            className={episode.id === selectedEpisode ? "selected" : ""}
            onClick={() => handleEpisodeClick(episode.id)}
          >
            <Link to={`/episodes/${episode.id}`}>{episode.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EpisodeList;
