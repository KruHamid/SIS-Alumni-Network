
import { AlumniProfile, BusinessCategory, AlumniFormData } from '../types';

// =====================================================================================
// สำคัญ: กรุณาแทนที่ URL นี้ด้วย URL ของ Google Apps Script ที่คุณสร้างขึ้น
// =====================================================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySFzRhZjbvDMhn3381Klq0jP6Y_1EQaEngIcqcVtX0oh6m3R5TOhH-7TWcB_hyI9mYxQ/exec';


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
];
// --- END OF MOCK DATA ---


export const getAlumni = async (): Promise<AlumniProfile[]> => {
  if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') || !GOOGLE_SCRIPT_URL) {
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
     // ตรวจสอบว่ามีข้อผิดพลาดจากฝั่งสคริปต์หรือไม่
    if (data.result === 'error') {
      throw new Error(`Error from Google Script: ${data.message}`);
    }
    return data as AlumniProfile[];
  } catch (error) {
    console.error("Failed to fetch alumni data:", error);
    throw new Error("ไม่สามารถโหลดข้อมูลศิษย์เก่าได้ กรุณาตรวจสอบการตั้งค่า Google Script หรือลองอีกครั้งในภายหลัง");
  }
};

export const addAlumni = async (profileData: AlumniFormData): Promise<{result: string}> => {
   if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') || !GOOGLE_SCRIPT_URL) {
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
    
    const responseData = await response.json();

    if (responseData.result === 'error') {
      // Throw an error with the specific message from the detective script
      throw new Error(responseData.message || "เกิดข้อผิดพลาดที่ไม่รู้จักใน Google Script");
    }

    if (!response.ok) {
        // This will catch network-level errors
      throw new Error(`การเชื่อมต่อกับเซิร์ฟเวอร์ล้มเหลว: ${response.status} ${response.statusText}`);
    }

    return { result: "success" };

  } catch (error: any) {
    console.error("Failed to submit alumni data:", error);
    // Re-throw the error so the form can catch it and display the message
    throw new Error(error.message || "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
  }
};
