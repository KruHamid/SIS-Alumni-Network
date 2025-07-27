
import { AlumniProfile, BusinessCategory } from '../types';

// =====================================================================================
// สำคัญ: กรุณาแทนที่ URL นี้ด้วย URL ของ Google Apps Script ที่คุณสร้างขึ้น
// ดูคำแนะนำในการตั้งค่าในส่วนคำอธิบาย
// =====================================================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySFzRhZjbvDMhn3381Klq0jP6Y_1EQaEngIcqcVtX0oh6m3R5TOhH-7TWcB_hyI9mYxQ/exec';


// --- MOCK DATA FOR DEVELOPMENT ---
// This data is used when the Google Script URL is not set.
// This allows the app to run for development and testing purposes.
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
    {
        id: '3',
        name: 'นายอาลี บาบา',
        generation: 'SIS01',
        businessName: 'Alibaba Tech Repair',
        category: BusinessCategory.SERVICE,
        description: 'บริการซ่อมคอมพิวเตอร์, โน้ตบุ๊ค, และอุปกรณ์อิเล็กทรอนิกส์ด่วน รอรับได้เลย',
        publicContact: '02-987-6543',
        website: '',
        location: 'พันธุ์ทิพย์พลาซ่า ชั้น 3',
        profileImage: 'https://images.unsplash.com/photo-1593786267439-50c66cb17b43?q=80&w=400',
    },
    {
        id: '4',
        name: 'นางสาวฟาติมา สุขใจ',
        generation: 'SIS03',
        businessName: 'Fatima Bakery',
        category: BusinessCategory.FOOD_AND_BEVERAGE,
        description: 'เบเกอรี่โฮมเมด สดใหม่ทุกวัน รับทำเค้กวันเกิดและจัดเบรคประชุม',
        publicContact: 'Line: @fatimabakery',
        website: 'https://instagram.com/fatimabakery',
        location: 'สั่งออนไลน์เท่านั้น',
        profileImage: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=400',
    },
    {
        id: '5',
        name: 'นายอดัม พอใจ',
        generation: 'SIS02',
        businessName: 'Adam’s Tutor',
        category: BusinessCategory.EDUCATION,
        description: 'สถาบันกวดวิชาคณิตศาสตร์และวิทยาศาสตร์ สำหรับนักเรียนประถมและมัธยม',
        publicContact: '085-555-5555',
        website: 'https://www.adamtutor.com',
        location: 'ใกล้ BTS สยาม',
        profileImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=400',
    }
];
// --- END OF MOCK DATA ---


export const getAlumni = async (): Promise<AlumniProfile[]> => {
  if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
    console.warn("คำเตือน: GOOGLE_SCRIPT_URL ยังไม่ได้ตั้งค่าใน services/alumniService.ts ขณะนี้กำลังใช้ข้อมูลตัวอย่างสำหรับการแสดงผล");
    // Simulate network delay
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
    // สคริปต์จะส่งข้อมูลกลับมาเป็น array ที่มี key ตรงกับ AlumniProfile
    return data as AlumniProfile[];
  } catch (error) {
    console.error("Failed to fetch alumni data:", error);
    throw new Error("ไม่สามารถโหลดข้อมูลศิษย์เก่าได้ กรุณาตรวจสอบการตั้งค่า Google Script หรือลองอีกครั้งในภายหลัง");
  }
};

export const addAlumni = async (profileData: Omit<AlumniProfile, 'id'>): Promise<{result: string}> => {
   if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
    console.warn("คำเตือน: GOOGLE_SCRIPT_URL ยังไม่ได้ตั้งค่า กำลังจำลองการส่งข้อมูลสำเร็จ");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    
    // Since Google Apps Script doPost can redirect, a successful POST might not have a parsable body
    // but we can check the 'ok' status. A simple success check is sufficient here.
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Assuming a successful response means the data was accepted.
    return { result: "success" };

  } catch (error) {
    console.error("Failed to submit alumni data:", error);
    throw new Error("ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
  }
};