
import React, { useState } from 'react';
import { AlumniProfile, BusinessCategory } from '../types';
import { generateDescription } from '../services/geminiService';
import { addAlumni } from '../services/alumniService';
import { SparklesIcon } from './IconComponents';

interface AlumniFormProps {
  onClose: () => void;
}

const SuccessView: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">ส่งข้อมูลสำเร็จ!</h2>
        <p className="text-gray-600 mb-6">ขอบคุณสำหรับข้อมูล! ข้อมูลของคุณจะปรากฏบนเว็บไซต์หลังจากการตรวจสอบโดยผู้ดูแลระบบ</p>
        <button
            onClick={onClose}
            className="py-2 px-6 bg-green-700 text-white rounded-lg hover:bg-green-800"
        >
            ปิดหน้าต่าง
        </button>
    </div>
);


const AlumniForm: React.FC<AlumniFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<Omit<AlumniProfile, 'id'>>({
    name: '',
    generation: '',
    businessName: '',
    category: BusinessCategory.OTHER,
    description: '',
    publicContact: '',
    website: '',
    location: '',
    profileImage: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const [geminiError, setGeminiError] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'กรุณาระบุชื่อ-สกุล';
    if (!formData.businessName) newErrors.businessName = 'กรุณาระบุชื่อกิจการ/ทักษะ';
    if (!formData.description) newErrors.description = 'กรุณาใส่คำอธิบายกิจการ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    if (validate()) {
        setSubmissionStatus('submitting');
        try {
            const finalData = {
                ...formData,
                profileImage: formData.profileImage || `https://picsum.photos/seed/${Date.now()}/300`
            };
            await addAlumni(finalData);
            setSubmissionStatus('success');
        } catch(err: any) {
            setSubmissionError(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
            setSubmissionStatus('error');
        }
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.businessName || !formData.category) {
      setGeminiError('กรุณากรอกชื่อกิจการและเลือกประเภทก่อน');
      return;
    }
    setIsGenerating(true);
    setGeminiError('');
    try {
      const description = await generateDescription(formData.businessName, formData.category);
      setFormData(prev => ({...prev, description}));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่รู้จัก";
        if (errorMessage.includes("API Key")) {
           setGeminiError("คุณสมบัตินี้ต้องใช้ API Key ที่ตั้งค่าไว้ในระบบ");
        } else {
           setGeminiError(errorMessage);
        }
    } finally {
      setIsGenerating(false);
    }
  }

  if (submissionStatus === 'success') {
    return <SuccessView onClose={onClose} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields are mostly unchanged */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อ-สกุล*</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="generation" className="block text-sm font-medium text-gray-700">รุ่น (เช่น SIS02)</label>
          <input type="text" name="generation" id="generation" value={formData.generation} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
       <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">ชื่อกิจการ/ทักษะ*</label>
          <input type="text" name="businessName" id="businessName" value={formData.businessName} onChange={handleChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
        </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">ประเภทกิจการ*</label>
        <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm">
          {Object.values(BusinessCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div>
        <div className="flex justify-between items-center">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">คำอธิบายกิจการ*</label>
            <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900 disabled:opacity-50 disabled:cursor-wait">
                <SparklesIcon className="w-4 h-4" />
                {isGenerating ? 'กำลังสร้าง...' : 'AI ช่วยเขียน'}
            </button>
        </div>
        <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}></textarea>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        {geminiError && <p className="text-red-500 text-xs mt-1">{geminiError}</p>}
      </div>

       <div>
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">URL รูปภาพโปรไฟล์/โลโก้</label>
          <input type="text" name="profileImage" id="profileImage" placeholder="https://..." value={formData.profileImage} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <h4 className="text-lg font-semibold text-gray-800 border-t pt-4 mt-4">ข้อมูลสำหรับติดต่อ (สาธารณะ)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="publicContact" className="block text-sm font-medium text-gray-700">เบอร์โทร/อีเมล (สำหรับติดต่องาน)</label>
          <input type="text" name="publicContact" id="publicContact" value={formData.publicContact} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
         <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">เว็บไซต์/เพจ Facebook</label>
          <input type="text" name="website" id="website" placeholder="https://..." value={formData.website} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">ที่อยู่/ตำแหน่งร้าน</label>
        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">ยกเลิก</button>
        <button type="submit" disabled={submissionStatus === 'submitting'} className="py-2 px-4 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-green-400 disabled:cursor-wait">
          {submissionStatus === 'submitting' ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </div>
      {submissionStatus === 'error' && <p className="text-red-500 text-sm mt-2 text-right">{submissionError}</p>}
    </form>
  );
};

export default AlumniForm;