
import React, { useState } from 'react';
import { AlumniProfile } from '../types';
import { AcademicCapIcon, GlobeAltIcon, LocationMarkerIcon, LockClosedIcon, PhoneIcon, UserIcon } from './IconComponents';

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
  const [showPrivate, setShowPrivate] = useState(false);

  return (
    <div className="flex flex-col">
        <div className="flex items-start gap-4 mb-4">
             <img 
                src={profile.profileImage || `https://picsum.photos/seed/${profile.id}/200`} 
                alt={profile.name} 
                className="w-24 h-24 rounded-lg object-cover border-4 border-green-100"
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
            
            {profile.privateContact && (
                 <div className="p-2 border-t mt-4 pt-4">
                    {showPrivate ? (
                        <InfoRow icon={<PhoneIcon className="w-5 h-5 text-red-600" />} href={`tel:${profile.privateContact}`}>
                            <span className="font-semibold text-red-600">{profile.privateContact} (ส่วนตัว)</span>
                        </InfoRow>
                    ) : (
                        <button 
                            onClick={() => setShowPrivate(true)} 
                            className="w-full flex items-center gap-3 text-left text-gray-700 p-2 rounded-md hover:bg-yellow-100 transition-colors border border-yellow-300"
                        >
                            <span className="text-yellow-600"><LockClosedIcon className="w-5 h-5"/></span>
                            <span className="flex-1 text-yellow-800 font-semibold">แสดงข้อมูลติดต่อส่วนตัว</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default AlumniDetailView;