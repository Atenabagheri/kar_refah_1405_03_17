const axios = require("axios");
const Redis = require("ioredis");

const redis = new Redis(); // یا از دیگر config ها استفاده کن
const LOGIN_URL = "https://uiapi2.saapa.ir/api/auth/login"; // مثال — اگر این نیست جایگزین کن
const EXTERNAL_BILL_URL = "https://uiapi2.saapa.ir/api/ebills/GetPowerBillData";

const CACHED_TOKEN_KEY = "saapa:jwt";

export async function loginAndCacheToken(username, password) {
  // تماس به endpoint لاگین
  const resp = await axios.post(
    LOGIN_URL,
    { username, password },
    {
      headers: { "Content-Type": "application/json" },
      // withCredentials: true // اگر سرور کوکی می‌فرسته که نیاز است
    }
  );

  // چند حالت ممکنه:
  // 1) token در body باشد: resp.data.token
  // 2) token در set-cookie header باشد: resp.headers['set-cookie']
  let token = null;
  if (resp.data && resp.data.token) {
    token = resp.data.token;
  } else if (resp.headers && resp.headers["set-cookie"]) {
    // اگر توکن به‌صورت کوکی است، گاهی خود API مقدار JWT را در کوکی می‌گذارد
    // باید کوکی را parse کنی تا مقدار JWT را استخراج کنی
    // برای نمونه ساده اینجا کوکی را ذخیره می‌کنیم
    await redis.set(
      CACHED_TOKEN_KEY,
      JSON.stringify({ cookie: resp.headers["set-cookie"] }),
      "EX",
      60 * 60
    );
    return { cookie: resp.headers["set-cookie"] };
  }

  if (!token) throw new Error("Token not found in login response");

  // ذخیره توکن در Redis با TTL مناسب (یا در DB)
  await redis.set(CACHED_TOKEN_KEY, token, "EX", 60 * 60); // مثال: 1 ساعت
  return token;
}

export async function getCachedToken() {
  return await redis.get(CACHED_TOKEN_KEY);
}

export async function fetchBillWithCachedToken(payload) {
  let token = await getCachedToken();
  if (!token) {
    // باید لاگین کنیم (باید username/password را امن داشته باشیم؛ می‌تونیم از ENV یا DB برای هر کاربر)
    // برای نمونه از متغیرهای محیطی:
    token = await loginAndCacheToken(
      process.env.SAAPA_USER,
      process.env.SAAPA_PASS
    );
  }

  try {
    const resp = await axios.post(EXTERNAL_BILL_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return resp.data;
  } catch (err) {
    // اگر خطای 401 یا منقضی بودن توکن — سعی می‌کنیم دوباره لاگین کنیم و یک بار دیگر درخواست بزنیم
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403)
    ) {
      token = await loginAndCacheToken(
        process.env.SAAPA_USER,
        process.env.SAAPA_PASS
      );
      const retry = await axios.post(EXTERNAL_BILL_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return retry.data;
    }
    throw err;
  }
}
