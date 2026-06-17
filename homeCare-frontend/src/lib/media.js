import { API_ORIGIN } from "../config/api.js";

export function profileImageUrl(profileLink) {
  if (!profileLink) return null;
  if (profileLink.startsWith("http")) return profileLink;
  const path = profileLink.startsWith("/") ? profileLink : `/${profileLink}`;
  return `${API_ORIGIN}${path}`;
}
