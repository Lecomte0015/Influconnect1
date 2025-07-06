export const calculateProfileScore = (profile) => {
    let score = 0;
  
    if (profile.photo) score += 10;
    if (profile.firstName) score += 5;
    if (profile.lastName) score += 5;
    if (profile.location) score += 5;
    if (profile.bio) score += 5;
    if (profile.languages?.length) score += 3;
    if (profile.phone) score += 2;
    if (profile.email) score += 2;
    if (profile.category) score += 5;
    if (profile.experience) score += 3;
    if (profile.interests?.length) score += 3;
    if (profile.collaborationTypes?.length) score += 3;
    if (
      profile.postRate || profile.storyRate || profile.reelRate ||
      profile.videoRate || profile.minBudget
    ) score += 5;
    if (profile.website) score += 2;
    if (profile.availability) score += 2;
  
    const hasSocial =
      profile.instagram || profile.tiktok || profile.youtube || profile.twitter;
    if (hasSocial) score += 10;
  
    const percentage = Math.round((score / 70) * 100);
    const isComplete = score >= 63; // 90%
  
    return { score, percentage, isComplete };
  };
  