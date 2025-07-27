
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import AlumniList from './components/AlumniList';
import Modal from './components/Modal';
import AlumniForm from './components/AlumniForm';
import Footer from './components/Footer';
import AlumniDetailView from './components/AlumniDetailView';
import { AlumniProfile, BusinessCategory } from './types';
import { getAlumni } from './services/alumniService';

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-700"></div>
    </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center justify-center h-screen bg-red-50 p-4">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-red-600">{message}</p>
        </div>
    </div>
);


const App: React.FC = () => {
  const [profiles, setProfiles] = useState<AlumniProfile[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AlumniProfile | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus('loading');
        const data = await getAlumni();
        // สุ่มลำดับข้อมูลศิษย์เก่าเพื่อให้การแสดงผลน่าสนใจยิ่งขึ้น
        const shuffledData = [...data].sort(() => Math.random() - 0.5);
        setProfiles(shuffledData);
        setStatus('success');
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาดที่ไม่รู้จัก");
        setStatus('error');
      }
    };
    fetchData();
  }, []);

  const handleProfileSelect = (profile: AlumniProfile) => {
    setSelectedProfile(profile);
  };

  const handleCloseDetailModal = () => {
    setSelectedProfile(null);
  };

  const filteredProfiles = useMemo(() => {
    if (!selectedCategory) {
      return profiles;
    }
    // A profile can have multiple categories, so check if the selected one is in its list.
    return profiles.filter(profile => profile.category.includes(selectedCategory as BusinessCategory));
  }, [profiles, selectedCategory]);
  
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (status === 'error') {
    return <ErrorMessage message={error!} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAddBusinessClick={() => setIsFormOpen(true)} />
      <main className="flex-grow">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <AlumniList profiles={filteredProfiles} onProfileSelect={handleProfileSelect} />
      </main>
      <Footer />

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="เพิ่มข้อมูลกิจการ / ทักษะ"
      >
        <AlumniForm 
          onClose={() => setIsFormOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={selectedProfile !== null}
        onClose={handleCloseDetailModal}
        title={selectedProfile?.businessName || ''}
      >
        {selectedProfile && <AlumniDetailView profile={selectedProfile} />}
      </Modal>
    </div>
  );
};

export default App;