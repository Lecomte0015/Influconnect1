function computeProfileCompletion(user) {
    let score = 0;
    let networkCount = 0;
  
    // Identité
    if (user.photo) score += 10;
    if (user.firstname) score += 5;
    if (user.lastname) score += 5;
  
    //  Localisation
    if (user.city || user.country) score += 5;
  
    //  Présentation
    if (user.description || user.présentation) score += 5;
  
    //  Langues
    if (user.languages && Array.isArray(user.languages) && user.languages.length) score += 3;
  
    //  Contact
    if (user.phone) score += 2;
    if (user.email) score += 2;
  
    //  Catégorie & Expérience
    if (user.category) score += 5;
    if (user.experience) score += 3;
  
    //  Centres d’intérêt
    if (user.tags && Array.isArray(user.tags) && user.tags.length) score += 3;
  
    //  Réseaux sociaux
    const networks = [user.instagram, user.tiktok, user.youtube, user.twitter];
    networkCount = networks.filter(val => val && val.trim() !== '').length;
    if (networkCount >= 2) score += 10; 
  
    if (user.website) score += 2;
  
    //  Collaborations
    if (user.collaborations) score += 2;
    if (user.collaborationTypes && Array.isArray(user.collaborationTypes) && user.collaborationTypes.length) score += 3;
    
    //  Budget
    if (user.min_budget) score += 2;
    //  Disponibilité
    if (user.availability) score += 2;
  
    const maxScore = 80;
    const percentage = Math.round((score / maxScore) * 100);
  
    //  Si on dépasse 70%, on considère le profil comme complet
    const isComplete = percentage >= 70;
  
    return { score, percentage, isComplete };
  }
  
  module.exports = { computeProfileCompletion };