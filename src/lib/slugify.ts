/**
 * Generates an SEO-friendly slug from a string.
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')                   // Split accented characters into their base characters and accents
    .replace(/[\u0300-\u036f]/g, '')     // Remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')                // Replace spaces with -
    .replace(/[^\w-]+/g, '')             // Remove all non-word chars
    .replace(/--+/g, '-');               // Replace multiple - with single -
};

/**
 * Creates a product URL using ID and Name.
 */
export const getProductUrl = (id: number, name: string): string => {
  return `/product/${id}-${slugify(name)}`;
};

/**
 * Parses the ID from a product slug.
 */
export const parseProductId = (slug: string | undefined): number | null => {
  if (!slug) return null;
  const match = slug.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};
