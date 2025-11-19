function isAdmin(user) {
  if (!user) return false;
  return user.role.name === "ADMIN" || user.role.name === "SUPERADMIN";
}

function isFormateur(user) {
  if (!user) return false;
  return user.role.name === "FORMATEUR";
}

export { isAdmin, isFormateur };
