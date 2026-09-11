import adminApi from "./adminApi";


// ==========================================
// GET ALL USERS
// ==========================================

export const getAdminUsers = async () => {
  const response = await adminApi.get("/admin/users");

  return response.data;
};


// ==========================================
// GET USER BY ID
// ==========================================

export const getAdminUserById = async (userId) => {
  const response = await adminApi.get(
    `/admin/users/${userId}`
  );

  return response.data;
};


// ==========================================
// UPDATE USER STATUS
// ==========================================

export const updateAdminUserStatus = async (
  userId,
  isActive
) => {
  const response = await adminApi.patch(
    `/admin/users/${userId}/status`,
    {
      isActive,
    }
  );

  return response.data;
};