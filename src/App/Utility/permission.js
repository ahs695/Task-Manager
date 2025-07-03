export function hasPermission(permissions, resource, action = "view") {
  return permissions?.some(
    (perm) =>
      perm.resource.toLowerCase() === resource.toLowerCase() &&
      perm.actions.includes(action)
  );
}
