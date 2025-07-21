import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import axios from "axios";

import CategoryFilters from "./CategoryFilters";
import BrandListCard from "./BrandListCard";
import InfluencerListCard from "./InfluencerListCard";

const ChoiceButton = () => {
  const [selectedOption, setSelectedOption] = useState("influenceur");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Requête vers API selon sélection
  useEffect(() => {
    const fetchData = async () => {
      if (
        searchQuery.trim() === "" &&
        selectedCategory === "" &&
        selectedIndustry === ""
      ) {
        setData([]);
        return;
      }

      setIsLoading(true);
      try {
        let endpoint = "";
        let params = {};

        if (selectedOption === "influenceur") {
          endpoint = "http://localhost:3001/api/influencers";
          params = {
            search: searchQuery.trim(),
            category: selectedCategory,
          };
        } else {
          endpoint = "http://localhost:3001/api/brands-full";
          params = {
            search: searchQuery.trim(),
            industry: selectedIndustry,
          };
        }

        const res = await axios.get(endpoint, { params });
        setData(res.data);
      } catch (error) {
        console.error("Erreur chargement :", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, selectedOption, selectedCategory, selectedIndustry]);

  const handleClick = (option) => {
    setSelectedOption(option);
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedIndustry("");
    setData([]);
    setShowFilters(false);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <div className="toggle-search-target">
        <button
          onClick={() => handleClick("influenceur")}
          className={`choice-button ${
            selectedOption === "influenceur" ? "active" : "inactive"
          }`}
        >
          Je recherche des influenceurs
        </button>
        <button
          onClick={() => handleClick("business")}
          className={`choice-button ${
            selectedOption === "business" ? "active" : "inactive"
          }`}
        >
          Je recherche des marques
        </button>
      </div>

      <div className="choice-container">
        <div className="search-bar-container">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder={
                selectedOption === "influenceur"
                  ? "Rechercher un influenceur..."
                  : "Rechercher une marque..."
              }
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="filter-button" onClick={handleFilterClick}>
              <FiFilter />
            </button>
          </div>

          {showFilters && (
            <div className="filters-dropdown">
              <CategoryFilters
                selectedOption={selectedOption}
                onSelectCategory={setSelectedCategory}
                onSelectIndustry={setSelectedIndustry}
              />
            </div>
          )}

          {isLoading && <p>Chargement en cours...</p>}

          {!isLoading && data.length > 0 && (
            selectedOption === "influenceur" ? (
              <InfluencerListCard influencers={data} />
            ) : (
              <BrandListCard brands={data} />
            )
          )}

          {!isLoading && data.length === 0 &&
            (searchQuery || selectedCategory || selectedIndustry) && (
              <p>Aucun résultat trouvé.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChoiceButton;
