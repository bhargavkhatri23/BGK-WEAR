import { Product, WeddingStory, AppNotification, UserProfile } from '../types';

export const CITIES_LIST = [
  'All Cities',
  'Mumbai',
  'Delhi NCR',
  'Jaipur',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Kolkata',
  'Chandigarh',
  'Pune',
  'Surat',
  'Udaipur',
  'Lucknow'
];

export const CATEGORIES_DATA = [
  {
    name: 'Bridal Lehenga',
    count: 48,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy Zardozi, Velvet & Raw Silk Masterpieces for Brides'
  },
  {
    name: 'Groom Sherwani',
    count: 36,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Royal Silk, Chikankari & Brocade Ensembles'
  },
  {
    name: 'Saree',
    count: 62,
    image: 'https://images.unsplash.com/photo-1610030469668-9655ecdd3e14?auto=format&fit=crop&w=800&q=80',
    description: 'Pure Banarasi, Kanjeevaram, Organza & Chiffon'
  },
  {
    name: 'Gown',
    count: 29,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    description: 'Cocktail, Sangeet & Reception Flared Gowns'
  },
  {
    name: 'Indo Western',
    count: 41,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    description: 'Modern silhouettes, Jacket sets & Jodhpuri suits'
  },
  {
    name: 'Kids Wedding Wear',
    count: 24,
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80',
    description: 'Mini Lehengas, Kurta Pajamas & Prince Coat Sets'
  },
  {
    name: 'Jewelry',
    count: 55,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Kundan, Polki, Temple Gold & Jadau Bridal Sets'
  },
  {
    name: 'Accessories',
    count: 38,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    description: 'Potlis, Dupattas, Safas, Kalgi, Belts & Brooches'
  },
  {
    name: 'Shoes',
    count: 22,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted Zari Mojaris, Juttis & Embellished Heels'
  },
  {
    name: 'Designer Wear',
    count: 31,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    description: 'Couture collections from celebrated fashion houses'
  }
];

export const BRANDS_LIST = [
  'Sabyasachi Heritage',
  'Manish Malhotra Couture',
  'Tarun Tahiliani',
  'Anita Dongre',
  'Raw Mango',
  'Manyavar & Mohey',
  'Abhinav Mishra',
  'Ritu Kumar',
  'Seema Gujral',
  'BGK Signature'
];

export const FABRICS_LIST = [
  'Raw Silk & Zari',
  'Micro Velvet',
  'Pure Banarasi Silk',
  'Organza & Tissue',
  'Chiffon & Georgette',
  'Chikankari Cotton Silk',
  'Net & Tulle',
  'Brocade',
  'Kanjeevaram Silk'
];

export const COLORS_LIST = [
  { name: 'Royal Crimson Red', hex: '#800020' },
  { name: 'Emerald Green', hex: '#124E3F' },
  { name: 'Mustard Haldi Gold', hex: '#D4AF37' },
  { name: 'Dusty Rose Pink', hex: '#D88A8A' },
  { name: 'Ivory & Champagne', hex: '#EAE6DF' },
  { name: 'Royal Sapphire Blue', hex: '#1A365D' },
  { name: 'Midnight Black', hex: '#1A1A1A' },
  { name: 'Lavender & Lilac', hex: '#B39DDB' }
];

export const POPULAR_SEARCHES = [
  'Sabyasachi Bridal Lehenga',
  'Manish Malhotra Sequins',
  'Royal Sherwani for Groom',
  'Banarasi Pure Silk Saree',
  'Reception Flared Gown',
  'Tarun Tahiliani Draped Saree',
  'Haldi Yellow Outfit',
  'Cocktail Indo Western'
];

export const FEATURED_DESIGNER_HOUSES = [
  {
    id: 'des-1',
    name: 'Sabyasachi Heritage Atelier',
    designer: 'Sabyasachi Mukherjee',
    location: 'Kolkata & Mumbai',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tagline: 'Handcrafted bridal couture, heritage zardozi & vintage royal ensembles',
    totalOutfits: 14,
    rating: 4.98,
    verified: true
  },
  {
    id: 'des-2',
    name: 'Manish Malhotra Couture Lounge',
    designer: 'Manish Malhotra',
    location: 'Mumbai & Delhi NCR',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    tagline: 'Contemporary glamour, sequined cocktail lehengas & modern reception gowns',
    totalOutfits: 11,
    rating: 4.95,
    verified: true
  },
  {
    id: 'des-3',
    name: 'Tarun Tahiliani Atelier',
    designer: 'Tarun Tahiliani',
    location: 'Delhi NCR',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    tagline: 'Sculpted drapes, delicate chikankari, and regal groom sherwanis',
    totalOutfits: 9,
    rating: 4.92,
    verified: true
  },
  {
    id: 'des-4',
    name: 'Anita Dongre Sustainable Closet',
    designer: 'Anita Dongre',
    location: 'Jaipur & Mumbai',
    image: 'https://images.unsplash.com/photo-1610030469668-9655ecdd3e14?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    tagline: 'Rajasthani Gota Patti, handwoven organic silks & timeless pastels',
    totalOutfits: 12,
    rating: 4.96,
    verified: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Crimson Velvet Heritage Bridal Lehenga with Double Dupatta',
    description: 'Exquisite hand-embroidered deep crimson micro-velvet bridal lehenga adorned with antique gold zardozi, dabka, and micro-pearls. Comes with a matching embellished velvet blouse, sheer organza veil dupatta with scalloped borders, and custom Latkans.',
    category: 'Bridal Lehenga',
    brand: 'Sabyasachi Heritage',
    size: 'M',
    color: 'Royal Crimson Red',
    colorHex: '#800020',
    condition: 'Like New (Worn Once)',
    listingType: 'both',
    rentPricePerDay: 5499,
    salePrice: 125000,
    securityDeposit: 10000,
    originalRetailPrice: 385000,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1594897030560-69c1cf6ddc58?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    trending: true,
    newArrival: false,
    city: 'Delhi NCR',
    state: 'Delhi',
    seller: {
      id: 'sel-1',
      name: 'Avantika Couture Closet',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      city: 'Delhi NCR',
      state: 'Delhi',
      bio: 'Curator of luxury authenticated bridal couture. Sanitized & dry-cleaned after every use.',
      phone: '+91 98112 34567',
      whatsapp: '+919811234567',
      isVerified: true,
      rating: 4.9,
      totalReviews: 48,
      totalListings: 14,
      joinedYear: '2022',
      responseTime: 'Under 15 mins'
    },
    rating: 4.95,
    reviewsCount: 18,
    reviews: [
      {
        id: 'rev-1',
        userName: 'Rhea Kapoor',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        userCity: 'Mumbai',
        rating: 5,
        date: '14 Oct 2024',
        comment: 'Felt like royalty on my wedding day! The embroidery is breathtaking and the security deposit was refunded on the same day after return.',
        fitFeedback: 'True to Size',
        occasion: 'Wedding Day',
        likes: 12
      },
      {
        id: 'rev-2',
        userName: 'Simran Duggal',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        userCity: 'Chandigarh',
        rating: 5,
        date: '02 Sep 2024',
        comment: 'Smooth pickup from seller and the blouse had 3 inches alteration allowance. Highly recommend renting instead of spending lakhs!',
        fitFeedback: 'True to Size',
        occasion: 'Grand Reception',
        likes: 8
      }
    ],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Micro Velvet & Organza Silk',
    occasion: ['Wedding Day', 'Reception'],
    measurements: {
      bust: '36-38 in',
      waist: '30-32 in',
      length: '43 in',
      alterationMargin: '3 inches allowance'
    },
    viewsCount: 1420,
    likesCount: 238,
    createdAt: '2024-11-10'
  },
  {
    id: 'prod-2',
    title: 'Ivory & Antique Gold Raw Silk Groom Sherwani with Stole',
    description: 'Hand-tailored ivory raw silk groom sherwani with subtle self-tone resham work, French bullion knots, and imperial metal buttons. Includes churidar pants, handloom brocade safa, and zari dupatta stole.',
    category: 'Groom Sherwani',
    brand: 'Manyavar & Mohey',
    size: 'L',
    color: 'Ivory Gold',
    colorHex: '#FFFFF0',
    condition: 'Like New (Worn Once)',
    listingType: 'both',
    rentPricePerDay: 3200,
    salePrice: 42000,
    securityDeposit: 6000,
    originalRetailPrice: 85000,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    trending: true,
    newArrival: true,
    city: 'Mumbai',
    state: 'Maharashtra',
    seller: {
      id: 'sel-2',
      name: 'Royal Heritage Men',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      city: 'Mumbai',
      state: 'Maharashtra',
      bio: 'Bespoke grooms wear & accessories. Pre-altered fits and sanitized garments.',
      phone: '+91 98200 88991',
      whatsapp: '+919820088991',
      isVerified: true,
      rating: 4.8,
      totalReviews: 32,
      totalListings: 19,
      joinedYear: '2023',
      responseTime: 'Under 30 mins'
    },
    rating: 4.88,
    reviewsCount: 14,
    reviews: [
      {
        id: 'rev-3',
        userName: 'Vikramaditya Rao',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        userCity: 'Hyderabad',
        rating: 5,
        date: '28 Nov 2024',
        comment: 'Received compliments throughout the Baraat. Pristine condition with no scent or stains.',
        fitFeedback: 'True to Size',
        occasion: 'Baraat & Wedding',
        likes: 6
      }
    ],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Raw Banarasi Silk',
    occasion: ['Wedding Day', 'Baraat', 'Sangeet'],
    measurements: {
      bust: '40-42 in (Chest)',
      waist: '34-36 in',
      length: '44 in',
      shoulder: '18 in',
      alterationMargin: '2 inches'
    },
    viewsCount: 980,
    likesCount: 165,
    createdAt: '2024-11-20'
  },
  {
    id: 'prod-3',
    title: 'Emerald Green Kanjeevaram Pure Silk Saree with Gold Korvai Border',
    description: 'Authentic pure mulberry silk Kanjeevaram saree in royal emerald green featuring heavy pure zari Korvai woven temple borders and an opulent floral peacock pallu. Paired with unstitched matching pure silk blouse piece.',
    category: 'Saree',
    brand: 'Raw Mango',
    size: 'Free Size',
    color: 'Emerald Gold',
    colorHex: '#046307',
    condition: 'Brand New',
    listingType: 'both',
    rentPricePerDay: 2499,
    salePrice: 38000,
    securityDeposit: 5000,
    originalRetailPrice: 72000,
    images: [
      'https://images.unsplash.com/photo-1610030469668-9655ecdd3e14?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    trending: false,
    newArrival: true,
    city: 'Bangalore',
    state: 'Karnataka',
    seller: {
      id: 'sel-3',
      name: 'Vaidyanathan Silk Studio',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      city: 'Bangalore',
      state: 'Karnataka',
      bio: 'Silk Mark certified heritage weaves directly from weavers of Kanchipuram and Varanasi.',
      phone: '+91 97400 12345',
      whatsapp: '+919740012345',
      isVerified: true,
      rating: 5.0,
      totalReviews: 64,
      totalListings: 28,
      joinedYear: '2021',
      responseTime: 'Under 10 mins'
    },
    rating: 4.96,
    reviewsCount: 22,
    reviews: [
      {
        id: 'rev-4',
        userName: 'Meera Nambiar',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        userCity: 'Chennai',
        rating: 5,
        date: '10 Dec 2024',
        comment: 'Pure zari weight and drape is simply top tier. Rented for my brother’s engagement.',
        fitFeedback: 'True to Size',
        occasion: 'Engagement Ceremony',
        likes: 15
      }
    ],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Pure Mulberry Kanchipuram Silk',
    occasion: ['Reception', 'Engagement', 'Puja'],
    measurements: {
      length: '6.3 Meters with Blouse'
    },
    viewsCount: 1890,
    likesCount: 340,
    createdAt: '2024-11-25'
  },
  {
    id: 'prod-4',
    title: 'Champagne Sequin Mermaid Trail Reception Gown',
    description: 'Showstopper champagne gold evening gown drenched in micro geometric sequins, crystal beads, and a detachable flowing cathedral tulle cape. Built-in corset boning with comfortable stretch lining.',
    category: 'Gown',
    brand: 'Manish Malhotra Couture',
    size: 'S',
    color: 'Champagne Gold',
    colorHex: '#F7E7CE',
    condition: 'Like New (Worn Once)',
    listingType: 'rent',
    rentPricePerDay: 4800,
    securityDeposit: 8000,
    originalRetailPrice: 220000,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    trending: true,
    newArrival: false,
    city: 'Mumbai',
    state: 'Maharashtra',
    seller: {
      id: 'sel-1',
      name: 'Avantika Couture Closet',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      city: 'Delhi NCR',
      state: 'Delhi',
      bio: 'Curator of luxury authenticated bridal couture. Sanitized & dry-cleaned after every use.',
      phone: '+91 98112 34567',
      whatsapp: '+919811234567',
      isVerified: true,
      rating: 4.9,
      totalReviews: 48,
      totalListings: 14,
      joinedYear: '2022',
      responseTime: 'Under 15 mins'
    },
    rating: 4.9,
    reviewsCount: 11,
    reviews: [],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Tulle & Micro Sequin Georgette',
    occasion: ['Reception', 'Cocktail Night', 'Sangeet'],
    measurements: {
      bust: '34 in',
      waist: '27-28 in',
      hip: '36-37 in',
      length: '58 in'
    },
    viewsCount: 1150,
    likesCount: 290,
    createdAt: '2024-11-15'
  },
  {
    id: 'prod-5',
    title: 'Midnight Blue Asymmetric Indo-Western Tuxedo Bandhgala',
    description: 'Contemporary midnight blue structured Indo-Western set with metallic gunmetal embroidery on the lapel, paired with tapered charcoal trousers and a matching pocket square.',
    category: 'Indo Western',
    brand: 'Tarun Tahiliani',
    size: 'M',
    color: 'Midnight Navy',
    colorHex: '#191970',
    condition: 'Brand New',
    listingType: 'both',
    rentPricePerDay: 2800,
    salePrice: 34000,
    securityDeposit: 5000,
    originalRetailPrice: 68000,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    trending: true,
    newArrival: true,
    city: 'Jaipur',
    state: 'Rajasthan',
    seller: {
      id: 'sel-4',
      name: 'Jaipur Regalia Menswear',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      city: 'Jaipur',
      state: 'Rajasthan',
      bio: 'Authentic royal Rajasthani sherwanis, bandhgalas and safas for destination weddings.',
      phone: '+91 94140 55667',
      whatsapp: '+919414055667',
      isVerified: true,
      rating: 4.85,
      totalReviews: 29,
      totalListings: 12,
      joinedYear: '2023',
      responseTime: 'Under 1 hour'
    },
    rating: 4.82,
    reviewsCount: 9,
    reviews: [],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Italian Wool Blend & Silk',
    occasion: ['Sangeet Night', 'Cocktail', 'Mehendi'],
    measurements: {
      bust: '38-40 in (Chest)',
      waist: '32 in',
      length: '32 in'
    },
    viewsCount: 750,
    likesCount: 110,
    createdAt: '2024-11-28'
  },
  {
    id: 'prod-6',
    title: 'Heritage 22K Gold Polki & Emerald Bridal Choker Set with Maang Tikka',
    description: 'Museum-grade handcrafted Polki Jadau choker necklace set with natural Colombian emerald drops, matching chandelier earrings, Mathapatti, and Haathphool. Hallmarked with micro-meenakari reverse detailing.',
    category: 'Jewelry',
    brand: 'BGK Signature',
    size: 'Free Size',
    color: 'Royal Gold & Emerald',
    colorHex: '#D4AF37',
    condition: 'Brand New',
    listingType: 'both',
    rentPricePerDay: 3500,
    salePrice: 65000,
    securityDeposit: 8000,
    originalRetailPrice: 160000,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    trending: true,
    newArrival: false,
    city: 'Jaipur',
    state: 'Rajasthan',
    seller: {
      id: 'sel-5',
      name: 'Johari Royal Jewels',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      city: 'Jaipur',
      state: 'Rajasthan',
      bio: 'Centuries-old legacy jeweler providing insured wedding jewelry rentals and custom creations.',
      phone: '+91 94141 99887',
      whatsapp: '+919414199887',
      isVerified: true,
      rating: 4.98,
      totalReviews: 86,
      totalListings: 42,
      joinedYear: '2020',
      responseTime: 'Under 10 mins'
    },
    rating: 4.97,
    reviewsCount: 31,
    reviews: [],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Gold Plated Silver & Uncut Polki Jadau',
    occasion: ['Wedding Day', 'Sangeet', 'Engagement'],
    measurements: {
      length: 'Adjustable Dori Choker'
    },
    viewsCount: 2200,
    likesCount: 520,
    createdAt: '2024-11-05'
  },
  {
    id: 'prod-7',
    title: 'Floral Pastel Pink Mirror-Work Lehengas for Little Princess',
    description: 'Comfortable cotton-silk lightweight floral lehenga with soft can-can, mirror work choli, and net dupatta. Non-itchy cotton inner lining for effortless twirling.',
    category: 'Kids Wedding Wear',
    brand: 'Abhinav Mishra',
    size: 'Custom Fit',
    color: 'Blush Pink',
    colorHex: '#FFB6C1',
    condition: 'Brand New',
    listingType: 'both',
    rentPricePerDay: 1499,
    salePrice: 14500,
    securityDeposit: 2500,
    originalRetailPrice: 32000,
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    trending: false,
    newArrival: true,
    city: 'Ahmedabad',
    state: 'Gujarat',
    seller: {
      id: 'sel-6',
      name: 'Tiny Royals Boutique',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      city: 'Ahmedabad',
      state: 'Gujarat',
      bio: 'Luxury occasion wear for kids aged 2 to 14. Skin friendly, comfortable pure fabrics.',
      phone: '+91 98250 44556',
      whatsapp: '+919825044556',
      isVerified: true,
      rating: 4.89,
      totalReviews: 24,
      totalListings: 18,
      joinedYear: '2023',
      responseTime: 'Under 20 mins'
    },
    rating: 4.88,
    reviewsCount: 7,
    reviews: [],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Pure Silk & Soft Cotton Lining',
    occasion: ['Haldi', 'Mehendi', 'Sangeet'],
    measurements: {
      bust: '24-26 in',
      waist: '22 in',
      length: '30 in (Age 6-8 Yrs)'
    },
    viewsCount: 620,
    likesCount: 95,
    createdAt: '2024-11-29'
  },
  {
    id: 'prod-8',
    title: 'Handcrafted Zardozi Embroidered Royal Juttis & Mojaris',
    description: 'Pure double-cushioned genuine leather mojaris featuring gold dabka and zardozi thread embroidery. Extremely comfortable for 12+ hours wedding standing and dancing.',
    category: 'Shoes',
    brand: 'BGK Signature',
    size: 'XL',
    color: 'Burnished Gold',
    colorHex: '#DAA520',
    condition: 'Brand New',
    listingType: 'both',
    rentPricePerDay: 899,
    salePrice: 6500,
    securityDeposit: 1500,
    originalRetailPrice: 14000,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    trending: true,
    newArrival: false,
    city: 'Delhi NCR',
    state: 'Delhi',
    seller: {
      id: 'sel-2',
      name: 'Royal Heritage Men',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      city: 'Mumbai',
      state: 'Maharashtra',
      bio: 'Bespoke grooms wear & accessories. Pre-altered fits and sanitized garments.',
      phone: '+91 98200 88991',
      whatsapp: '+919820088991',
      isVerified: true,
      rating: 4.8,
      totalReviews: 32,
      totalListings: 19,
      joinedYear: '2023',
      responseTime: 'Under 30 mins'
    },
    rating: 4.75,
    reviewsCount: 12,
    reviews: [],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Genuine Leather & Pure Zari',
    occasion: ['Wedding Day', 'Baraat', 'Reception'],
    measurements: {
      length: 'UK/India Size 9-10'
    },
    viewsCount: 480,
    likesCount: 82,
    createdAt: '2024-11-18'
  },
  {
    id: 'prod-9',
    title: 'Raw Silk Marigold Yellow Mehendi Lehenga with Gota Patti',
    description: 'Vibrant marigold yellow lehenga crafted in pure raw silk with lustrous gota patti border, geometric foil mirrors, and a lightweight contrast teal dupatta.',
    category: 'Bridal Lehenga',
    brand: 'Anita Dongre',
    size: 'S',
    color: 'Marigold Yellow',
    colorHex: '#FFC000',
    condition: 'Like New (Worn Once)',
    listingType: 'both',
    rentPricePerDay: 3800,
    salePrice: 75000,
    securityDeposit: 6000,
    originalRetailPrice: 195000,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true,
    trending: true,
    newArrival: true,
    city: 'Hyderabad',
    state: 'Telangana',
    seller: {
      id: 'sel-1',
      name: 'Avantika Couture Closet',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      city: 'Delhi NCR',
      state: 'Delhi',
      bio: 'Curator of luxury authenticated bridal couture. Sanitized & dry-cleaned after every use.',
      phone: '+91 98112 34567',
      whatsapp: '+919811234567',
      isVerified: true,
      rating: 4.9,
      totalReviews: 48,
      totalListings: 14,
      joinedYear: '2022',
      responseTime: 'Under 15 mins'
    },
    rating: 4.92,
    reviewsCount: 16,
    reviews: [],
    availableFrom: '2025-01-01',
    availableTo: '2026-12-31',
    status: 'active',
    fabric: 'Pure Raw Silk & Chanderi',
    occasion: ['Haldi', 'Mehendi', 'Sangeet'],
    measurements: {
      bust: '34-36 in',
      waist: '28-30 in',
      length: '42 in'
    },
    viewsCount: 1630,
    likesCount: 310,
    createdAt: '2024-11-22'
  }
];

export const INITIAL_STORIES: WeddingStory[] = [
  {
    id: 'story-1',
    title: 'Royal Udaipur Bride',
    author: 'Avantika Couture',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    tag: 'Bridal Inspiration',
    itemsCount: 6,
    featuredProductIds: ['prod-1', 'prod-6']
  },
  {
    id: 'story-2',
    title: 'Bespoke Groom Looks',
    author: 'Royal Heritage',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    tag: 'Groom Sherwanis',
    itemsCount: 4,
    featuredProductIds: ['prod-2', 'prod-8']
  },
  {
    id: 'story-3',
    title: 'Heritage Kanjeevarams',
    author: 'Vaidyanathan Silk',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1610030469668-9655ecdd3e14?auto=format&fit=crop&w=600&q=80',
    tag: 'Pure Zari Sarees',
    itemsCount: 8,
    featuredProductIds: ['prod-3']
  },
  {
    id: 'story-4',
    title: 'Cocktail Trails',
    author: 'Manish Malhotra Closet',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    tag: 'Evening Glam',
    itemsCount: 5,
    featuredProductIds: ['prod-4']
  },
  {
    id: 'story-5',
    title: 'Polki & Jadau Sets',
    author: 'Johari Jewels',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    tag: 'Royal Jewelry',
    itemsCount: 7,
    featuredProductIds: ['prod-6']
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'Bhargav Khatri',
  email: 'bhargavkhatri2302@gmail.com',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  city: 'Mumbai',
  state: 'Maharashtra',
  bio: 'Wedding fashion lover & stylist. Renting and curating luxury traditional couture across India.',
  role: 'seller', // Can switch to 'buyer' or 'admin'
  isVerified: true,
  joinedDate: 'Joined March 2024',
  balanceEarnings: 38400
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'rental_request',
    title: 'New Rental Request Received! 🎉',
    description: 'Kavita Mehta wants to rent "Crimson Velvet Heritage Bridal Lehenga" for 3 days (Dec 18 - Dec 21, 2025). Total Earnings: ₹16,497.',
    timestamp: '10 mins ago',
    read: false,
    relatedProductId: 'prod-1',
    actionRequired: true,
    actionState: 'pending',
    senderName: 'Kavita Mehta',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'notif-2',
    type: 'approval',
    title: 'Listing Approved & Live! ✨',
    description: 'Your listing "Heritage 22K Gold Polki & Emerald Bridal Choker Set" has been verified and published to the BGK WEAR catalog.',
    timestamp: '2 hours ago',
    read: false,
    relatedProductId: 'prod-6'
  },
  {
    id: 'notif-3',
    type: 'offer',
    title: 'Special Price Drop Alert! 🏷️',
    description: 'An item in your wishlist "Ivory & Antique Gold Raw Silk Groom Sherwani" is now available for ₹3,200/day (was ₹4,500).',
    timestamp: '1 day ago',
    read: true,
    relatedProductId: 'prod-2'
  },
  {
    id: 'notif-4',
    type: 'message',
    title: 'WhatsApp Inquiry Received',
    description: 'A buyer from Delhi initiated a WhatsApp chat regarding alteration margin for the Marigold Yellow Lehenga.',
    timestamp: '2 days ago',
    read: true
  }
];
