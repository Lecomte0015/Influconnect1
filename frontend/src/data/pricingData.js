export const influencerPlans = [
    {
      type: "Gratuit",
      priceMonthly: 0,
      priceYearly: 0,
      description: "Pour commencer votre carrière d'influenceur",     
      features: [
        "Profil de base",
          "3 propositions par mois",
          "Messagerie standard",
          "Statistiques basiques"
      ],
      notIncluded: [
        "Badge vérifié",
        "Propositions illimitées",
        "Mise en avant du profil"
      ]
    },
    {
      type: "Pro",
      priceMonthly: 24,
      priceYearly: 19,
      description: "Pour les influenceurs qui veulent se démarquer",    
      features: [
        "Badge vérifié",
          "Propositions illimitées",
          "Mise en avant du profil",
          "Statistiques avancées",
          "Support prioritaire",
          "Formations exclusives"
      ],
      notIncluded: [
        "Manager personnel",
        "Contrats personnalisés"
      ],
      popular: true,
    },
    {
      type: "Elite",
      priceMonthly: 59,
      priceYearly: 49,
      description: "Pour les influenceurs professionnels",     
      features: [
        "Tout dans Pro",
        "Manager personnel",
        "Contrats personnalisés",
        "Accès VIP aux marques",
        "Events exclusifs",
        "Formation personnalisée"
      ],
      notIncluded: []
    },
  ];
  
  export const brandPlans = [
    {
      type: "Starter",
      priceMonthly: 59,
      priceYearly: 49, 
      description:"Parfait pour débuter avec l'influence marketing",     
      features: [
        "Jusqu'à 3 campagnes actives",
        "Accès aux profils de base",
        "Messagerie avec les influenceurs",
        "Statistiques essentielles",
        "Support par email",
      ],
      notIncluded: [
        "Analyses avancées",
          "Contrats personnalisés",
          "Manager dédié"
      ],
      popular: false,

    },
    {
      type: "Business",
      priceMonthly: 179,
      priceYearly: 149,
      description: "Pour les marques qui veulent passer à l'échelle",     
      features: [
        "Campagnes illimitées",
          "Accès aux profils premium",
          "Messagerie prioritaire",
          "Analyses avancées",
          "Support prioritaire",
          "Contrats personnalisés",
          "Dashboard personnalisé"
      ],
      notIncluded: [
        "Manager dédié"
      ],
      popular: true,
    },
    {
      type: "Entreprise",
      priceMonthly: 479,
      priceYearly: 399, 
      description: "Solution complète pour les grandes marques",    
      features: [
        "Tout dans Business",
          "Manager de compte dédié",
          "API access",
          "Intégrations personnalisées",
          "Formation équipe",
          "Rapports sur mesure",
          "SLA garanti"
      ],
      notIncluded: [],
      popular: false,
    },
  ];
  