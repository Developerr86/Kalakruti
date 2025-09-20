import { firestoreService } from './firestoreService';
import { 
  categories as mockCategories, 
  artists as mockArtists, 
  artworks as mockArtworks, 
  testimonials as mockTestimonials 
} from '../data/mockData';

export const seedFirestore = async () => {
  try {
    console.log('Starting Firestore data seeding...');

    // Seed Categories
    console.log('Seeding categories...');
    const categoryBatch = mockCategories.map(category => ({
      type: 'create',
      collectionName: 'categories',
      id: category.id,
      data: category
    }));
    await firestoreService.batchWrite(categoryBatch);
    console.log('Categories seeded successfully');

    // Seed Artists
    console.log('Seeding artists...');
    const artistBatch = mockArtists.map(artist => ({
      type: 'create',
      collectionName: 'artists',
      id: artist.id,
      data: {
        ...artist,
        followers: 0,
        verified: true,
        status: 'active'
      }
    }));
    await firestoreService.batchWrite(artistBatch);
    console.log('Artists seeded successfully');

    // Seed Artworks
    console.log('Seeding artworks...');
    const artworkBatch = mockArtworks.map(artwork => ({
      type: 'create',
      collectionName: 'artworks',
      id: artwork.id,
      data: {
        ...artwork,
        views: Math.floor(Math.random() * 1000) + 50,
        likes: Math.floor(Math.random() * 100) + 10,
        status: 'published',
        visibility: 'public'
      }
    }));
    await firestoreService.batchWrite(artworkBatch);
    console.log('Artworks seeded successfully');

    // Seed Testimonials
    console.log('Seeding testimonials...');
    const testimonialBatch = mockTestimonials.map(testimonial => ({
      type: 'create',
      collectionName: 'testimonials',
      id: testimonial.id,
      data: {
        ...testimonial,
        verified: true,
        status: 'approved'
      }
    }));
    await firestoreService.batchWrite(testimonialBatch);
    console.log('Testimonials seeded successfully');

    console.log('🎉 Firestore seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding Firestore:', error);
    throw error;
  }
};

// Individual seeding functions for incremental updates
export const seedCategories = async () => {
  try {
    const batch = mockCategories.map(category => ({
      type: 'create',
      collectionName: 'categories',
      id: category.id,
      data: category
    }));
    await firestoreService.batchWrite(batch);
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

export const seedArtists = async () => {
  try {
    const batch = mockArtists.map(artist => ({
      type: 'create',
      collectionName: 'artists',
      id: artist.id,
      data: {
        ...artist,
        followers: 0,
        verified: true,
        status: 'active'
      }
    }));
    await firestoreService.batchWrite(batch);
    console.log('Artists seeded successfully');
  } catch (error) {
    console.error('Error seeding artists:', error);
    throw error;
  }
};

export const seedArtworks = async () => {
  try {
    const batch = mockArtworks.map(artwork => ({
      type: 'create',
      collectionName: 'artworks',
      id: artwork.id,
      data: {
        ...artwork,
        views: Math.floor(Math.random() * 1000) + 50,
        likes: Math.floor(Math.random() * 100) + 10,
        status: 'published',
        visibility: 'public'
      }
    }));
    await firestoreService.batchWrite(batch);
    console.log('Artworks seeded successfully');
  } catch (error) {
    console.error('Error seeding artworks:', error);
    throw error;
  }
};

export const seedTestimonials = async () => {
  try {
    const batch = mockTestimonials.map(testimonial => ({
      type: 'create',
      collectionName: 'testimonials',
      id: testimonial.id,
      data: {
        ...testimonial,
        verified: true,
        status: 'approved'
      }
    }));
    await firestoreService.batchWrite(batch);
    console.log('Testimonials seeded successfully');
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    throw error;
  }
};

export default seedFirestore;