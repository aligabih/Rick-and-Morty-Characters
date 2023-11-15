import React, { FC, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface CharacterDetailProps {}

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

const CharacterDetail: FC<CharacterDetailProps> = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    axios
      .get(`https://rickandmortyapi.com/api/character/${id}`)
      .then((response) => {
        setCharacter(response.data);
      })
      .catch((error) =>
        console.error("Error fetching character details:", error)
      );
  }, [id]);

  if (!character) {
    return <p>Loading...</p>;
  }

  return (
    <div className="character-detail">
      <h2>{character.name}</h2>
      <div>
        <img src={character.image} alt={character.name} />
      </div>
      <div>
        <strong>Status:</strong> {character.status}
      </div>
      <div>
        <strong>Species:</strong> {character.species}
      </div>
      <div>
        <strong>Gender:</strong> {character.gender}
      </div>
      <div>
        <strong>Origin:</strong> {character.origin.name}
      </div>
      <div>
        <strong>Location:</strong> {character.location.name}
      </div>
      <div>
        <strong>Created:</strong> {character.created}
      </div>
      <div>
        <strong>URL:</strong>{" "}
        <a href={character.url} target="_blank" rel="noopener noreferrer">
          {character.url}
        </a>
      </div>
      <div className="episodes-box">
        <h3>Episodes:</h3>
        <div className="episodes-list">
          {character.episode.map((episode) => (
            <div key={episode} className="episode-item">
              <Link to={`/episode/${episode.split("/").pop()}`}>
                {`Episode ${episode.split("/").pop()}`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
