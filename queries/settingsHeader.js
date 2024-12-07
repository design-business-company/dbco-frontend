export const settingsHeader = groq`*[_type=="settingsHeader"][0]{
  links[] {
    title,
    "slug": page->slug.current,
  }
}`;
