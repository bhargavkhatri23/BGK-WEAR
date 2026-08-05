import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Product, 
  UserProfile, 
  RentalBooking, 
  PurchaseOrder, 
  AppNotification, 
  FilterState, 
  WeddingStory, 
  Review,
  Seller,
  ChatMessage,
  ChatConversation,
  ChatOfferData
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_USER, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_STORIES 
} from '../data/mockData';
import { 
  subscribeToProducts, 
  createProductDoc, 
  updateProductDoc, 
  deleteProductDoc, 
  seedInitialProductsIfEmpty,
  incrementProductStat,
  saveUserProfileDoc,
  subscribeToUserProfile,
  subscribeToUserWishlist,
  addToWishlistDoc,
  removeFromWishlistDoc,
  createRentalBookingDoc,
  subscribeToUserRentals,
  createPurchaseOrderDoc,
  addReviewDoc,
  createNotificationDoc,
  subscribeToUserNotifications,
  updateNotificationStatusDoc,
  subscribeToUserChats,
  getOrCreateChatConversation,
  subscribeToChatMessages,
  sendChatMessage,
  markChatAsRead,
  setTypingStatus,
  archiveChatDoc,
  blockUserChatDoc,
  deleteChatConversationDoc,
  respondToChatOfferDoc,
  subscribeToSellerRentals,
  subscribeToSellerPurchases,
  updateRentalOrderStatus,
  updatePurchaseOrderStatus
} from '../services/firestoreService';
import { uploadListingImage } from '../services/storageService';
import { 
  subscribeToAuthState, 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  sendPhoneOtp, 
  confirmPhoneOtp, 
  logoutUser 
} from '../services/authService';
import { ConfirmationResult, User as FirebaseUser } from 'firebase/auth';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  listingType: 'all',
  city: 'All Cities',
  minRentPrice: 0,
  maxRentPrice: 25000,
  minSalePrice: 0,
  maxSalePrice: 300000,
  sizes: [],
  colors: [],
  fabrics: [],
  brands: [],
  conditions: [],
  availabilityOnly: false,
  sortBy: 'featured'
};

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  products: Product[];
  wishlist: string[];
  rentalBookings: RentalBooking[];
  purchaseOrders: PurchaseOrder[];
  sellerRentalBookings: RentalBooking[];
  sellerPurchaseOrders: PurchaseOrder[];
  notifications: AppNotification[];
  stories: WeddingStory[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  activeTab: 'home' | 'explore' | 'sell' | 'wishlist' | 'profile' | 'admin' | 'chat' | 'orders';
  setActiveTab: (tab: 'home' | 'explore' | 'sell' | 'wishlist' | 'profile' | 'admin' | 'chat' | 'orders') => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  activeStory: WeddingStory | null;
  setActiveStory: (story: WeddingStory | null) => void;
  targetSeller: Seller | null;
  setTargetSeller: (seller: Seller | null) => void;
  targetProduct: Product | null;
  setTargetProduct: (product: Product | null) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Real-time Chat
  chats: ChatConversation[];
  activeChatId: string | null;
  activeChat: ChatConversation | null;
  activeChatMessages: ChatMessage[];
  totalUnreadChats: number;
  openChatWithSeller: (seller: Seller, product?: Product) => Promise<ChatConversation>;
  setActiveChatId: (id: string | null) => void;
  sendTextMessage: (text: string) => Promise<ChatMessage | null>;
  sendImageMessage: (fileOrDataUrl: File | string) => Promise<ChatMessage | null>;
  sendOffer: (offerData: ChatOfferData) => Promise<ChatMessage | null>;
  respondToOffer: (messageId: string, status: 'accepted' | 'declined' | 'countered', counterPrice?: number) => Promise<void>;
  markActiveChatRead: (chatId: string) => Promise<void>;
  setChatTyping: (chatId: string, isTyping: boolean) => Promise<void>;
  archiveChat: (chatId: string, isArchived: boolean) => Promise<void>;
  blockUserChat: (chatId: string, isBlocked: boolean) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;

  // Actions
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  addProduct: (product: Partial<Product>) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<Product | null>;
  updateProductStatus: (productId: string, status: Product['status']) => void;
  deleteProduct: (productId: string) => Promise<void>;
  createRentalBooking: (booking: Omit<RentalBooking, 'id' | 'bookingDate' | 'status' | 'depositRefundStatus'>) => Promise<RentalBooking>;
  createPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'orderDate' | 'status'>) => Promise<PurchaseOrder>;
  updateRentalStatus: (bookingId: string, status: RentalBooking['status'], depositRefundStatus?: RentalBooking['depositRefundStatus'], trackingNumber?: string) => Promise<void>;
  updatePurchaseStatus: (orderId: string, status: PurchaseOrder['status'], trackingNumber?: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  handleNotificationAction: (id: string, action: 'accepted' | 'declined') => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date' | 'likes'>) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setUserRole: (role: 'buyer' | 'seller' | 'admin') => void;
  openWhatsApp: (phone: string, message: string) => void;
  openCall: (phone: string) => void;
  
  // Auth Actions
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, pass: string) => Promise<void>;
  signUpEmail: (email: string, pass: string, name: string) => Promise<void>;
  requestPhoneOtp: (phone: string, containerId?: string) => Promise<ConfirmationResult>;
  verifyPhoneOtpCode: (confirmation: ConfirmationResult, code: string) => Promise<void>;
  signOut: () => Promise<void>;

  filteredProducts: Product[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User state
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('bgk_wear_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // 2. Products state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bgk_wear_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // 3. Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('bgk_wear_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  // 4. Rental bookings
  const [rentalBookings, setRentalBookings] = useState<RentalBooking[]>(() => {
    const saved = localStorage.getItem('bgk_wear_rentals');
    return saved ? JSON.parse(saved) : [
      {
        id: 'rent-demo-1',
        productId: 'prod-1',
        productTitle: 'Crimson Velvet Heritage Bridal Lehenga with Double Dupatta',
        productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        category: 'Bridal Lehenga',
        sellerName: 'Avantika Couture Closet',
        sellerPhone: '+91 98112 34567',
        sellerWhatsapp: '+919811234567',
        startDate: '2025-02-14',
        endDate: '2025-02-17',
        totalDays: 3,
        rentAmount: 16497,
        securityDeposit: 10000,
        fittingInsurance: true,
        cleaningFee: 0,
        totalPaid: 26996,
        status: 'In Use',
        deliveryAddress: {
          fullName: 'Bhargav Khatri',
          phone: '+91 98765 43210',
          street: 'Flat 402, Royal Residency, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050'
        },
        bookingDate: '2025-01-20',
        depositRefundStatus: 'Active Security Deposit'
      }
    ];
  });

  // 5. Seller Rental & Purchase orders
  const [sellerRentalBookings, setSellerRentalBookings] = useState<RentalBooking[]>([]);
  const [sellerPurchaseOrders, setSellerPurchaseOrders] = useState<PurchaseOrder[]>([]);

  // 6. Purchase orders
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('bgk_wear_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord-demo-1',
        productId: 'prod-4',
        productTitle: 'Opaline Rose Gold Hand-Embroidered Trousseau Saree',
        productImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        sellerId: 'seller-2',
        sellerName: 'Ridhi Mehra Studio',
        sellerPhone: '+91 98765 43210',
        buyerId: 'usr-1',
        buyerName: 'Bhargav Khatri',
        buyerPhone: '+91 98765 43210',
        salePrice: 38000,
        shippingFee: 0,
        totalPaid: 38000,
        status: 'Shipped',
        orderDate: '2025-01-18',
        trackingNumber: 'BGK-CARGO-77182',
        deliveryAddress: {
          fullName: 'Bhargav Khatri',
          phone: '+91 98765 43210',
          street: 'Flat 402, Royal Residency, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050'
        }
      }
    ];
  });

  // 7. Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('bgk_wear_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // 8. Stories
  const [stories] = useState<WeddingStory[]>(INITIAL_STORIES);

  // 9. Real-time Chat state
  const [chats, setChats] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<ChatMessage[]>([]);

  // 10. Navigation & UI states
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'sell' | 'wishlist' | 'profile' | 'admin' | 'chat' | 'orders'>('home');
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<WeddingStory | null>(null);
  const [targetSeller, setTargetSeller] = useState<Seller | null>(null);
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Toast helper
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('bgk_wear_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bgk_wear_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bgk_wear_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('bgk_wear_rentals', JSON.stringify(rentalBookings));
  }, [rentalBookings]);

  useEffect(() => {
    localStorage.setItem('bgk_wear_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('bgk_wear_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Real-time Firebase Auth listener
  useEffect(() => {
    const unsubAuth = subscribeToAuthState((fbUser) => {
      setFirebaseUser(fbUser);
      setAuthLoading(false);
      if (fbUser) {
        // Sync user profile from auth
        setUser((prev) => ({
          ...prev,
          id: fbUser.uid,
          name: fbUser.displayName || prev.name,
          email: fbUser.email || prev.email,
          phone: fbUser.phoneNumber || prev.phone,
          avatar: fbUser.photoURL || prev.avatar,
          isVerified: true
        }));
      }
    });

    return () => unsubAuth();
  }, []);

  // Real-time Products Firestore Listener & Auto Seed
  useEffect(() => {
    seedInitialProductsIfEmpty();
    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    return () => unsubProducts();
  }, []);

  // Real-time Wishlist Listener for current user
  useEffect(() => {
    if (!user.id) return;
    const unsubWishlist = subscribeToUserWishlist(user.id, (cloudWishlist) => {
      if (cloudWishlist.length > 0) {
        setWishlist(cloudWishlist);
      }
    });

    return () => unsubWishlist();
  }, [user.id]);

  // Real-time Rentals Listener for current user
  useEffect(() => {
    if (!user.id) return;
    const unsubRentals = subscribeToUserRentals(user.id, (cloudRentals) => {
      if (cloudRentals.length > 0) {
        setRentalBookings(cloudRentals);
      }
    });

    return () => unsubRentals();
  }, [user.id]);

  // Real-time Seller Rentals Listener
  useEffect(() => {
    if (!user.id) return;
    const unsubSellerRentals = subscribeToSellerRentals(user.id, (cloudRentals) => {
      setSellerRentalBookings(cloudRentals);
    });

    return () => unsubSellerRentals();
  }, [user.id]);

  // Real-time Seller Purchases Listener
  useEffect(() => {
    if (!user.id) return;
    const unsubSellerPurchases = subscribeToSellerPurchases(user.id, (cloudOrders) => {
      setSellerPurchaseOrders(cloudOrders);
    });

    return () => unsubSellerPurchases();
  }, [user.id]);

  // Real-time User Chats Listener
  useEffect(() => {
    if (!user.id) return;
    const unsubChats = subscribeToUserChats(user.id, (cloudChats) => {
      setChats(cloudChats);
    });

    return () => unsubChats();
  }, [user.id]);

  // Real-time Active Chat Messages Listener
  useEffect(() => {
    if (!activeChatId) {
      setActiveChatMessages([]);
      return;
    }
    const unsubMessages = subscribeToChatMessages(activeChatId, (messages) => {
      setActiveChatMessages(messages);
      // Auto mark read if there are unread messages for me
      markChatAsRead(activeChatId, user.id);
    });

    return () => unsubMessages();
  }, [activeChatId, user.id]);

  // Active chat computation
  const activeChat = useMemo(() => {
    if (!activeChatId) return null;
    return chats.find((c) => c.id === activeChatId) || null;
  }, [chats, activeChatId]);

  // Total unread chat count
  const totalUnreadChats = useMemo(() => {
    return chats.reduce((acc, c) => acc + (c.unreadCount?.[user.id] || 0), 0);
  }, [chats, user.id]);

  // Chat Actions
  const openChatWithSeller = async (seller: Seller, product?: Product): Promise<ChatConversation> => {
    const convo = await getOrCreateChatConversation(user, seller, product);
    setActiveChatId(convo.id);
    setActiveTab('chat');
    return convo;
  };

  const sendTextMessage = async (text: string): Promise<ChatMessage | null> => {
    if (!activeChat || !text.trim()) return null;
    const otherParticipantId = activeChat.participants.find((p) => p !== user.id) || 'seller-1';

    const msg = await sendChatMessage(activeChat.id, {
      chatId: activeChat.id,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      recipientId: otherParticipantId,
      text: text.trim(),
      type: 'text'
    });

    createNotificationDoc({
      id: 'notif-' + Date.now(),
      type: 'message',
      title: `New message from ${user.name}`,
      description: text.trim().substring(0, 80),
      timestamp: 'Just now',
      read: false,
      senderName: user.name,
      senderAvatar: user.avatar
    }, otherParticipantId);

    return msg;
  };

  const sendImageMessage = async (fileOrDataUrl: File | string): Promise<ChatMessage | null> => {
    if (!activeChat) return null;
    showToast('Uploading image...', 'info');
    try {
      const uploadRes = await uploadListingImage(fileOrDataUrl, user.id);
      const otherParticipantId = activeChat.participants.find((p) => p !== user.id) || 'seller-1';

      const msg = await sendChatMessage(activeChat.id, {
        chatId: activeChat.id,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        recipientId: otherParticipantId,
        text: 'Sent a photograph',
        type: 'image',
        imageUrl: uploadRes.url
      });

      showToast('Image sent ✨', 'success');
      return msg;
    } catch (err: any) {
      showToast(err.message || 'Failed to send image', 'error');
      return null;
    }
  };

  const sendOffer = async (offerData: ChatOfferData): Promise<ChatMessage | null> => {
    if (!activeChat) return null;
    const otherParticipantId = activeChat.participants.find((p) => p !== user.id) || 'seller-1';

    const msg = await sendChatMessage(activeChat.id, {
      chatId: activeChat.id,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      recipientId: otherParticipantId,
      text: `Made an offer of ₹${offerData.offeredPrice.toLocaleString('en-IN')}`,
      type: 'offer',
      offerData
    });

    createNotificationDoc({
      id: 'notif-' + Date.now(),
      type: 'offer',
      title: `Offer Received: ₹${offerData.offeredPrice.toLocaleString('en-IN')}`,
      description: `${user.name} sent an offer for "${offerData.productTitle}"`,
      timestamp: 'Just now',
      read: false,
      relatedProductId: offerData.productId,
      senderName: user.name,
      senderAvatar: user.avatar
    }, otherParticipantId);

    showToast(`Offer of ₹${offerData.offeredPrice.toLocaleString('en-IN')} sent! 🏷️`, 'success');
    return msg;
  };

  const respondToOffer = async (
    messageId: string, 
    status: 'accepted' | 'declined' | 'countered',
    counterPrice?: number
  ): Promise<void> => {
    if (!activeChat) return;
    await respondToChatOfferDoc(activeChat.id, messageId, status, counterPrice);
    
    const otherParticipantId = activeChat.participants.find((p) => p !== user.id) || 'buyer-1';

    if (status === 'accepted') {
      showToast('Offer Accepted! Ready for booking ✨', 'success');
      sendChatMessage(activeChat.id, {
        chatId: activeChat.id,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        recipientId: otherParticipantId,
        text: `🎉 Offer accepted at agreed terms! You can now proceed with checkout.`,
        type: 'system'
      });
    } else if (status === 'declined') {
      showToast('Offer declined', 'info');
      sendChatMessage(activeChat.id, {
        chatId: activeChat.id,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        recipientId: otherParticipantId,
        text: `Offer declined. Feel free to propose another counter-offer.`,
        type: 'system'
      });
    } else if (status === 'countered' && counterPrice) {
      showToast(`Counter offer of ₹${counterPrice.toLocaleString('en-IN')} sent!`, 'success');
      sendChatMessage(activeChat.id, {
        chatId: activeChat.id,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        recipientId: otherParticipantId,
        text: `Proposed counter offer: ₹${counterPrice.toLocaleString('en-IN')}`,
        type: 'text'
      });
    }
  };

  const markActiveChatRead = async (chatId: string) => {
    await markChatAsRead(chatId, user.id);
  };

  const setChatTyping = async (chatId: string, isTyping: boolean) => {
    await setTypingStatus(chatId, user.id, isTyping);
  };

  const archiveChat = async (chatId: string, isArchived: boolean) => {
    await archiveChatDoc(chatId, user.id, isArchived);
    showToast(isArchived ? 'Chat archived' : 'Chat unarchived', 'info');
  };

  const blockUserChat = async (chatId: string, isBlocked: boolean) => {
    await blockUserChatDoc(chatId, user.id, isBlocked);
    showToast(isBlocked ? 'User blocked in chat' : 'User unblocked', 'info');
  };

  const deleteChat = async (chatId: string) => {
    await deleteChatConversationDoc(chatId);
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
    showToast('Conversation deleted', 'info');
  };

  // Real-time Notifications Listener for current user
  useEffect(() => {
    if (!user.id) return;
    const unsubNotifs = subscribeToUserNotifications(user.id, (cloudNotifs) => {
      if (cloudNotifs.length > 0) {
        setNotifications(cloudNotifs);
      }
    });

    return () => unsubNotifs();
  }, [user.id]);

  // Track product views
  useEffect(() => {
    if (selectedProduct?.id) {
      incrementProductStat(selectedProduct.id, 'views');
    }
  }, [selectedProduct?.id]);

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        removeFromWishlistDoc(user.id, productId);
        incrementProductStat(productId, 'likes');
        showToast('Removed from your Wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToWishlistDoc(user.id, productId);
        incrementProductStat(productId, 'likes');
        showToast('Added to your Wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Product management
  const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    const newProd = await createProductDoc(productData, user);
    setProducts((prev) => [newProd, ...prev]);

    // Add notification
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      type: 'approval',
      title: 'Your Outfit is Live on BGK WEAR! 🌟',
      description: `"${newProd.title}" is now visible to thousands of brides, grooms & stylists across India.`,
      timestamp: 'Just now',
      read: false,
      relatedProductId: newProd.id
    };
    setNotifications((prev) => [notif, ...prev]);
    createNotificationDoc(notif, user.id);
    showToast('Outfit listed successfully! 🌟', 'success');
    return newProd;
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
    let updated: Product | null = null;
    await updateProductDoc(productId, updates);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          updated = { ...p, ...updates };
          return updated;
        }
        return p;
      })
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...updates } : null));
    }
    showToast('Listing updated successfully ✨', 'success');
    return updated;
  };

  const updateProductStatus = (productId: string, status: Product['status']) => {
    updateProductDoc(productId, { status });
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status } : p))
    );
    showToast(`Listing status updated to ${status}`, 'info');
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    await deleteProductDoc(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Listing removed', 'info');
  };

  // Bookings
  const createRentalBooking = async (bookingData: Omit<RentalBooking, 'id' | 'bookingDate' | 'status' | 'depositRefundStatus'>): Promise<RentalBooking> => {
    const rawBooking: RentalBooking = {
      ...bookingData,
      id: 'rent-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      depositRefundStatus: 'Active Security Deposit'
    };

    const newBooking = await createRentalBookingDoc(rawBooking, user.id);
    setRentalBookings((prev) => [newBooking, ...prev]);

    // Create notification for seller & renter
    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      type: 'rental_request',
      title: 'Booking Confirmed! 💍',
      description: `Rental reserved for "${newBooking.productTitle}" from ${newBooking.startDate} to ${newBooking.endDate}. Security deposit: ₹${newBooking.securityDeposit.toLocaleString('en-IN')}.`,
      timestamp: 'Just now',
      read: false,
      relatedBookingId: newBooking.id,
      relatedProductId: newBooking.productId
    };
    setNotifications((prev) => [notif, ...prev]);
    createNotificationDoc(notif, user.id);
    showToast('Rental Booked Successfully! ✨', 'success');
    return newBooking;
  };

  const createPurchaseOrder = async (orderData: Omit<PurchaseOrder, 'id' | 'orderDate' | 'status'>): Promise<PurchaseOrder> => {
    const rawOrder: PurchaseOrder = {
      ...orderData,
      id: 'ord-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      orderDate: new Date().toISOString().split('T')[0],
      status: 'Processing'
    };

    const newOrder = await createPurchaseOrderDoc(rawOrder, user.id);
    setPurchaseOrders((prev) => [newOrder, ...prev]);

    const notif: AppNotification = {
      id: 'notif-' + Date.now(),
      type: 'purchase_request',
      title: 'Order Placed Successfully! 🛍️',
      description: `Purchase request placed for "${newOrder.productTitle}". Coordinate directly with seller ${newOrder.sellerName} via in-app chat or phone.`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications((prev) => [notif, ...prev]);
    createNotificationDoc(notif, user.id);
    showToast('Purchase Order Placed! 🎉', 'success');
    return newOrder;
  };

  const updateRentalStatus = async (
    bookingId: string, 
    status: RentalBooking['status'], 
    depositRefundStatus?: RentalBooking['depositRefundStatus'],
    trackingNumber?: string
  ): Promise<void> => {
    await updateRentalOrderStatus(bookingId, status, depositRefundStatus, trackingNumber);
    setRentalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, ...(depositRefundStatus ? { depositRefundStatus } : {}), ...(trackingNumber ? { trackingNumber } : {}) } : b))
    );
    setSellerRentalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, ...(depositRefundStatus ? { depositRefundStatus } : {}), ...(trackingNumber ? { trackingNumber } : {}) } : b))
    );
    showToast(`Rental order status updated to: ${status}`, 'success');
  };

  const updatePurchaseStatus = async (
    orderId: string, 
    status: PurchaseOrder['status'], 
    trackingNumber?: string
  ): Promise<void> => {
    await updatePurchaseOrderStatus(orderId, status, trackingNumber);
    setPurchaseOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, ...(trackingNumber ? { trackingNumber } : {}) } : o))
    );
    setSellerPurchaseOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, ...(trackingNumber ? { trackingNumber } : {}) } : o))
    );
    showToast(`Purchase order status updated to: ${status}`, 'success');
  };

  const markNotificationRead = (id: string) => {
    updateNotificationStatusDoc(id, { read: true });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNotificationAction = (id: string, action: 'accepted' | 'declined') => {
    updateNotificationStatusDoc(id, { actionState: action, read: true });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, actionState: action, read: true } : n))
    );
    showToast(`Rental request ${action}!`, action === 'accepted' ? 'success' : 'info');
  };

  const addReview = (productId: string, reviewData: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Today',
      likes: 0
    };

    addReviewDoc(productId, newReview, user.id);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newRating = Number(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newRating
          };
        }
        return p;
      })
    );
    showToast('Thank you for sharing your review! ⭐', 'success');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      saveUserProfileDoc(updated.id, updated);
      return updated;
    });
    showToast('Profile updated successfully', 'success');
  };

  const setUserRole = (role: 'buyer' | 'seller' | 'admin') => {
    setUser((prev) => {
      const updated = { ...prev, role };
      saveUserProfileDoc(updated.id, updated);
      return updated;
    });
    showToast(`Switched view to ${role.toUpperCase()}`, 'info');
  };

  // Auth Methods
  const signInGoogle = async () => {
    try {
      const fbUser = await loginWithGoogle();
      const updatedProfile: UserProfile = {
        ...user,
        id: fbUser.uid,
        name: fbUser.displayName || user.name,
        email: fbUser.email || user.email,
        avatar: fbUser.photoURL || user.avatar,
        isVerified: true
      };
      setUser(updatedProfile);
      saveUserProfileDoc(fbUser.uid, updatedProfile);
      showToast(`Welcome back, ${fbUser.displayName || 'connoisseur'}! 🌟`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Google sign-in failed', 'error');
    }
  };

  const signInEmail = async (email: string, pass: string) => {
    try {
      const fbUser = await loginWithEmail(email, pass);
      const updatedProfile: UserProfile = {
        ...user,
        id: fbUser.uid,
        email: fbUser.email || email,
        name: fbUser.displayName || user.name,
        isVerified: true
      };
      setUser(updatedProfile);
      saveUserProfileDoc(fbUser.uid, updatedProfile);
      showToast('Logged in successfully! Welcome back ✨', 'success');
    } catch (err: any) {
      showToast(err.message || 'Email login failed', 'error');
    }
  };

  const signUpEmail = async (email: string, pass: string, name: string) => {
    try {
      const fbUser = await registerWithEmail(email, pass, name);
      const updatedProfile: UserProfile = {
        ...user,
        id: fbUser.uid,
        email: fbUser.email || email,
        name: name || user.name,
        isVerified: true
      };
      setUser(updatedProfile);
      saveUserProfileDoc(fbUser.uid, updatedProfile);
      showToast('Account created successfully! Welcome to BGK WEAR ✨', 'success');
    } catch (err: any) {
      showToast(err.message || 'Sign up failed', 'error');
    }
  };

  const requestPhoneOtp = async (phone: string, containerId: string = 'recaptcha-container'): Promise<ConfirmationResult> => {
    const formatted = phone.startsWith('+') ? phone : `+91${phone.replace(/\s+/g, '')}`;
    return sendPhoneOtp(formatted, containerId);
  };

  const verifyPhoneOtpCode = async (confirmation: ConfirmationResult, code: string) => {
    try {
      const fbUser = await confirmPhoneOtp(confirmation, code);
      const updatedProfile: UserProfile = {
        ...user,
        id: fbUser.uid,
        phone: fbUser.phoneNumber || user.phone,
        isVerified: true
      };
      setUser(updatedProfile);
      saveUserProfileDoc(fbUser.uid, updatedProfile);
      showToast('Phone verified! Logged in successfully 🌟', 'success');
    } catch (err: any) {
      showToast(err.message || 'OTP verification failed', 'error');
    }
  };

  const signOut = async () => {
    await logoutUser();
    setUser(INITIAL_USER);
    showToast('Signed out successfully', 'info');
  };

  const updateFilter = (partial: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...partial }));
  };

  const resetFilters = () => {
    setFilterState(DEFAULT_FILTERS);
    showToast('Filters reset', 'info');
  };

  const openWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
  };

  // Filtered products calculation
  const filteredProducts = products.filter((p) => {
    // Only show active unless in admin
    if (p.status !== 'active' && user.role !== 'admin') {
      return false;
    }

    // Availability Filter
    if (filterState.availabilityOnly && p.status !== 'active') {
      return false;
    }

    // City Filter
    if (selectedCity !== 'All Cities' && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    if (filterState.city !== 'All Cities' && p.city.toLowerCase() !== filterState.city.toLowerCase()) {
      return false;
    }

    // Search query (multi-field matching: title, description, brand, category, color, city, fabric, seller name, occasions)
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchColor = p.color.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchFabric = p.fabric ? p.fabric.toLowerCase().includes(q) : false;
      const matchSeller = p.seller?.name ? p.seller.name.toLowerCase().includes(q) : false;
      const matchOccasion = p.occasion ? p.occasion.some((occ) => occ.toLowerCase().includes(q)) : false;

      if (!matchTitle && !matchDesc && !matchBrand && !matchCat && !matchColor && !matchCity && !matchFabric && !matchSeller && !matchOccasion) {
        return false;
      }
    }

    // Category
    if (filterState.category && filterState.category !== 'All' && p.category !== filterState.category) {
      return false;
    }

    // Listing Type (rent, buy, both)
    if (filterState.listingType === 'rent') {
      if (p.listingType !== 'rent' && p.listingType !== 'both') return false;
    } else if (filterState.listingType === 'buy') {
      if (p.listingType !== 'buy' && p.listingType !== 'both') return false;
    }

    // Price Rent
    if (p.rentPricePerDay < filterState.minRentPrice || p.rentPricePerDay > filterState.maxRentPrice) {
      return false;
    }

    // Price Sale (if set)
    if (filterState.listingType === 'buy' && p.salePrice) {
      if (p.salePrice < filterState.minSalePrice || p.salePrice > filterState.maxSalePrice) {
        return false;
      }
    }

    // Sizes
    if (filterState.sizes.length > 0 && !filterState.sizes.includes(p.size)) {
      return false;
    }

    // Colors
    if (filterState.colors && filterState.colors.length > 0) {
      const match = filterState.colors.some(
        (c) => p.color.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(p.color.toLowerCase())
      );
      if (!match) return false;
    }

    // Fabrics
    if (filterState.fabrics && filterState.fabrics.length > 0) {
      const match = filterState.fabrics.some(
        (f) => p.fabric && p.fabric.toLowerCase().includes(f.toLowerCase())
      );
      if (!match) return false;
    }

    // Brands
    if (filterState.brands.length > 0 && !filterState.brands.includes(p.brand)) {
      return false;
    }

    // Conditions
    if (filterState.conditions.length > 0 && !filterState.conditions.includes(p.condition)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filterState.sortBy === 'price_low') {
      const priceA = filterState.listingType === 'buy' ? (a.salePrice || a.rentPricePerDay * 3) : a.rentPricePerDay;
      const priceB = filterState.listingType === 'buy' ? (b.salePrice || b.rentPricePerDay * 3) : b.rentPricePerDay;
      return priceA - priceB;
    }
    if (filterState.sortBy === 'price_high') {
      const priceA = filterState.listingType === 'buy' ? (a.salePrice || a.rentPricePerDay * 3) : a.rentPricePerDay;
      const priceB = filterState.listingType === 'buy' ? (b.salePrice || b.rentPricePerDay * 3) : b.rentPricePerDay;
      return priceB - priceA;
    }
    if (filterState.sortBy === 'rating') return b.rating - a.rating;
    if (filterState.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (filterState.sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
    if (filterState.sortBy === 'saved') return (b.likesCount || 0) - (a.likesCount || 0);
    if (filterState.sortBy === 'discount') {
      const discA = a.originalRetailPrice ? (a.originalRetailPrice - (a.salePrice || a.rentPricePerDay * 3)) / a.originalRetailPrice : 0;
      const discB = b.originalRetailPrice ? (b.originalRetailPrice - (b.salePrice || b.rentPricePerDay * 3)) / b.originalRetailPrice : 0;
      return discB - discA;
    }
    // Default featured
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        firebaseUser,
        authLoading,
        products,
        wishlist,
        rentalBookings,
        purchaseOrders,
        sellerRentalBookings,
        sellerPurchaseOrders,
        notifications,
        stories,
        selectedCity,
        setSelectedCity,
        activeTab,
        setActiveTab,
        filterState,
        setFilterState,
        updateFilter,
        resetFilters,
        editingProduct,
        setEditingProduct,
        selectedProduct,
        setSelectedProduct,
        activeModal,
        setActiveModal,
        activeStory,
        setActiveStory,
        targetSeller,
        setTargetSeller,
        targetProduct,
        setTargetProduct,
        toasts,
        showToast,
        removeToast,
        chats,
        activeChatId,
        activeChat,
        activeChatMessages,
        totalUnreadChats,
        openChatWithSeller,
        setActiveChatId,
        sendTextMessage,
        sendImageMessage,
        sendOffer,
        respondToOffer,
        markActiveChatRead,
        setChatTyping,
        archiveChat,
        blockUserChat,
        deleteChat,
        toggleWishlist,
        isWishlisted,
        addProduct,
        updateProduct,
        updateProductStatus,
        deleteProduct,
        createRentalBooking,
        createPurchaseOrder,
        updateRentalStatus,
        updatePurchaseStatus,
        markNotificationRead,
        handleNotificationAction,
        addReview,
        updateUserProfile,
        setUserRole,
        openWhatsApp,
        openCall,
        signInGoogle,
        signInEmail,
        signUpEmail,
        requestPhoneOtp,
        verifyPhoneOtpCode,
        signOut,
        filteredProducts
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
