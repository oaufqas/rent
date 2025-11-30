import $api from "./Api"

export const authService = {
  register: (email, password) => $api.post('/auth/register', {email, password}),
  

  login: (email, password) => $api.post('/auth/login', {email, password}),
  

  verify: (userId, code) => $api.post('/auth/verify', { userId, code }),
  

  logout: () => $api.post('/auth/logout'),
  
  
  activate: (link) => $api.get(`/auth/activate/${link}`),
  

  refresh: () => $api.get('/auth/refresh'),
  

  getMe: () => $api.get('/auth/me'),
  

  updateProfile: (profileData) => $api.put('/auth/profile', profileData),
  

  changePassword: (email) => $api.put('/auth/change-password', {email}),
  

  verifyPassword: (userId, password, code) => $api.put('/auth/verify-password', { userId, password, code }),
}

export default authService