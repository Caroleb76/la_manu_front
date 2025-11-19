export function handleNameInitials(name) {
  if (!name) return "?";
  const words = name.split(" ");
  let initials = "";
  for (let i = 0; i < words.length; i++) {
    initials += words[i][0].toUpperCase();
  }
  if (initials.length > 2) initials = initials.slice(0, 2);
  if (initials.length < 2) initials += words[words.length - 1][1].toUpperCase();
  return initials;
}
