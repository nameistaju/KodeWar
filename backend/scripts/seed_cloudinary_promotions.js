import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { cloudinaryService } from '../src/services/cloudinaryService.js';
import { db } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedCloudinaryPromotions() {
  console.log('[Seed] Starting Cloudinary promotion seeding...');
  await db.initialize();

  const offersDir = path.resolve(__dirname, '../../frontend/public/offers');

  const filesToUpload = [
    {
      file: path.join(offersDir, 'digital-growth-b4ca5d92.webp'),
      title: 'Digital Marketing Growth Campaign 2026',
      slug: 'digital-growth-2026',
      destinationUrl: '/digital-marketing',
      homepageBanner: true,
      popup: false,
    },
    {
      file: path.join(offersDir, 'dussehra-special.svg'),
      title: 'Dussehra Festival Special Offer',
      slug: 'dussehra-special-2026',
      destinationUrl: '/contact',
      homepageBanner: false,
      popup: true,
    }
  ];

  for (const item of filesToUpload) {
    if (!fs.existsSync(item.file)) {
      console.warn(`File not found: ${item.file}`);
      continue;
    }

    try {
      console.log(`Uploading ${item.slug} to Cloudinary...`);
      const uploadRes = await cloudinaryService.uploadPromotionImage(item.file, item.slug);
      console.log(`Uploaded! URL: ${uploadRes.imageUrl}, Public ID: ${uploadRes.cloudinaryPublicId}`);

      const promoId = `promo-${item.slug}`;
      const existing = await db.find('promotions', (p) => p.id === promoId || p.title === item.title);

      const promoData = {
        id: promoId,
        title: item.title,
        placement: item.homepageBanner && item.popup ? 'BOTH' : item.homepageBanner ? 'BANNER' : 'POPUP',
        image_url: uploadRes.imageUrl,
        cloudinary_public_id: uploadRes.cloudinaryPublicId,
        target_url: item.destinationUrl,
        priority: 1,
        is_active: true,
        display_frequency: 'ONCE_PER_SESSION',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        await db.update('promotions', (p) => p.id === existing.id, promoData);
        console.log(`Updated database record for ${item.title}`);
      } else {
        await db.insert('promotions', promoData);
        console.log(`Inserted database record for ${item.title}`);
      }
    } catch (err) {
      console.error(`Failed seeding ${item.slug}:`, err);
    }
  }

  console.log('[Seed] Cloudinary promotion seeding complete.');
  process.exit(0);
}

seedCloudinaryPromotions();
