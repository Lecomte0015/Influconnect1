import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const TestimonialsSection = () => {
  
  const testimonials = [
    {
      id: 1,
      name: 'Marc L',
      role: 'Directeur Marketing, Brand/tech',
      content: 'Cette plateforme a complètement transformé notre stratégie d\'influence...',
      rating: 5, 
      image: 'https://media.lesechos.com/api/v1/images/view/653a2df816abc3267f6ad205/par_defaut/image.jpg'
    },
    {
      id: 2,
      name: 'Blanche.M',
      role: 'Directrice Marketing, TechStart',
      content: 'La qualité des influenceurs sur cette plateforme est impressionnante...',
      rating: 4, 
      image: 'https://escueladecoachingtrestalentos.com/wp-content/uploads/2021/07/Master-Coaching-presencial_Merida.png'
    },
    {
      id: 3,
      name: 'Carole.D',
      role: 'Influenceuse Mode & Lifestyle',
      content: 'En tant qu\'influenceur, trouver des marques qui partagent mes valeurs est essentiel...',
      rating: 5,
      image: 'https://sumayamattar.med.br/wp-content/uploads/2024/08/sumaya-mattar-dermatologista-juiz-de-fora-mulheres.jpg'
    }
  ];

  return (
    <div className="advantage-section">
      
      <h1 className="maclass-h1">Ce qu'ils disent de nous</h1>

      <p>
        Découvrez les témoignages de marques et d'influenceurs qui ont 
        transformé leur stratégie avec notre plateforme.
      </p>

      {/* Section d'avi'*/}
      <section className="temoin">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="div-bloc">
            
            <div className="image-titre">
              <img src={testimonial.image} alt={testimonial.name} />
              <div className="text-info">
                <h3>{testimonial.name}</h3> 
                <p>{testimonial.role}</p>
              </div>
            </div>

            {/* ici les etoile*/}
            <div>
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={faStar}
                  className={`${i < testimonial.rating ? 'active' : 'inactive'}`} 
                />
              ))}
            </div>

            {/* avis contnue */}
            <p>{testimonial.content}</p>

          </div>
        ))}
      </section>
    </div>
  );
};

export default TestimonialsSection;
