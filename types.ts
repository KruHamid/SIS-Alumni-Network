
export enum BusinessCategory {
  FOOD_AND_BEVERAGE = "อาหารและเครื่องดื่ม",
  EDUCATION = "การศึกษา",
  RETAIL = "ค้าปลีก",
  SERVICE = "บริการ",
  TECHNOLOGY = "เทคโนโลยี",
  HEALTH = "สุขภาพและความงาม",
  OTHER = "อื่นๆ",
  FREELANCE = "ฟรีแลนซ์/ผู้เชี่ยวชาญ"
}

export interface AlumniProfile {
  id: string;
  name: string;
  generation?: string;
  businessName: string;
  category: BusinessCategory[];
  description: string;
  publicContact?: string;
  website?: string;
  location?: string;
  profileImage?: string;
}

// New type for the form submission payload
export interface AlumniFormData extends Omit<AlumniProfile, 'id' | 'profileImage'> {
    imageBase64: string | null; // Base64 encoded image string
}