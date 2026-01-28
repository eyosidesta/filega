import { API_BASE } from '../../utils/api'

const ADMIN_ROLE_KEY = 'filega_admin_role'
const DEFAULT_ROLE = 'ADMIN'

export const getAdminRole = () => {
  return localStorage.getItem(ADMIN_ROLE_KEY) || DEFAULT_ROLE
}

export const setAdminRole = (role) => {
  localStorage.setItem(ADMIN_ROLE_KEY, role)
}

export const adminFetch = async (path, options = {}) => {
  const headers = {
    'x-admin-role': getAdminRole(),
    ...(options.headers || {}),
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  return res
}
