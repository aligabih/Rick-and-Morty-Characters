import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

// Components
import EpisodeList from "./Components/EpisodeList";
import CharacterList from "./Components/CharacterList";
import CharacterDetail from "./Components/CharacterDetail";

// Styles
import "./index.css";

const App = () => {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    axios
      .get("https://rickandmortyapi.com/api/episode")
      .then((response) => {
        const allEpisodes = response.data.results;
        const totalPages = response.data.info.pages;

        const additionalRequests = [];
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
            setSelectedEpisode(allEpisodes[0]?.id);
          })
          .catch((additionalErrors) =>
            console.error("Error fetching additional pages:", additionalErrors)
          );
      })
      .catch((error) => console.error("Error fetching episodes:", error));
  }, []);

  const handleEpisodeSelect = (episodeId) => {
    if (selectedEpisode === episodeId) {
      setSelectedEpisode(episodes[0]?.id || null);
    } else {
      setSelectedEpisode(episodeId);
    }
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
                  <CharacterList episodeId={selectedEpisode} />
                </div>
              }
            />
            <Route
              path="/episodes/:id"
              element={<CharacterList episodeId={selectedEpisode} />}
            />
            <Route path="/characters/:id" element={<CharacterDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
