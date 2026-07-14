export const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  
  // IP داخلی
  "http://192.168.100.6:5173",
  "http://192.168.100.6",
  "http://192.168.100.6:80",
  
  // اگر از nginx-proxy استفاده می‌کنید
  "http://192.168.100.6:80",
  
  // اگر دامنه دارید
  // "https://yourdomain.com",
  
  // برای Docker internal
  "http://frontend:80",
  "http://nginx-proxy:80",
];