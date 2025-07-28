
import React, { useState } from 'react';
import { BusinessCategory, AlumniFormData } from '../types';
import { addAlumni } from '../services/alumniService';

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
  const [formData, setFormData] = useState<Omit<AlumniFormData, 'imageBase64'>>({
    name: '',
    generation: '',
    businessName: '',
    category: [],
    description: '',
    publicContact: '',
    website: '',
    location: '',
  });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'error' | 'success'>('idle');
  const [submissionError, setSubmissionError] = useState('');
  const [imageError, setImageError] = useState('');
  
  const MAX_FILE_SIZE_MB = 2;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'กรุณาระบุชื่อ-สกุล';
    if (!formData.businessName) newErrors.businessName = 'กรุณาระบุชื่อกิจการ/ทักษะ';
    if (formData.category.length === 0) newErrors.category = 'กรุณาเลือกอย่างน้อยหนึ่งหมวดหมู่';
    if (!formData.description) newErrors.description = 'กรุณาใส่คำอธิบายกิจการ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryToToggle: BusinessCategory) => {
    setFormData(prev => {
        const newCategories = prev.category.includes(categoryToToggle)
            ? prev.category.filter(c => c !== categoryToToggle)
            : [...prev.category, categoryToToggle];
        return { ...prev, category: newCategories };
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError('');

    if (file.size > MAX_FILE_SIZE_BYTES) {
        setImageError(`ขนาดไฟล์ต้องไม่เกิน ${MAX_FILE_SIZE_MB}MB`);
        return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setImageError('รองรับเฉพาะไฟล์ JPG และ PNG เท่านั้น');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        setImageBase64(reader.result as string);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(file));
    };
    reader.onerror = () => {
        setImageError('ไม่สามารถอ่านไฟล์ได้');
    };
  };

  const handleRemoveImage = () => {
    setImageBase64(null);
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    if (validate()) {
        setSubmissionStatus('submitting');
        try {
            await addAlumni({ ...formData, imageBase64 });
            setSubmissionStatus('success');
        } catch(err: any) {
            setSubmissionError(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
            setSubmissionStatus('error');
        }
    }
  };

  if (submissionStatus === 'success') {
    return <SuccessView onClose={onClose} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="mt-2 flex flex-wrap gap-2">
            {Object.values(BusinessCategory).map(cat => (
                <button
                type="button"
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 border ${
                    formData.category.includes(cat)
                    ? 'bg-green-700 text-white border-green-700 shadow'
                    : 'bg-white text-gray-700 hover:bg-green-100 border-gray-300'
                }`}
                >
                {cat}
                </button>
            ))}
        </div>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">คำอธิบายกิจการ*</label>
        <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} className={`mt-1 block w-full p-2 border rounded-md shadow-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`}></textarea>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

       <div>
          <label className="block text-sm font-medium text-gray-700">รูปภาพโปรไฟล์/โลโก้</label>
          <div className="mt-1 flex items-center gap-4">
            {imagePreview ? (
                 <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover bg-gray-200" />
            ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m-6 0h.01M16 16v-4m0 4h4m-4 0l-1.5-1.5" /></svg>
                </div>
            )}
            <div>
                 <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                    เลือกรูปภาพ
                 </label>
                 <input id="file-upload" name="file-upload" type="file" className="hidden-file-input" onChange={handleFileChange} accept="image/png, image/jpeg" />
                 {imagePreview && (
                    <button type="button" onClick={handleRemoveImage} className="ml-2 text-sm text-red-600 hover:text-red-800">ลบออก</button>
                 )}
            </div>
          </div>
           {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
           <p className="text-xs text-gray-500 mt-1">แนะนำ: ไฟล์ JPG, PNG ขนาดไม่เกิน {MAX_FILE_SIZE_MB}MB</p>
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