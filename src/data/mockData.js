// Mock data for the Artist Marketplace

export const categories = [
  {
    id: 'paintings',
    name: 'Paintings',
    description: 'Beautiful handcrafted paintings in various styles',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
  },
  {
    id: 'pottery',
    name: 'Pottery',
    description: 'Handmade ceramics and pottery pieces',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  {
    id: 'sculptures',
    name: 'Sculptures',
    description: 'Three-dimensional art pieces and sculptures',
    image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400&h=300&fit=crop'
  },
  {
    id: 'handicrafts',
    name: 'Handicrafts',
    description: 'Traditional handicrafts and artisanal items',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop'
  }
];

export const artists = [
  {
    id: 'artist1',
    name: 'Elena Rodriguez',
    bio: 'Elena is a contemporary painter who draws inspiration from nature and traditional folklore. With over 15 years of experience, she specializes in oil paintings that capture the essence of rural landscapes and cultural heritage.',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=300&h=300&fit=crop',
    location: 'Santa Fe, New Mexico',
    specialties: ['paintings'],
    established: 2008,
    awards: ['Best Contemporary Artist 2020', 'Regional Arts Council Grant 2019'],
    contact: {
      email: 'elena@example.com',
      phone: '+1 (555) 123-4567',
      website: 'www.elenarodriguez.art'
    }
  },
  {
    id: 'artist2',
    name: 'Marcus Chen',
    bio: 'Marcus is a master potter who combines traditional Asian techniques with modern design sensibilities. His work is characterized by clean lines, earthy textures, and functional beauty.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    location: 'Portland, Oregon',
    specialties: ['pottery'],
    established: 2012,
    awards: ['Ceramics Monthly Featured Artist 2021', 'Pacific Northwest Pottery Award 2020'],
    contact: {
      email: 'marcus@example.com',
      phone: '+1 (555) 234-5678',
      website: 'www.marcuschen.ceramics'
    }
  },
  {
    id: 'artist3',
    name: 'Sarah Williams',
    bio: 'Sarah creates stunning sculptures that explore the relationship between form and space. Working primarily in bronze and stone, her pieces evoke emotion and contemplation.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    location: 'Asheville, North Carolina',
    specialties: ['sculptures'],
    established: 2010,
    awards: ['International Sculpture Award 2021', 'Emerging Artist Fellowship 2018'],
    contact: {
      email: 'sarah@example.com',
      phone: '+1 (555) 345-6789',
      website: 'www.sarahwilliams.sculptures'
    }
  },
  {
    id: 'artist4',
    name: 'David Thompson',
    bio: 'David is a traditional craftsman who specializes in woodworking and leather goods. His handcrafted items blend functionality with artistic beauty, honoring time-tested techniques.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    location: 'Vermont',
    specialties: ['handicrafts'],
    established: 2005,
    awards: ['Master Craftsman Certification 2019', 'Traditional Arts Guild Recognition 2020'],
    contact: {
      email: 'david@example.com',
      phone: '+1 (555) 456-7890',
      website: 'www.davidthompson.crafts'
    }
  }
];

export const artworks = [
  // Paintings by Elena Rodriguez
  {
    id: 'artwork1',
    title: 'Sunset Over the Mesa',
    artist: 'artist1',
    artistName: 'Elena Rodriguez',
    category: 'paintings',
    price: 1200,
    description: 'A breathtaking oil painting capturing the golden hour over the New Mexican landscape. Rich warm colors and traditional techniques bring this scene to life.',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=400&fit=crop',
    dimensions: '24" x 36"',
    materials: 'Oil on canvas',
    yearCreated: 2023,
    inStock: true,
    featured: true,
    tags: ['landscape', 'oil painting', 'southwestern', 'sunset']
  },
  {
    id: 'artwork2',
    title: 'Desert Bloom',
    artist: 'artist1',
    artistName: 'Elena Rodriguez',
    category: 'paintings',
    price: 950,
    description: 'Vibrant cacti flowers painted in the traditional southwestern style. This piece celebrates the beauty of desert flora.',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=400&fit=crop',
    dimensions: '18" x 24"',
    materials: 'Oil on canvas',
    yearCreated: 2023,
    inStock: true,
    featured: false,
    tags: ['botanical', 'desert', 'flowers', 'colorful']
  },
  {
    id: 'artwork3',
    title: 'Mountain Village',
    artist: 'artist1',
    artistName: 'Elena Rodriguez',
    category: 'paintings',
    price: 1450,
    description: 'A detailed painting of a traditional mountain village, showcasing architectural heritage and cultural storytelling.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop',
    dimensions: '30" x 40"',
    materials: 'Oil on canvas',
    yearCreated: 2022,
    inStock: true,
    featured: false,
    tags: ['village', 'architecture', 'cultural', 'heritage']
  },
  
  // Pottery by Marcus Chen
  {
    id: 'artwork4',
    title: 'Zen Tea Set',
    artist: 'artist2',
    artistName: 'Marcus Chen',
    category: 'pottery',
    price: 285,
    description: 'A complete tea set featuring minimalist design and earthy glazes. Perfect for meditation and mindful tea ceremonies.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
    dimensions: 'Teapot: 8" x 6", Cups: 3" x 3"',
    materials: 'Stoneware with matte glaze',
    yearCreated: 2023,
    inStock: true,
    featured: true,
    tags: ['tea set', 'functional', 'zen', 'minimalist']
  },
  {
    id: 'artwork5',
    title: 'Rustic Dining Bowl Set',
    artist: 'artist2',
    artistName: 'Marcus Chen',
    category: 'pottery',
    price: 180,
    description: 'Hand-thrown bowls with a rustic finish, perfect for everyday dining. Each piece is unique with subtle variations.',
    image: 'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=500&h=400&fit=crop',
    dimensions: '8" diameter x 3" height (set of 4)',
    materials: 'Earthenware with natural glaze',
    yearCreated: 2023,
    inStock: true,
    featured: false,
    tags: ['bowls', 'dining', 'rustic', 'functional']
  },
  {
    id: 'artwork6',
    title: 'Decorative Vase Collection',
    artist: 'artist2',
    artistName: 'Marcus Chen',
    category: 'pottery',
    price: 125,
    description: 'A trio of decorative vases with organic shapes and earth-tone glazes. Beautiful for displaying fresh or dried flowers.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&h=400&fit=crop',
    dimensions: 'Various sizes: 6"-12" height',
    materials: 'Porcelain with celadon glaze',
    yearCreated: 2023,
    inStock: true,
    featured: false,
    tags: ['vases', 'decorative', 'organic', 'flowers']
  },
  
  // Sculptures by Sarah Williams
  {
    id: 'artwork7',
    title: 'Flowing Waters',
    artist: 'artist3',
    artistName: 'Sarah Williams',
    category: 'sculptures',
    price: 2800,
    description: 'An abstract bronze sculpture that captures the movement and energy of flowing water. A centerpiece for any space.',
    image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=500&h=400&fit=crop',
    dimensions: '18" x 12" x 24"',
    materials: 'Bronze with patina finish',
    yearCreated: 2023,
    inStock: true,
    featured: true,
    tags: ['abstract', 'bronze', 'water', 'movement']
  },
  {
    id: 'artwork8',
    title: 'Standing Stone',
    artist: 'artist3',
    artistName: 'Sarah Williams',
    category: 'sculptures',
    price: 3200,
    description: 'A monolithic marble sculpture that explores balance and form. Inspired by ancient standing stones and their timeless presence.',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=400&fit=crop',
    dimensions: '36" x 8" x 8"',
    materials: 'Carrara marble',
    yearCreated: 2022,
    inStock: true,
    featured: false,
    tags: ['marble', 'monolithic', 'balance', 'ancient']
  },
  
  // Handicrafts by David Thompson
  {
    id: 'artwork9',
    title: 'Handcrafted Leather Journal',
    artist: 'artist4',
    artistName: 'David Thompson',
    category: 'handicrafts',
    price: 85,
    description: 'A beautiful leather-bound journal with hand-stitched binding. Perfect for writing, sketching, or journaling.',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500&h=400&fit=crop',
    dimensions: '8" x 10" x 1"',
    materials: 'Full-grain leather, handmade paper',
    yearCreated: 2023,
    inStock: true,
    featured: false,
    tags: ['journal', 'leather', 'handmade', 'writing']
  },
  {
    id: 'artwork10',
    title: 'Wooden Serving Tray',
    artist: 'artist4',
    artistName: 'David Thompson',
    category: 'handicrafts',
    price: 95,
    description: 'Beautifully crafted serving tray made from reclaimed walnut wood. Features hand-carved handles and food-safe finish.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop',
    dimensions: '18" x 12" x 2"',
    materials: 'Reclaimed walnut wood, beeswax finish',
    yearCreated: 2023,
    inStock: true,
    featured: true,
    tags: ['wooden', 'serving', 'reclaimed', 'functional']
  },
  {
    id: 'artwork11',
    title: 'Woven Basket Set',
    artist: 'artist4',
    artistName: 'David Thompson',
    category: 'handicrafts',
    price: 145,
    description: 'Traditional hand-woven baskets using natural materials. Perfect for storage or decoration. Set of three different sizes.',
    image: 'https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=500&h=400&fit=crop',
    dimensions: 'Small: 8"x6", Medium: 10"x8", Large: 12"x10"',
    materials: 'Natural reed and willow',
    yearCreated: 2023,
    inStock: true,
    featured: false,
    tags: ['baskets', 'woven', 'natural', 'storage']
  },
  
  // Additional featured pieces
  {
    id: 'artwork12',
    title: 'Abstract Expression',
    artist: 'artist1',
    artistName: 'Elena Rodriguez',
    category: 'paintings',
    price: 1750,
    description: 'A bold abstract painting exploring color relationships and emotional expression through gestural brushwork.',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500&h=400&fit=crop',
    dimensions: '36" x 48"',
    materials: 'Acrylic on canvas',
    yearCreated: 2023,
    inStock: true,
    featured: false,
    tags: ['abstract', 'bold', 'expression', 'contemporary']
  }
];

export const testimonials = [
  {
    id: 'testimonial1',
    name: 'Jennifer Martinez',
    location: 'Austin, Texas',
    text: 'I purchased a beautiful pottery set from Marcus and couldn\'t be happier. The quality is exceptional and it adds such warmth to my dining room.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=100&h=100&fit=crop',
    purchase: 'Zen Tea Set'
  },
  {
    id: 'testimonial2',
    name: 'Robert Johnson',
    location: 'Seattle, Washington',
    text: 'Elena\'s landscape painting is absolutely stunning. The colors and technique are masterful. It\'s the centerpiece of our living room.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    purchase: 'Sunset Over the Mesa'
  },
  {
    id: 'testimonial3',
    name: 'Lisa Chen',
    location: 'San Francisco, California',
    text: 'The wooden serving tray from David is beautifully crafted. You can see the attention to detail and quality in every piece.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    purchase: 'Wooden Serving Tray'
  },
  {
    id: 'testimonial4',
    name: 'Michael Brown',
    location: 'Denver, Colorado',
    text: 'Sarah\'s sculpture adds such elegance to our garden. The bronze work is exceptional and it looks beautiful in all seasons.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    purchase: 'Flowing Waters'
  }
];

export const featuredArtist = {
  id: 'artist1',
  name: 'Elena Rodriguez',
  title: 'Contemporary Landscape Painter',
  description: 'Elena brings the stunning landscapes of the American Southwest to life through her masterful oil paintings. Her work captures the raw beauty and cultural richness of the region.',
  image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
  profileImage: 'https://images.unsplash.com/photo-1494790108755-2616c9044cb2?w=400&h=400&fit=crop',
  featured_artwork: 'artwork1'
};

// Helper functions
export const getArtworksByCategory = (categoryId) => {
  return artworks.filter(artwork => artwork.category === categoryId);
};

export const getArtworksByArtist = (artistId) => {
  return artworks.filter(artwork => artwork.artist === artistId);
};

export const getFeaturedArtworks = () => {
  return artworks.filter(artwork => artwork.featured);
};

export const getArtworkById = (id) => {
  return artworks.find(artwork => artwork.id === id);
};

export const getArtistById = (id) => {
  return artists.find(artist => artist.id === id);
};

export const searchArtworks = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return artworks.filter(artwork => 
    artwork.title.toLowerCase().includes(lowercaseQuery) ||
    artwork.description.toLowerCase().includes(lowercaseQuery) ||
    artwork.artistName.toLowerCase().includes(lowercaseQuery) ||
    artwork.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const filterArtworks = (filters) => {
  let filtered = [...artworks];
  
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(artwork => artwork.category === filters.category);
  }
  
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(artwork => artwork.price >= min && artwork.price <= max);
  }
  
  if (filters.artist && filters.artist !== 'all') {
    filtered = filtered.filter(artwork => artwork.artist === filters.artist);
  }
  
  return filtered;
};