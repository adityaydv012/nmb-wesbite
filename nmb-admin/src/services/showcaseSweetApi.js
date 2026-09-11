import adminApi from "./adminApi";

export const getAdminShowcaseSweets = async () => {
  const response = await adminApi.get(
    "/showcase-sweets/admin"
  );

  return response.data;
};

export const getAdminShowcaseSweetById = async (
  sweetId
) => {
  const response = await adminApi.get(
    `/showcase-sweets/admin/${sweetId}`
  );

  return response.data;
};

export const createShowcaseSweet = async (sweetData) => {
  const response = await adminApi.post(
    "/showcase-sweets",
    sweetData
  );

  return response.data;
};

export const updateShowcaseSweet = async (
  sweetId,
  sweetData
) => {
  const response = await adminApi.patch(
    `/showcase-sweets/${sweetId}`,
    sweetData
  );

  return response.data;
};

export const updateShowcaseSweetStatus = async (
  sweetId,
  isActive
) => {
  const response = await adminApi.patch(
    `/showcase-sweets/${sweetId}/status`,
    {
      isActive,
    }
  );

  return response.data;
};

export const deleteShowcaseSweet = async (sweetId) => {
  const response = await adminApi.delete(
    `/showcase-sweets/${sweetId}`
  );

  return response.data;
};