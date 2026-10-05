import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured with backend-only environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Sanitizes a title/slug to produce clean, readable Cloudinary public IDs
 * Example: "Dussehra 2026 Special Offer!" -> "dussehra-2026-special-offer"
 */
function createPublicIdSlug(nameOrTitle) {
  if (!nameOrTitle) return `promo-${Date.now()}`;
  const slug = nameOrTitle
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // remove extension if present
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // trim hyphens
  return slug || `promo-${Date.now()}`;
}

export const cloudinaryService = {
  /**
   * Uploads a promotional image to Cloudinary in `kodewar/promotions/`
   *
   * @param {string|Buffer} fileSource - Base64 Data URL, file path, or Buffer
   * @param {string} [slugName] - Desired name for public_id slug (e.g. 'dussehra-2026')
   * @returns {Promise<{ imageUrl: string, cloudinaryPublicId: string, width: number, height: number, format: string }>}
   */
  async uploadPromotionImage(fileSource, slugName) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary environment variables are missing on the backend server.');
    }

    const folder = 'kodewar/promotions';
    const filenameSlug = createPublicIdSlug(slugName);
    const publicId = `${folder}/${filenameSlug}`;

    try {
      const uploadResult = await cloudinary.uploader.upload(fileSource, {
        public_id: filenameSlug,
        folder: folder,
        overwrite: true,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Construct optimized URL with auto quality and format
      const optimizedUrl = uploadResult.secure_url;

      return {
        imageUrl: optimizedUrl,
        cloudinaryPublicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      };
    } catch (err) {
      console.error('[Cloudinary Service] Upload Error:', err);
      throw new Error(`Failed to upload image to Cloudinary: ${err.message}`);
    }
  },

  /**
   * Deletes a promotional image from Cloudinary by public ID
   *
   * @param {string} publicId - e.g. 'kodewar/promotions/dussehra-2026'
   * @returns {Promise<boolean>}
   */
  async deletePromotionImage(publicId) {
    if (!publicId || typeof publicId !== 'string') return false;

    try {
      const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
      return result.result === 'ok';
    } catch (err) {
      console.error('[Cloudinary Service] Delete Error:', err);
      return false; // Non-fatal if asset was already deleted
    }
  },

  /**
   * Replaces an existing promotional image on Cloudinary
   *
   * @param {string} oldPublicId - Existing public_id to delete if different
   * @param {string|Buffer} newFileSource - New image file
   * @param {string} [slugName] - Desired new public ID slug
   * @returns {Promise<{ imageUrl: string, cloudinaryPublicId: string }>}
   */
  async replacePromotionImage(oldPublicId, newFileSource, slugName) {
    const uploadRes = await this.uploadPromotionImage(newFileSource, slugName);

    if (oldPublicId && oldPublicId !== uploadRes.cloudinaryPublicId) {
      await this.deletePromotionImage(oldPublicId);
    }

    return uploadRes;
  },
};
