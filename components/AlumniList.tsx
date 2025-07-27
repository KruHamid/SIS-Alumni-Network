import React from 'react';
import { AlumniProfile } from '../types';
import AlumniPreviewCard from './AlumniPreviewCard';

interface AlumniListProps {
  profiles: AlumniProfile[];
  onProfileSelect: (profile: AlumniProfile) => void;
}

const AlumniList: React.FC<AlumniListProps> = ({ profiles, onProfileSelect }) => {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h3 className="text-xl font-semibold text-gray-700">ไม่พบข้อมูล</h3>
        <p className="text-gray-500 mt-2">ยังไม่มีข้อมูลในหมวดหมู่นี้ หรือไม่ตรงกับเกณฑ์การค้นหา</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {profiles.map((profile) => (
          <AlumniPreviewCard 
            key={profile.id} 
            profile={profile}
            onSelect={() => onProfileSelect(profile)}
          />
        ))}
      </div>
    </div>
  );
};

export default AlumniList;
