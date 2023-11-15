import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios, { AxiosError } from "axios";

import EpisodeList from "./EpisodeList/EpisodeList";
import CharacterList from "./CharacterList/CharacterList";
import CharacterDetail from "./CharacterDetail/CharacterDetail";

import "./index.css";

interface Episode {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [characterError, setCharacterError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("https://rickandmortyapi.com/api/episode")
      .then((response) => {
        const allEpisodes: Episode[] = response.data.results;
        const totalPages: number = response.data.info.pages;

        const additionalRequests: Promise<any>[] = [];
        for (let page = 2; page <= totalPages; page++) {
          additionalRequests.push(
            axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`)
          );
        }

        Promise.all(additionalRequests)
          .then((additionalResponses) => {
            additionalResponses.forEach((additionalResponse) => {
              allEpisodes.push(...additionalResponse.data.results);
            });

            setEpisodes(allEpisodes);
            setSelectedEpisode(allEpisodes[0]?.id || null);
          })
          .catch((additionalErrors: AxiosError[]) => {
            console.error("Error fetching additional pages:", additionalErrors);
          });
      })
      .catch((error: AxiosError) => {
        console.error("Error fetching episodes:", error);
      });
  }, []);

  const handleEpisodeSelect = (episodeId: number) => {
    setSelectedEpisode(episodeId);
    setCharacterError(null);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <EpisodeList
            episodes={episodes}
            selectedEpisode={selectedEpisode}
            onEpisodeSelect={handleEpisodeSelect}
          />
        </div>
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  {characterError && <p>{characterError}</p>}
                  <CharacterList episodeId={selectedEpisode} />
                </div>
              }
            />
            <Route
              path="/episodes/:id"
              element={
                <div>
                  {characterError && <p>{characterError}</p>}
                  <CharacterList episodeId={selectedEpisode} />
                </div>
              }
            />
            <Route path="/characters/:id" element={<CharacterDetail />} />
            <Route
              path="/*"
              element={
                <div>
                  {characterError && <p>{characterError}</p>}
                  <CharacterList episodeId={selectedEpisode} />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
