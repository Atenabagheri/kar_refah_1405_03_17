const axios = require("axios");

async function fetchBillsFromBargheMan({ payload, token }) {
  const url = "https://uiapi2.saapa.ir/api/sale/SaleEnergyHistory";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const { data } = await axios.post(url, payload, { headers, timeout: 20000 });
  return data.data ?? [];
}

module.exports = { fetchBillsFromBargheMan };
