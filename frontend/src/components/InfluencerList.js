import { Link } from 'react-router-dom';
import InfluencerCard from './InfluencerCard';


const InfluencerList = ({ data }) => {
  
  return (
    <div>
      <div className='influ-list'>
      {data.length > 0 ? (
        data.map(user => (
          <Link to={`/influencer/${user.id}`} key={user.id}>
            <InfluencerCard data={user} />
          </Link>
        ))
      ) : (
        <p>Aucun influenceur trouvé.</p>
      )}
      </div>
    </div>
  );
};

export default InfluencerList;
