
import React, { useState, useEffect } from 'react';
import { AlumniProfile } from '../types';
import { transformToDirectGdriveUrl } from '../utils';
import { UserIcon } from './IconComponents';

interface AlumniPreviewCardProps {
  profile: AlumniProfile;
  onSelect: () => void;
}

const AlumniPreviewCard: React.FC<AlumniPreviewCardProps> = ({ profile, onSelect }) => {
  const imageUrl = transformToDirectGdriveUrl(profile.profileImage);
  const [showImage, setShowImage] = useState(!!imageUrl);

  // Effect นี้ช่วยให้รูปภาพอัปเดตอย่างถูกต้อง หาก profile prop มีการเปลี่ยนแปลง
  useEffect(() => {
    setShowImage(!!transformToDirectGdriveUrl(profile.profileImage));
  }, [profile.id, profile.profileImage]);

  const handleImageError = () => {
    // หากรูปภาพที่ระบุโหลดไม่สำเร็จ ให้เปลี่ยนไปแสดงไอคอน
    setShowImage(false);
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
      {showImage && imageUrl ? (
        <img
          src={imageUrl}
          onError={handleImageError}
          alt={`Logo for ${profile.businessName}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 transition-transform duration-300 group-hover:scale-110">
          <UserIcon className="w-1/2 h-1/2 text-gray-500" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <h3 className="text-white text-base font-bold truncate leading-tight">{profile.businessName}</h3>
        <div className="flex items-center justify-between text-xs mt-1">
            <p className="text-green-200 truncate pr-1">{profile.category.join(', ')}</p>
            {profile.generation && <p className="text-green-300 font-semibold flex-shrink-0">{profile.generation}</p>}
        </div>
      </div>
    </div>
  );
};

export default AlumniPreviewCard;