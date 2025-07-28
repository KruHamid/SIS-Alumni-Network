
import { AlumniProfile, BusinessCategory, AlumniFormData } from '../types';

// =====================================================================================
// สำคัญ: กรุณาแทนที่ URL นี้ด้วย URL ของ Google Apps Script ที่คุณสร้างขึ้น
// =====================================================================================
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySFzRhZjbvDMhn3381Klq0jP6Y_1EQaEngIcqcVtX0oh6m3R5TOhH-7TWcB_hyI9mYxQ/exec';


// =====================================================================================
// หมายเหตุสำคัญ: วิธีแก้ไขเบอร์โทรศัพท์ที่ขึ้นต้นด้วย 0 แล้วเลข 0 หายไป
// =====================================================================================
// ปัญหานี้มักเกิดจาก Google Sheets จัดรูปแบบคอลัมน์เบอร์โทรศัพท์เป็น "ตัวเลข" (Number) โดยอัตโนมัติ
// ทำให้เลข 0 ที่นำหน้าถูกตัดออกไปก่อนที่ข้อมูลจะถูกส่งมายังแอปพลิเคชัน
//
// วิธีแก้ไข:
// 1. เปิด Google Sheet ที่เป็นฐานข้อมูลของคุณ
// 2. เลือกคอลัมน์ทั้งหมดที่ใช้เก็บเบอร์โทรศัพท์ (เช่น คอลัมน์ publicContact)
// 3. ไปที่เมนู "รูปแบบ" (Format) -> "ตัวเลข" (Number) -> "ข้อความธรรมดา" (Plain text)
// 4. หลังจากเปลี่ยนรูปแบบแล้ว, ข้อมูลเบอร์โทรศัพท์ที่มีอยู่ อาจจะต้องใส่เลข 0 นำหน้าเข้าไปใหม่
// 5. ข้อมูลใหม่ที่เพิ่มเข้ามาหลังจากนี้จะเก็บเลข 0 นำหน้าไว้ได้อย่างถูกต้อง
//
// การทำเช่นนี้จะทำให้ Google Sheets และ Apps Script ส่งข้อมูลเบอร์โทรศัพท์มาเป็น "ข้อความ" (String)
// แทนที่จะเป็น "ตัวเลข" (Number) และแอปพลิเคชันจะสามารถแสดงผลได้อย่างถูกต้อง
// =====================================================================================

// =====================================================================================
// หมายเหตุสำหรับนักพัฒนา (Backend/Google Apps Script):
// =====================================================================================
// 1. การเลือกหลายหมวดหมู่ (Category):
//    - เมื่อรับข้อมูล (doPost): ข้อมูล `category` จะเป็น Array ของ String (เช่น ["อาหาร", "บริการ"])
//      ให้แปลงเป็น String ที่คั่นด้วยจุลภาค (`,`) ก่อนบันทึกลงชีต เช่น `categories.join(',')`
//    - เมื่อส่งข้อมูล (doGet): ให้อ่าน String จากชีต แล้วแปลงกลับเป็น Array ด้วย `split(',')`
//      ก่อนส่งกลับมาเป็น JSON
// 2. ละติจูด/ลองจิจูด (Latitude/Longitude):
//    - ใน Google Sheet ให้สร้างคอลัมน์ `latitude` และ `longitude` เพื่อเก็บข้อมูลพิกัด
//    - Apps Script ควรอ่านค่าจากคอลัมน์เหล่านี้และส่งกลับมาเป็น Number
// =====================================================================================


// --- MOCK DATA FOR DEVELOPMENT ---
const MOCK_ALUMNI_DATA: AlumniProfile[] = [
    {
        id: '1',
        name: 'นายสันติ ชน',
        generation: 'SIS01',
        businessName: 'ร้านอาหาร-ตามสั่ง สันติชน',
        category: [BusinessCategory.FOOD_AND_BEVERAGE, BusinessCategory.SERVICE],
        description: 'ร้านอาหารตามสั่งและอาหารฮาลาลต้นตำรับ เปิดมานานกว่า 10 ปี บริการอาหารจานด่วนและเมนูพิเศษประจำวัน',
        publicContact: '081-234-5678',
        website: 'https://facebook.com/santichonfood',
        location: '123 ถนนลาดพร้าว, กรุงเทพมหานคร',
        profileImage: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=400',
        latitude: 13.7949,
        longitude: 100.5704,
    },
    {
        id: '2',
        name: 'นางสาวมานี มีดี',
        generation: 'SIS02',
        businessName: 'Manee Design & Art',
        category: [BusinessCategory.FREELANCE],
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
    
    // Transform category string from sheet (e.g., "Cat1,Cat2") into an array
    const transformedData = data.map((profile: any) => ({
        ...profile,
        // Convert comma-separated string from sheet to array
        category: typeof profile.category === 'string' 
            ? profile.category.split(',').map((c: string) => c.trim()).filter(Boolean) 
            : Array.isArray(profile.category) ? profile.category : [],
        // Ensure latitude and longitude are numbers
        latitude: profile.latitude ? parseFloat(profile.latitude) : undefined,
        longitude: profile.longitude ? parseFloat(profile.longitude) : undefined,
    }));

    return transformedData as AlumniProfile[];
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