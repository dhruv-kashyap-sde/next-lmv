import connectDB from '@/lib/mongodb';
import Brand from '@/models/Brand';
import Category from '@/models/Category';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lootmyvouchers.in';

export default async function sitemap() {
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/vouchers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic pages - Brands and Categories
  let dynamicPages = [];

  try {
    await connectDB();

    // Get all active brands
    const brands = await Brand.find({ isActive: true }).select('slug updatedAt').lean();
    const brandPages = brands.map((brand) => ({
      url: `${BASE_URL}/vouchers?brand=${brand.slug}`,
      lastModified: brand.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    // Get all active categories
    const categories = await Category.find({ isActive: true }).select('slug updatedAt').lean();
    const categoryPages = categories.map((category) => ({
      url: `${BASE_URL}/vouchers?category=${category.slug}`,
      lastModified: category.updatedAt || new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    dynamicPages = [...brandPages, ...categoryPages];
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
  }

  return [...staticPages, ...dynamicPages];
}
