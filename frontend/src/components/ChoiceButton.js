import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import CategoryFilters from "./CategoryFilters"; 
import { users, brand } from "../data/data"; 
import InfluencerList from "./InfluencerList";
import BrandList from "./BrandList"; 

// ici je declare les états 
const ChoiceButton = () => {
  const [selectedOption, setSelectedOption] = useState("influenceur");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ici je selection l'influenceur ou la marque
  const handleClick = (option) => {
    setSelectedOption(option);
    setSearchQuery("");
  };

// affchage des  filtres
  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

// ici je filtres les resultats en fonction de la recherche
  const filteredData =
    selectedOption === "influenceur"
      ? users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : brand.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    //affichage du composant deux bouton pour selectionner
    <>
    <div className="toggle-search-target">
      <button
        onClick={() => handleClick("influenceur")}
        className={`choice-button ${selectedOption === "influenceur" ? "active" : "inactive"}`}
      >
        Je recherche des influenceurs
      </button>
      <button
        onClick={() => handleClick("marque")}
        className={`choice-button ${selectedOption === "marque" ? "active" : "inactive"}`}
      >
        Je recherche des marques
      </button>
      </div>
    
    <div className="choice-container">
      

      {/*ici bare de filtre et recherches */}
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
        {/* ici je conditione les filtres et les resultats*/}     
        {showFilters && (
          <div className="filters-dropdown">
            <CategoryFilters />
          </div>
        )}

        {searchQuery.trim() !== '' && (
          selectedOption === "influenceur" ? (
            <InfluencerList data={filteredData} />
          ) : (
            <BrandList data={filteredData} />
          )
        )}
      </div>
    </div>
    </>
  );
};

export default ChoiceButton;
