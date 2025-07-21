import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryFilters = ({
  selectedOption,
  onSelectCategory,
  onSelectIndustry,
}) => {
  const [categories, setCategories] = useState([]);
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        if (selectedOption === "influenceur") {
          const res = await axios.get("http://localhost:3001/api/influencer-tags");
          setCategories(res.data);
        } else {
          const res = await axios.get("http://localhost:3001/api/brand-industries");
          setIndustries(res.data);
        }
      } catch (error) {
        console.error("Erreur chargement filtres :", error);
      }
    };

    fetchFilters();
  }, [selectedOption]);

  const resetFilters = () => {
    onSelectCategory("");
    onSelectIndustry("");
  };

  const handleClick = (value) => {
    if (selectedOption === "influenceur") {
      onSelectCategory(value === "Tous" ? "" : value);
    } else {
      onSelectIndustry(value === "Tous" ? "" : value);
    }
  };

  const currentList = selectedOption === "influenceur" ? categories : industries;

  return (
    <div className="filters-container">
      <div className="filters-header">
        <span>Filtres</span>
        <button className="reset-button" onClick={resetFilters}>
          x Réinitialisation
        </button>
      </div>

      <div className="filter-group">
        <h4>
          {selectedOption === "influenceur" ? "Catégories d'influenceurs" : "Industries des marques"}
        </h4>
        <div className="filter-tags">
          {currentList.map((value) => (
            <button key={value} className="tag" onClick={() => handleClick(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
