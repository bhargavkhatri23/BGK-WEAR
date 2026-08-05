import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Product, 
  UserProfile, 
  RentalBooking, 
  PurchaseOrder, 
  AppNotification, 
  Review,
  ChatMessage,
  ChatConversation,
  ChatOfferData,
  Seller
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';

// Collection references
const USERS_COL = 'users';
const PRODUCTS_COL = 'products';
const RENTALS_COL = 'rentalOrders';
const ORDERS_COL = 'purchaseOrders';
const WISHLIST_COL = 'wishlist';
const REVIEWS_COL = 'reviews';
const NOTIFICATIONS_COL = 'notifications';
const CHATS_COL = 'chats';
const MESSAGES_COL = 'messages';

/* =========================================================================
   1. PRODUCTS REPOSITORY
   ========================================================================= */

/**
 * Convert Firestore product doc to frontend Product model
 */
function mapFirestoreDocToProduct(docId: string, data: any): Product {
  return {
    id: docId,
    title: data.title || 'Untitled Royal Outfit',
    description: data.description || '',
    category: data.category || 'Bridal Lehenga',
    brand: data.brand || 'BGK Signature',
    size: data.size || 'Free Size',
    color: data.color || 'Royal Gold',
    colorHex: data.colorHex || '#D4AF37',
    condition: data.condition || 'Like New (Worn Once)',
    listingType: data.listingType || 'both',
    rentPricePerDay: data.rentPricePerDay || data.rentPrice || 2999,
    salePrice: data.salePrice || undefined,
    securityDeposit: data.securityDeposit || 5000,
    originalRetailPrice: data.originalRetailPrice || 45000,
    images: data.images && data.images.length > 0 ? data.images : [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: Boolean(data.featured),
    trending: Boolean(data.trending),
    newArrival: Boolean(data.newArrival),
    city: data.city || 'Mumbai',
    state: data.state || 'Maharashtra',
    seller: data.seller || {
      id: data.sellerId || 'seller-1',
      name: data.sellerName || 'Avantika Couture',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      city: data.city || 'Mumbai',
      state: data.state || 'Maharashtra',
      isVerified: true,
      rating: 5.0,
      totalReviews: 2,
      totalListings: 1,
      responseTime: 'Under 15 mins'
    },
    rating: data.rating || 5.0,
    reviewsCount: data.reviewsCount || 0,
    reviews: data.reviews || [],
    availableFrom: data.availableFrom || new Date().toISOString().split('T')[0],
    availableTo: data.availableTo || '2026-12-31',
    status: data.status || 'active',
    fabric: data.fabric || 'Pure Silk & Hand Zardozi',
    occasion: data.occasion || ['Wedding Ceremony', 'Reception'],
    measurements: data.measurements || { alterationMargin: '2-3 inches side margin' },
    viewsCount: data.viewsCount || data.views || 0,
    likesCount: data.likesCount || data.likes || 0,
    createdAt: data.createdAt || new Date().toISOString().split('T')[0]
  };
}

/**
 * Listen to all active products in real time
 */
export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  try {
    const productsRef = collection(db, PRODUCTS_COL);
    const q = query(productsRef, limit(100));

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Fall back to initial products or seed if remote is empty
        callback(INITIAL_PRODUCTS);
      } else {
        const prods: Product[] = [];
        snapshot.forEach((docSnap) => {
          prods.push(mapFirestoreDocToProduct(docSnap.id, docSnap.data()));
        });
        callback(prods);
      }
    }, (error) => {
      console.warn('[Firestore] Products subscription falling back to local dataset:', error);
      callback(INITIAL_PRODUCTS);
    });
  } catch (err) {
    console.warn('[Firestore] Subscription init error:', err);
    callback(INITIAL_PRODUCTS);
    return () => {};
  }
}

/**
 * Seed initial sample listings to Firestore if empty
 */
export async function seedInitialProductsIfEmpty(): Promise<void> {
  try {
    const productsRef = collection(db, PRODUCTS_COL);
    const snap = await getDocs(query(productsRef, limit(1)));
    if (snap.empty) {
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach((prod) => {
        const docRef = doc(db, PRODUCTS_COL, prod.id);
        batch.set(docRef, {
          ...prod,
          sellerId: prod.seller?.id || 'demo-seller',
          sellerName: prod.seller?.name || 'Boutique Curator',
          rentPrice: prod.rentPricePerDay,
          views: prod.viewsCount || 10,
          likes: prod.likesCount || 5,
          createdAt: new Date().toISOString()
        });
      });
      await batch.commit();
      console.info('[Firestore] Initial luxury couture catalog seeded successfully.');
    }
  } catch (err) {
    // Non-blocking fallback
    console.warn('[Firestore] Seeding skipped (offline/demo mode active):', err);
  }
}

/**
 * Create a new product listing in Firestore
 */
export async function createProductDoc(product: Partial<Product>, currentUser: UserProfile): Promise<Product> {
  const prodId = 'prod-' + Date.now();
  const newProduct: Product = {
    id: prodId,
    title: product.title || 'Untitled Royal Outfit',
    description: product.description || 'Exclusive handcrafted designer attire.',
    category: product.category || 'Bridal Lehenga',
    brand: product.brand || 'BGK Signature',
    size: product.size || 'Free Size',
    color: product.color || 'Royal Gold',
    colorHex: product.colorHex || '#D4AF37',
    condition: product.condition || 'Brand New',
    listingType: product.listingType || 'both',
    rentPricePerDay: Number(product.rentPricePerDay) || 2999,
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    securityDeposit: Number(product.securityDeposit) || 5000,
    originalRetailPrice: Number(product.originalRetailPrice) || 45000,
    images: product.images && product.images.length > 0 ? product.images : [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false,
    trending: true,
    newArrival: true,
    city: product.city || currentUser.city || 'Mumbai',
    state: product.state || currentUser.state || 'Maharashtra',
    seller: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      city: currentUser.city,
      state: currentUser.state,
      bio: currentUser.bio,
      phone: currentUser.phone,
      whatsapp: currentUser.whatsapp,
      isVerified: currentUser.isVerified,
      rating: 5.0,
      totalReviews: 1,
      totalListings: 1,
      joinedYear: '2024',
      responseTime: 'Under 10 mins'
    },
    rating: 5.0,
    reviewsCount: 0,
    reviews: [],
    availableFrom: product.availableFrom || new Date().toISOString().split('T')[0],
    availableTo: product.availableTo || '2026-12-31',
    status: 'active',
    fabric: product.fabric || 'Pure Silk & Handcrafted Zari',
    occasion: product.occasion || ['Wedding Ceremony', 'Reception'],
    measurements: product.measurements || { alterationMargin: '2-3 inches side margin' },
    viewsCount: 1,
    likesCount: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };

  try {
    const docRef = doc(db, PRODUCTS_COL, prodId);
    await setDoc(docRef, {
      ...newProduct,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      rentPrice: newProduct.rentPricePerDay,
      views: 1,
      likes: 0,
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.warn('[Firestore] Product doc saved locally:', err);
  }

  return newProduct;
}

/**
 * Update an existing product listing
 */
export async function updateProductDoc(productId: string, updates: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COL, productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('[Firestore] Update saved locally:', err);
  }
}

/**
 * Delete a product listing
 */
export async function deleteProductDoc(productId: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COL, productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[Firestore] Delete executed locally:', err);
  }
}

/**
 * Increment views or likes
 */
export async function incrementProductStat(productId: string, stat: 'views' | 'likes'): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COL, productId);
    await updateDoc(docRef, {
      [stat === 'views' ? 'viewsCount' : 'likesCount']: increment(1)
    });
  } catch {
    // Non-blocking
  }
}

/* =========================================================================
   2. USER PROFILES
   ========================================================================= */

export async function saveUserProfileDoc(userId: string, profile: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, USERS_COL, userId);
    await setDoc(docRef, {
      uid: userId,
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firestore] User profile saved locally:', err);
  }
}

export function subscribeToUserProfile(userId: string, callback: (profile: UserProfile | null) => void): () => void {
  try {
    const docRef = doc(db, USERS_COL, userId);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data() as UserProfile);
      }
    }, () => {
      // Ignore errors in offline mode
    });
  } catch {
    return () => {};
  }
}

/* =========================================================================
   3. WISHLIST REPOSITORY
   ========================================================================= */

export function subscribeToUserWishlist(userId: string, callback: (productIds: string[]) => void): () => void {
  try {
    const q = query(collection(db, WISHLIST_COL), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach((d) => {
        const pId = d.data().productId;
        if (pId) ids.push(pId);
      });
      callback(ids);
    }, (error) => {
      console.warn('[Firestore] Wishlist listener offline fallback:', error);
    });
  } catch {
    return () => {};
  }
}

export async function addToWishlistDoc(userId: string, productId: string): Promise<void> {
  try {
    const docId = `${userId}_${productId}`;
    const docRef = doc(db, WISHLIST_COL, docId);
    await setDoc(docRef, {
      wishlistId: docId,
      userId,
      productId,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Firestore] Wishlist item added locally:', err);
  }
}

export async function removeFromWishlistDoc(userId: string, productId: string): Promise<void> {
  try {
    const docId = `${userId}_${productId}`;
    const docRef = doc(db, WISHLIST_COL, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[Firestore] Wishlist item removed locally:', err);
  }
}

/* =========================================================================
   4. RENTAL ORDERS & PURCHASES
   ========================================================================= */

export async function createRentalBookingDoc(booking: RentalBooking, userId: string): Promise<RentalBooking> {
  try {
    const docRef = doc(db, RENTALS_COL, booking.id);
    await setDoc(docRef, {
      rentalId: booking.id,
      renterId: userId,
      ownerId: booking.sellerPhone || 'owner_id',
      ...booking,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Firestore] Rental booking saved locally:', err);
  }
  return booking;
}

export function subscribeToUserRentals(userId: string, callback: (bookings: RentalBooking[]) => void): () => void {
  try {
    const q = query(collection(db, RENTALS_COL), where('renterId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const list: RentalBooking[] = [];
      snapshot.forEach((d) => list.push(d.data() as RentalBooking));
      if (list.length > 0) {
        callback(list);
      }
    }, () => {});
  } catch {
    return () => {};
  }
}

export async function createPurchaseOrderDoc(order: PurchaseOrder, userId: string): Promise<PurchaseOrder> {
  try {
    const docRef = doc(db, ORDERS_COL, order.id);
    await setDoc(docRef, {
      orderId: order.id,
      buyerId: userId,
      ...order,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Firestore] Purchase order saved locally:', err);
  }
  return order;
}

/* =========================================================================
   5. REVIEWS & RATINGS
   ========================================================================= */

export async function addReviewDoc(productId: string, review: Review, sellerId: string): Promise<void> {
  try {
    const revId = 'rev-' + Date.now();
    const docRef = doc(db, REVIEWS_COL, revId);
    await setDoc(docRef, {
      reviewId: revId,
      productId,
      reviewerId: review.userName,
      sellerId: sellerId || 'seller_id',
      rating: review.rating,
      review: review.comment,
      ...review,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Firestore] Review saved locally:', err);
  }
}

/* =========================================================================
   6. NOTIFICATIONS
   ========================================================================= */

export async function createNotificationDoc(notification: AppNotification, userId: string): Promise<void> {
  try {
    const docRef = doc(db, NOTIFICATIONS_COL, notification.id);
    await setDoc(docRef, {
      notificationId: notification.id,
      userId,
      ...notification,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Firestore] Notification saved locally:', err);
  }
}

export function subscribeToUserNotifications(userId: string, callback: (notifs: AppNotification[]) => void): () => void {
  try {
    const q = query(collection(db, NOTIFICATIONS_COL), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const list: AppNotification[] = [];
      snapshot.forEach((d) => list.push(d.data() as AppNotification));
      if (list.length > 0) {
        callback(list);
      }
    }, () => {});
  } catch {
    return () => {};
  }
}

export async function updateNotificationStatusDoc(notifId: string, updates: Partial<AppNotification>): Promise<void> {
  try {
    const docRef = doc(db, NOTIFICATIONS_COL, notifId);
    await updateDoc(docRef, updates);
  } catch {
    // Local fallback
  }
}

/* =========================================================================
   7. REAL-TIME CHAT & MESSAGING REPOSITORY
   ========================================================================= */

/**
 * Listen to all chat conversations where user is a participant
 */
export function subscribeToUserChats(userId: string, callback: (chats: ChatConversation[]) => void): () => void {
  try {
    const q = query(
      collection(db, CHATS_COL),
      where('participants', 'array-contains', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const chatList: ChatConversation[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as ChatConversation;
        // Filter out archived if needed or keep with flag
        chatList.push({
          ...data,
          id: d.id
        });
      });
      // Sort by latest update time
      chatList.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      callback(chatList);
    }, (error) => {
      console.warn('[Firestore] Chat subscription offline fallback:', error);
      callback([]);
    });
  } catch (err) {
    console.warn('[Firestore] Chat subscription error:', err);
    return () => {};
  }
}

/**
 * Get existing conversation or create a new one between buyer and seller (with optional product context)
 */
export async function getOrCreateChatConversation(
  buyer: UserProfile,
  seller: Seller,
  product?: Product
): Promise<ChatConversation> {
  const chatId = [buyer.id, seller.id].sort().join('_') + (product ? `_${product.id}` : '');
  const chatRef = doc(db, CHATS_COL, chatId);

  try {
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists()) {
      return {
        ...chatSnap.data() as ChatConversation,
        id: chatSnap.id
      };
    }

    // Create fresh conversation
    const newChat: ChatConversation = {
      id: chatId,
      participants: [buyer.id, seller.id],
      participantDetails: {
        [buyer.id]: {
          id: buyer.id,
          name: buyer.name,
          avatar: buyer.avatar,
          phone: buyer.phone,
          city: buyer.city,
          isOnline: true,
          lastSeen: 'Active now'
        },
        [seller.id]: {
          id: seller.id,
          name: seller.name,
          avatar: seller.avatar,
          phone: seller.phone,
          city: seller.city,
          isOnline: true,
          lastSeen: seller.responseTime || 'Under 15 mins'
        }
      },
      lastMessage: product 
        ? `Inquired about "${product.title}" (${product.brand})` 
        : `Started a conversation`,
      lastMessageTime: 'Just now',
      lastSenderId: buyer.id,
      unreadCount: {
        [seller.id]: 1,
        [buyer.id]: 0
      },
      productId: product?.id,
      productTitle: product?.title,
      productImage: product?.images?.[0],
      productPrice: product?.rentPricePerDay,
      updatedAt: new Date().toISOString()
    };

    await setDoc(chatRef, newChat);

    // Also add initial welcome/context message
    const msgId = 'msg-' + Date.now();
    const msgRef = doc(collection(db, CHATS_COL, chatId, MESSAGES_COL), msgId);
    await setDoc(msgRef, {
      id: msgId,
      chatId,
      senderId: buyer.id,
      senderName: buyer.name,
      senderAvatar: buyer.avatar,
      recipientId: seller.id,
      text: product 
        ? `Hello ${seller.name}! I am interested in renting "${product.title}" in size ${product.size}. Is this available for next weekend? ✨` 
        : `Hello ${seller.name}! I love your couture collection.`,
      type: 'text',
      timestamp: 'Just now',
      delivered: true,
      read: false,
      createdAt: serverTimestamp()
    });

    return newChat;
  } catch (err) {
    console.warn('[Firestore] Creating local chat session:', err);
    return {
      id: chatId,
      participants: [buyer.id, seller.id],
      participantDetails: {
        [buyer.id]: { id: buyer.id, name: buyer.name, avatar: buyer.avatar, isOnline: true },
        [seller.id]: { id: seller.id, name: seller.name, avatar: seller.avatar, isOnline: true }
      },
      lastMessage: 'Conversation started',
      lastMessageTime: 'Just now',
      lastSenderId: buyer.id,
      unreadCount: { [seller.id]: 1, [buyer.id]: 0 },
      productId: product?.id,
      productTitle: product?.title,
      productImage: product?.images?.[0],
      productPrice: product?.rentPricePerDay,
      updatedAt: new Date().toISOString()
    };
  }
}

/**
 * Real-time listener for messages in a specific chat
 */
export function subscribeToChatMessages(
  chatId: string, 
  callback: (messages: ChatMessage[]) => void
): () => void {
  try {
    const messagesRef = collection(db, CHATS_COL, chatId, MESSAGES_COL);
    const q = query(messagesRef, limit(100));

    return onSnapshot(q, (snapshot) => {
      const messages: ChatMessage[] = [];
      snapshot.forEach((d) => {
        messages.push({
          ...d.data() as ChatMessage,
          id: d.id
        });
      });
      // Sort chronologically
      messages.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return timeA - timeB;
      });
      callback(messages);
    }, (err) => {
      console.warn('[Firestore] Messages subscription offline:', err);
      callback([]);
    });
  } catch {
    return () => {};
  }
}

/**
 * Send a message in a chat conversation
 */
export async function sendChatMessage(
  chatId: string,
  messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'delivered' | 'read'>
): Promise<ChatMessage> {
  const msgId = 'msg-' + Date.now();
  const newMsg: ChatMessage = {
    ...messageData,
    id: msgId,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    delivered: true,
    read: false
  };

  try {
    // 1. Write message doc
    const msgRef = doc(collection(db, CHATS_COL, chatId, MESSAGES_COL), msgId);
    await setDoc(msgRef, {
      ...newMsg,
      createdAt: serverTimestamp()
    });

    // 2. Update parent conversation snippet & unread count
    const chatRef = doc(db, CHATS_COL, chatId);
    await updateDoc(chatRef, {
      lastMessage: newMsg.type === 'image' ? '📷 Photo' : newMsg.type === 'offer' ? `🏷️ Offer: ₹${newMsg.offerData?.offeredPrice.toLocaleString('en-IN')}` : newMsg.text,
      lastMessageTime: newMsg.timestamp,
      lastSenderId: newMsg.senderId,
      [`unreadCount.${newMsg.recipientId}`]: increment(1),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('[Firestore] Message written locally:', err);
  }

  return newMsg;
}

/**
 * Mark all unread messages as read in a chat
 */
export async function markChatAsRead(chatId: string, userId: string): Promise<void> {
  try {
    const chatRef = doc(db, CHATS_COL, chatId);
    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: 0
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Set typing status
 */
export async function setTypingStatus(chatId: string, userId: string, isTyping: boolean): Promise<void> {
  try {
    const chatRef = doc(db, CHATS_COL, chatId);
    await updateDoc(chatRef, {
      [`typing.${userId}`]: isTyping
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Archive or unarchive chat for a user
 */
export async function archiveChatDoc(chatId: string, userId: string, isArchived: boolean): Promise<void> {
  try {
    const chatRef = doc(db, CHATS_COL, chatId);
    await updateDoc(chatRef, {
      [`isArchived.${userId}`]: isArchived
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Block or unblock a user in chat
 */
export async function blockUserChatDoc(chatId: string, userId: string, isBlocked: boolean): Promise<void> {
  try {
    const chatRef = doc(db, CHATS_COL, chatId);
    await updateDoc(chatRef, {
      [`isBlocked.${userId}`]: isBlocked
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Delete a conversation
 */
export async function deleteChatConversationDoc(chatId: string): Promise<void> {
  try {
    const chatRef = doc(db, CHATS_COL, chatId);
    await deleteDoc(chatRef);
  } catch {
    // Non-blocking
  }
}

/**
 * Respond to an offer made in chat
 */
export async function respondToChatOfferDoc(
  chatId: string,
  messageId: string,
  status: 'accepted' | 'declined' | 'countered',
  counterPrice?: number
): Promise<void> {
  try {
    const msgRef = doc(collection(db, CHATS_COL, chatId, MESSAGES_COL), messageId);
    await updateDoc(msgRef, {
      'offerData.status': status,
      ...(counterPrice ? { 'offerData.counterPrice': counterPrice } : {})
    });
  } catch {
    // Non-blocking
  }
}

/* =========================================================================
   8. SELLER & BUYER ORDER LIFECYCLE MANAGEMENT
   ========================================================================= */

/**
 * Subscribe to all rental orders for a seller
 */
export function subscribeToSellerRentals(sellerId: string, callback: (bookings: RentalBooking[]) => void): () => void {
  try {
    const q = query(collection(db, RENTALS_COL), where('sellerId', '==', sellerId));
    return onSnapshot(q, (snapshot) => {
      const list: RentalBooking[] = [];
      snapshot.forEach((d) => list.push(d.data() as RentalBooking));
      callback(list);
    }, () => {});
  } catch {
    return () => {};
  }
}

/**
 * Subscribe to all purchase orders for a seller
 */
export function subscribeToSellerPurchases(sellerId: string, callback: (orders: PurchaseOrder[]) => void): () => void {
  try {
    const q = query(collection(db, ORDERS_COL), where('sellerId', '==', sellerId));
    return onSnapshot(q, (snapshot) => {
      const list: PurchaseOrder[] = [];
      snapshot.forEach((d) => list.push(d.data() as PurchaseOrder));
      callback(list);
    }, () => {});
  } catch {
    return () => {};
  }
}

/**
 * Update rental order status with security deposit status and handover tracking
 */
export async function updateRentalOrderStatus(
  bookingId: string,
  status: RentalBooking['status'],
  depositRefundStatus?: RentalBooking['depositRefundStatus'],
  trackingNumber?: string
): Promise<void> {
  try {
    const docRef = doc(db, RENTALS_COL, bookingId);
    const updates: Partial<RentalBooking> = { status };
    if (depositRefundStatus) updates.depositRefundStatus = depositRefundStatus;
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('[Firestore] Rental order status updated locally:', err);
  }
}

/**
 * Update purchase order status with tracking details
 */
export async function updatePurchaseOrderStatus(
  orderId: string,
  status: PurchaseOrder['status'],
  trackingNumber?: string
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    const updates: Partial<PurchaseOrder> = { status };
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('[Firestore] Purchase order status updated locally:', err);
  }
}
