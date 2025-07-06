import React from 'react';


const categories = [
  'Lifestyle', 'Mode', 'Beauté', 'Tech', 'Gaming', 
  'Food', 'Voyage', 'Fitness', 'Business',
];

const industries = [
  'Cosmétique', 'Mode', 'Alimentation', 'Technologie', 
  'Luxe', 'Sport', 'Divertissement', 'Education', 'santé',
];


const CategoryFilters = () => {
  return (
    <div className="filters-container">
      <div className="filters-header">
        <span>Filtres</span>
        <button className="reset-button">x Réinitialisation</button>
      </div>

      <div className="filters-columns">
        <div className="filter-group">
          <h4>Catégories</h4>
          <div className="filter-tags">
            {categories.map((cat) => (
              <span key={cat} className="tag">{cat}</span>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4>Industries</h4>
          <div className="filter-tags">
            {industries.map((ind) => (
              <span key={ind} className="tag">{ind}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;
