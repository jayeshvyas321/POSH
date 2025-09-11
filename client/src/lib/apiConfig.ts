// Centralized API configuration
const API_CONFIG = {
  // Use environment variable with fallback to production backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://98.130.134.68:8081',
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      SIGNUP: '/api/auth/signup',
      RESET_PASSWORD: '/api/auth/reset-password',
      GET_ALL_ROLES: '/api/auth/getAllRoles',
      ADD_ROLE: '/api/auth/addRole',
      GET_ALL_PERMISSIONS: '/api/auth/getAllPermissions',
      ADD_PERMISSION: '/api/auth/addPermission',
    },
    USERS: {
      LIST: '/api/users?pageNo=0&pageSize=100&sortBy=id&sortDir=ASC', // Java pagination format
      GET: (id: number) => `/api/users/${id}`,
      CREATE: '/api/users',
      UPDATE: (id: number) => `/api/users/${id}`,
      DELETE: (id: number) => `/api/users/${id}`,
      NOTIFICATIONS: (id: number) => `/api/users/${id}/notifications`,
    },
    ROLES: {
      LIST: '/api/roles',
    },
    NOTIFICATIONS: {
      CREATE: '/api/notifications',
      MARK_READ: (id: number) => `/api/notifications/${id}/read`,
    },
    DASHBOARD: {
      STATS: '/api/dashboard/stats',
    },
    LOGS: {
      DOWNLOAD: '/logs/download',
    },
  },
};

// Helper function to build full API URLs
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

export { API_CONFIG };
export default API_CONFIG;