
import React, { useState } from 'react';
import { AlumniProfile } from '../types';

interface AlumniPreviewCardProps {
  profile: AlumniProfile;
  onSelect: () => void;
}

const AlumniPreviewCard: React.FC<AlumniPreviewCardProps> = ({ profile, onSelect }) => {
  const defaultImage = `https://picsum.photos/seed/${profile.id}/300`;
  const [imageSrc, setImageSrc] = useState(profile.profileImage || defaultImage);

  const handleImageError = () => {
    // If the custom image fails, use the default placeholder.
    // This also prevents an infinite loop if the placeholder itself fails.
    if (imageSrc !== defaultImage) {
        setImageSrc(defaultImage);
    }
  };

  return (
    <div
      onClick={onSelect}
      className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg cursor-pointer group transform transition-all duration-300 hover:shadow-2xl hover:scale-105"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${profile.businessName}`}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <img
        src={imageSrc}
        onError={handleImageError}
        alt={`Logo for ${profile.businessName}`}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <h3 className="text-white text-base font-bold truncate leading-tight">{profile.businessName}</h3>
        <div className="flex items-center justify-between text-xs mt-1">
            <p className="text-green-200 truncate pr-1">{profile.category}</p>
            {profile.generation && <p className="text-green-300 font-semibold flex-shrink-0">{profile.generation}</p>}
        </div>
      </div>
    </div>
  );
};

export default AlumniPreviewCard;