import { 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  and,
  or
} from 'firebase/firestore';
import { firestoreService } from './firestoreService';

export const dataService = {
  // Categories
  async getCategories() {
    try {
      return await firestoreService.getAll('categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getCategoryById(id) {
    try {
      return await firestoreService.getById('categories', id);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Artists
  async getArtists() {
    try {
      // Simplified query to avoid index requirement
      const allArtists = await firestoreService.getAll('artists');
      return allArtists.filter(artist => artist.status === 'active').sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  },

  async getArtistById(id) {
    try {
      return await firestoreService.getById('artists', id);
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  },

  async getFeaturedArtists(limitCount = 4) {
    try {
      // Simplified query to avoid index requirement
      const allArtists = await firestoreService.getAll('artists');
      return allArtists
        .filter(artist => artist.status === 'active' && artist.verified === true)
        .sort((a, b) => (b.followers || 0) - (a.followers || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching featured artists:', error);
      throw error;
    }
  },

  // Artworks
  async getArtworks() {
    try {
      // Simplified query to avoid index requirement
      const allArtworks = await firestoreService.getAll('artworks');
      return allArtworks
        .filter(artwork => artwork.status === 'published' && artwork.visibility === 'public')
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  },

  async getArtworkById(id) {
    try {
      const artwork = await firestoreService.getById('artworks', id);
      if (artwork) {
        // Increment view count
        await firestoreService.update('artworks', id, {
          views: (artwork.views || 0) + 1
        });
        return { ...artwork, views: (artwork.views || 0) + 1 };
      }
      return artwork;
    } catch (error) {
      console.error('Error fetching artwork:', error);
      throw error;
    }
  },

  async getArtworksByCategory(categoryId) {
    try {
      // Simplified query to avoid index requirement
      const allArtworks = await this.getArtworks();
      return allArtworks.filter(artwork => artwork.category === categoryId);
    } catch (error) {
      console.error('Error fetching artworks by category:', error);
      throw error;
    }
  },

  async getArtworksByArtist(artistId) {
    try {
      // Simplified query to avoid index requirement
      const allArtworks = await this.getArtworks();
      return allArtworks.filter(artwork => artwork.artist === artistId);
    } catch (error) {
      console.error('Error fetching artworks by artist:', error);
      throw error;
    }
  },

  async getFeaturedArtworks() {
    try {
      // Simplified query to avoid index requirement
      const allArtworks = await this.getArtworks();
      return allArtworks.filter(artwork => artwork.featured === true);
    } catch (error) {
      console.error('Error fetching featured artworks:', error);
      throw error;
    }
  },

  async getPopularArtworks(limitCount = 12) {
    try {
      // Simplified query to avoid index requirement
      const allArtworks = await this.getArtworks();
      return allArtworks
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching popular artworks:', error);
      throw error;
    }
  },

  async getRecentArtworks(limitCount = 12) {
    try {
      // Simplified query to avoid index requirement
      const allArtworks = await this.getArtworks();
      return allArtworks.slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching recent artworks:', error);
      throw error;
    }
  },

  // Search functionality
  async searchArtworks(searchQuery) {
    try {
      // Get all artworks first (Firestore doesn't support full-text search natively)
      const allArtworks = await this.getArtworks();
      
      // Filter by search query
      const lowercaseQuery = searchQuery.toLowerCase();
      return allArtworks.filter(artwork => 
        artwork.title.toLowerCase().includes(lowercaseQuery) ||
        artwork.description.toLowerCase().includes(lowercaseQuery) ||
        artwork.artistName.toLowerCase().includes(lowercaseQuery) ||
        (artwork.tags && artwork.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
        artwork.materials.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching artworks:', error);
      throw error;
    }
  },

  async searchArtists(searchQuery) {
    try {
      const allArtists = await this.getArtists();
      const lowercaseQuery = searchQuery.toLowerCase();
      
      return allArtists.filter(artist =>
        artist.name.toLowerCase().includes(lowercaseQuery) ||
        artist.bio.toLowerCase().includes(lowercaseQuery) ||
        artist.location.toLowerCase().includes(lowercaseQuery) ||
        (artist.specialties && artist.specialties.some(specialty => specialty.toLowerCase().includes(lowercaseQuery)))
      );
    } catch (error) {
      console.error('Error searching artists:', error);
      throw error;
    }
  },

  // Filter functionality
  async filterArtworks(filters) {
    try {
      // Get all artworks and filter client-side to avoid complex indexes
      let artworks = await this.getArtworks();

      // Add category filter
      if (filters.category && filters.category !== 'all') {
        artworks = artworks.filter(artwork => artwork.category === filters.category);
      }

      // Add artist filter
      if (filters.artist && filters.artist !== 'all') {
        artworks = artworks.filter(artwork => artwork.artist === filters.artist);
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            artworks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            break;
          case 'oldest':
            artworks.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
            break;
          case 'popular':
            artworks.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
          case 'title':
            artworks.sort((a, b) => a.title.localeCompare(b.title));
            break;
          default:
            artworks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }
      }

      // Apply price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        artworks = artworks.filter(artwork => 
          artwork.price >= min && artwork.price <= max
        );
      }

      // Apply year filter
      if (filters.yearRange) {
        const [minYear, maxYear] = filters.yearRange;
        artworks = artworks.filter(artwork => 
          artwork.yearCreated >= minYear && artwork.yearCreated <= maxYear
        );
      }

      return artworks;
    } catch (error) {
      console.error('Error filtering artworks:', error);
      throw error;
    }
  },

  // Testimonials
  async getTestimonials() {
    try {
      // Simplified query to avoid index requirement
      const allTestimonials = await firestoreService.getAll('testimonials');
      return allTestimonials
        .filter(testimonial => testimonial.status === 'approved')
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  async getFeaturedTestimonials(limitCount = 4) {
    try {
      // Simplified query to avoid index requirement
      const allTestimonials = await this.getTestimonials();
      return allTestimonials
        .filter(testimonial => testimonial.verified === true)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limitCount);
    } catch (error) {
      console.error('Error fetching featured testimonials:', error);
      throw error;
    }
  },

  // User favorites
  async getUserFavorites(userId) {
    try {
      return await firestoreService.queryCollection('favorites', [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      ]);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw error;
    }
  },

  async addToFavorites(userId, artworkId) {
    try {
      return await firestoreService.create('favorites', {
        userId,
        artworkId,
        type: 'artwork'
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFromFavorites(userId, artworkId) {
    try {
      const favorites = await firestoreService.queryCollection('favorites', [
        where('userId', '==', userId),
        where('artworkId', '==', artworkId)
      ]);

      if (favorites.length > 0) {
        return await firestoreService.delete('favorites', favorites[0].id);
      }
      return { success: true };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  // Artwork interactions
  async likeArtwork(artworkId, userId) {
    try {
      const artwork = await firestoreService.getById('artworks', artworkId);
      if (artwork) {
        await firestoreService.update('artworks', artworkId, {
          likes: (artwork.likes || 0) + 1
        });

        // Record the like action
        await firestoreService.create('likes', {
          userId,
          artworkId,
          type: 'like'
        });

        return { success: true, likes: (artwork.likes || 0) + 1 };
      }
      throw new Error('Artwork not found');
    } catch (error) {
      console.error('Error liking artwork:', error);
      throw error;
    }
  },

  // Real-time listeners (simplified to avoid index requirements)
  onArtworksChange(callback, constraints = []) {
    // Use simple collection listener and filter client-side
    return firestoreService.onCollectionChange('artworks', (artworks) => {
      const filtered = artworks
        .filter(artwork => artwork.status === 'published' && artwork.visibility === 'public')
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      callback(filtered);
    });
  },

  onArtistsChange(callback) {
    // Use simple collection listener and filter client-side
    return firestoreService.onCollectionChange('artists', (artists) => {
      const filtered = artists
        .filter(artist => artist.status === 'active')
        .sort((a, b) => a.name.localeCompare(b.name));
      callback(filtered);
    });
  },

  onCategoriesChange(callback) {
    return firestoreService.onCollectionChange('categories', callback);
  }
};

export default dataService;