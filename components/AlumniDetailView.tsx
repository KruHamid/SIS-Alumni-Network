
import React, { useState, useEffect } from 'react';
import { AlumniProfile } from '../types';
import { AcademicCapIcon, GlobeAltIcon, LocationMarkerIcon, PhoneIcon, UserIcon } from './IconComponents';
import { transformToDirectGdriveUrl } from '../utils';

interface AlumniDetailViewProps {
  profile: AlumniProfile;
}

const InfoRow: React.FC<{ icon: React.ReactNode; children: React.ReactNode; href?: string }> = ({ icon, children, href }) => {
    const content = <div className="flex items-start gap-3 text-gray-700">
        <span className="text-green-700 mt-1">{icon}</span>
        <span className="flex-1 min-w-0 break-words">{children}</span>
    </div>;

    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="block p-2 rounded-md hover:bg-green-50 transition-colors">{content}</a>
    }
    return <div className="p-2">{content}</div>
};


const AlumniDetailView: React.FC<AlumniDetailViewProps> = ({ profile }) => {
  const defaultImage = `https://picsum.photos/seed/${profile.id}/200`;

  const getImageUrl = () => {
    const transformedUrl = transformToDirectGdriveUrl(profile.profileImage);
    return transformedUrl || defaultImage;
  };
  
  const [imageSrc, setImageSrc] = useState(getImageUrl());

  // This effect ensures that if the modal is reused for a different profile, the image resets correctly.
  useEffect(() => {
    setImageSrc(getImageUrl());
  }, [profile.id, profile.profileImage]);

  const handleImageError = () => {
    // Fallback to a placeholder if the provided image URL is invalid.
    if (imageSrc !== defaultImage) {
      setImageSrc(defaultImage);
    }
  };


  return (
    <div className="flex flex-col">
        <div className="flex items-start gap-4 mb-4">
             <img 
                src={imageSrc} 
                onError={handleImageError}
                alt={profile.name} 
                className="w-24 h-24 rounded-lg object-cover border-4 border-green-100 bg-gray-200"
            />
            <div className="flex-1">
                <p className="text-sm text-gray-500 bg-green-50 inline-block px-2 py-1 rounded-full mt-1">{profile.category}</p>
                 <p className="text-gray-600 mt-4">{profile.description}</p>
            </div>
        </div>

        <div className="space-y-2 text-sm border-t pt-4">
            <InfoRow icon={<UserIcon className="w-5 h-5"/>}>{profile.name}</InfoRow>
            {profile.generation && <InfoRow icon={<AcademicCapIcon className="w-5 h-5"/>}><span className="font-semibold">{profile.generation}</span></InfoRow>}
            {profile.publicContact && <InfoRow icon={<PhoneIcon className="w-5 h-5"/>} href={`tel:${profile.publicContact}`}>{profile.publicContact}</InfoRow>}
            {profile.website && <InfoRow icon={<GlobeAltIcon className="w-5 h-5"/>} href={profile.website}><span className="text-blue-600 hover:underline">{profile.website}</span></InfoRow>}
            {profile.location && <InfoRow icon={<LocationMarkerIcon className="w-5 h-5"/>}>{profile.location}</InfoRow>}
        </div>
    </div>
  );
};

export default AlumniDetailView;
