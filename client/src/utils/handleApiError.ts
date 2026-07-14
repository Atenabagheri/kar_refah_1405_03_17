import axios from "axios";
import toast from "react-hot-toast";

export function handleApiError(error: unknown) {
  // بررسی نوع خطا
  if (axios.isAxiosError(error)) {
    // ✅ اگر درخواست لغو شده باشد، هیچ کاری نکن
    if (
      error.code === "ERR_CANCELED" || // axios v1+
      error.name === "CanceledError" || // axios v0.27-
      error.name === "AbortError" // برای fetch API
    ) {
      return; // خطای لغو‌شده — نیازی به هندل نیست
    }
    // ✅ اگر سرور پیام خطا دارد، نمایش بده
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    // ✅ اگر پیام خطا در response نیست
    else if (error.message) {
      toast.error(error.message);
    }
    // ✅ خطای ناشناخته
    else {
      console.error(error);
      toast.error("خطای ناشناخته رخ داد");
    }
  }
  // ✅ اگر خطا از نوع Axios نبود
  else {
    console.error(error);
    toast.error("خطای غیرمنتظره‌ای رخ داد");
  }
}
