import React, { useState, useEffect, FC } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

interface CharacterListProps {
  episodeId: number | null;
}

const CharacterList: FC<CharacterListProps> = ({ episodeId }) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    if (episodeId !== null) {
      axios
        .get(`https://rickandmortyapi.com/api/episode/${episodeId}`)
        .then((response) => {
          const characterURLs: string[] = response.data.characters.map(
            (characterURL: string) => characterURL.split("/").pop()
          );

          axios
            .get(
              `https://rickandmortyapi.com/api/character/${characterURLs.join(
                ","
              )}`
            )
            .then((charactersResponse) => {
              setCharacters(charactersResponse.data);
            })
            .catch((charactersError) =>
              console.error("Error fetching characters:", charactersError)
            );
        })
        .catch((episodeError) =>
          console.error("Error fetching episode:", episodeError)
        );
    }
  }, [episodeId]);

  return (
    <div className="character-list">
      <div className="title">Rick and Morty Characters</div>
      <h2>Characters</h2>
      <div className="characters-container">
        {characters.map((character) => (
          <div key={character.id} className="character-box">
            {/* Link to the character's detail page */}
            <Link to={`/characters/${character.id}`}>
              <img src={character.image} alt={character.name} />
              <p>{character.name}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterList;
