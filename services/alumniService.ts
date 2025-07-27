
import { AlumniProfile, BusinessCategory, AlumniFormData } from '../types';

// =====================================================================================
// สำคัญ: กรุณาแทนที่ URL นี้ด้วย URL ของ Google Apps Script ที่คุณสร้างขึ้น
// =====================================================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyAOe7glD0cYlK1tj2mo5JZgSgRrJNdKdPU53ydX5riGy3yq4j0XbCXVWiDxBEYLuE0QQ/exec';


// --- MOCK DATA FOR DEVELOPMENT ---
const MOCK_ALUMNI_DATA: AlumniProfile[] = [
    {
        id: '1',
        name: 'นายสันติ ชน',
        generation: 'SIS01',
        businessName: 'ร้านอาหาร-ตามสั่ง สันติชน',
        category: BusinessCategory.FOOD_AND_BEVERAGE,
        description: 'ร้านอาหารตามสั่งและอาหารฮาลาลต้นตำรับ เปิดมานานกว่า 10 ปี บริการอาหารจานด่วนและเมนูพิเศษประจำวัน',
        publicContact: '081-234-5678',
        website: 'https://facebook.com/santichonfood',
        location: '123 ถนนลาดพร้าว, กรุงเทพมหานคร',
        profileImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400',
    },
    {
        id: '2',
        name: 'นางสาวมานี มีดี',
        generation: 'SIS02',
        businessName: 'Manee Design & Art',
        category: BusinessCategory.FREELANCE,
        description: 'รับออกแบบกราฟิก, โลโก้, และสื่อโฆษณาทุกชนิด มีประสบการณ์ทำงานกับบริษัทชั้นนำ',
        publicContact: 'contact@maneedesign.com',
        website: 'https://www.behance.net/maneedesign',
        location: 'ออนไลน์',
        profileImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400',
    },
    // Add more mock data as needed
];
// --- END OF MOCK DATA ---


export const getAlumni = async (): Promise<AlumniProfile[]> => {
  if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
    console.warn("คำเตือน: GOOGLE_SCRIPT_URL ยังไม่ได้ตั้งค่าใน services/alumniService.ts ขณะนี้กำลังใช้ข้อมูลตัวอย่างสำหรับการแสดงผล");
    await new Promise(resolve => setTimeout(resolve, 500));
    return Promise.resolve(MOCK_ALUMNI_DATA);
  }
  
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'GET',
        redirect: 'follow'
    });
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data as AlumniProfile[];
  } catch (error) {
    console.error("Failed to fetch alumni data:", error);
    throw new Error("ไม่สามารถโหลดข้อมูลศิษย์เก่าได้ กรุณาตรวจสอบการตั้งค่า Google Script หรือลองอีกครั้งในภายหลัง");
  }
};

export const addAlumni = async (profileData: AlumniFormData): Promise<{result: string}> => {
   if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
    console.warn("คำเตือน: GOOGLE_SCRIPT_URL ยังไม่ได้ตั้งค่า กำลังจำลองการส่งข้อมูลสำเร็จ");
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Mock data submitted:", profileData);
    return Promise.resolve({ result: "success" });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });
    
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return { result: "success" };

  } catch (error) {
    console.error("Failed to submit alumni data:", error);
    throw new Error("ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
  }
};
