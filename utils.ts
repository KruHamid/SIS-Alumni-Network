/**
 * แปลง URL สำหรับแชร์ไฟล์ของ Google Drive ให้อยู่ในรูปแบบที่สามารถแสดงผลได้โดยตรงในแท็ก <img>
 * ตัวอย่าง: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * จะถูกแปลงเป็น: https://lh3.googleusercontent.com/d/FILE_ID
 *
 * วิธีนี้มีความน่าเชื่อถือและให้ภาพคุณภาพดีกว่าการใช้ '/thumbnail' หรือ 'uc?export=view'
 * หาก URL ที่ระบุไม่ใช่ลิงก์ของ Google Drive ในรูปแบบที่รู้จัก จะคืนค่า URL เดิมกลับไป
 * @param url - URL ของรูปภาพที่ต้องการแปลง
 * @returns URL ที่แปลงแล้ว หรือ URL เดิมหากไม่สามารถแปลงได้
 */
export const transformToDirectGdriveUrl = (url?: string): string | undefined => {
    if (!url || typeof url !== 'string' || !url.includes('drive.google.com/file/d/')) {
        return url;
    }

    const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
        const fileId = match[1];
        // Use the more reliable and higher quality direct content link from Google's user content servers.
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    // คืนค่า URL เดิมหากไม่พบ File ID ในรูปแบบที่ถูกต้อง
    return url;
};
