export const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "6285731590848";
export const ITCH_IO_URL = process.env.NEXT_PUBLIC_ITCH_IO_URL || "";

export const STORAGE_BUCKETS = {
  NEWS: process.env.NEXT_PUBLIC_STORAGE_BUCKET_NEWS || "news-images",
  MERCHANDISE: process.env.NEXT_PUBLIC_STORAGE_BUCKET_MERCHANDISE || "merchandise-images",
  ABOUT: process.env.NEXT_PUBLIC_STORAGE_BUCKET_ABOUT || "about-images",
};

export function generateUserToken(): string {
  // Generate random hex string similar to PHP bin2hex(random_bytes(16))
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
