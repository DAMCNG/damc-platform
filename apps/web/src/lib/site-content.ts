export interface ContactContent {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export const FALLBACK_CONTACT: ContactContent = {
  email: "info@damcng.com",
  phone: "+234 800 000 0000",
  address: "Placeholder address, Lagos, Nigeria",
  whatsapp: "https://wa.me/2348000000000",
  instagram: "https://instagram.com/damcofficial",
  facebook: "https://facebook.com/damcofficial",
  tiktok: "https://tiktok.com/@damcofficial",
};
