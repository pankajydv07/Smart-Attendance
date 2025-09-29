// Dev helper to seed admin credentials into localStorage
export function seedDevAdmin(user = 'admin@local', pass = 'Password123') {
  try {
    localStorage.setItem('dev_admin_user', user);
    localStorage.setItem('dev_admin_pass', pass);
    return { user, pass };
  } catch (err) {
    // localStorage may be unavailable in some environments
    throw new Error('Unable to seed localStorage: ' + String(err));
  }
}
