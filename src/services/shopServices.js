import api from "./api";

// ✅ lat, lng, radius — MapView se pass hoga
export const getShops = async ({ lat, lng, radius = 5, page = 1, limit = 20 } = {}) => {
  try {
    const params = { page, limit };
    if (lat && lng) {
      params.lat    = lat;
      params.lng    = lng;
      params.radius = radius; // km
    }
    const res = await api.get("/shops", { params });
    return res.data;
  } catch (err) {
    console.warn("Get shops error:", err);
    throw err;
  }
};

export const createShop = async (data) => {
  const res = await api.post("/shops/create", data);
  return res.data;
};

export const toggleShopStatus = async (shopId) => {
  const res = await api.patch(`/shops/${shopId}/toggle-status`);
  return res.data;
};

export const getMyShops = async () => {
  const res = await api.get("/shops/my-shops");
  return res.data;
};