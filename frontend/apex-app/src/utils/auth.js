export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function isAdmin() {
  const u = getCurrentUser();
  if (!u || !u.role) return false;
  const r = String(u.role).toLowerCase();
  return r === 'admin' || r === 'ad' || r.includes('admin');
}

export default { getCurrentUser, isAdmin };
