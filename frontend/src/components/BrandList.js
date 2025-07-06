import { Link } from 'react-router-dom';
import BrandCard from './ BrandCard';

const BrandList = ({ data }) => {
  return (
    <div className="grid">
      {data.length > 0 ? (
        data.map(brand => (
          <Link to={`/brand/${brand.id}`} key={brand.id}>
            <BrandCard data={brand} />
          </Link>
        ))
      ) : (
        <p>Aucune marque trouvée.</p>
      )}
    </div>
  );
};

export default BrandList;
