import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  MapPin,
  Calendar,
  Layers,
  Wand2,
  FileImage,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Truck,
  Scissors,
  DollarSign,
  Star,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OutfitCategory, OutfitSize, OutfitCondition, ListingType, Product } from '../types';
import { CATEGORIES_DATA, BRANDS_LIST, CITIES_LIST } from '../data/mockData';
import { compressImage, validateImageFile } from '../services/imageService';
import { uploadMultipleListingImages } from '../services/storageService';

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1610030469668-9655ecdd3e14?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80'
];

const COLOR_PRESETS = [
  { name: 'Royal Crimson', hex: '#8b0000' },
  { name: 'Antique Gold', hex: '#D4AF37' },
  { name: 'Emerald Green', hex: '#005f38' },
  { name: 'Midnight Navy', hex: '#001f3f' },
  { name: 'Rani Rose Pink', hex: '#c2185b' },
  { name: 'Mustard Haldi', hex: '#e6a100' },
  { name: 'Ivory Pearl', hex: '#fdfbf7' },
  { name: 'Pastel Peach', hex: '#ffcba4' }
];

const FABRIC_SUGGESTIONS = [
  'Raw Silk & Zardozi',
  'Pure Banarasi Brocade',
  'Micro Velvet',
  'Pure Organza & Silk',
  'Chanderi Silk',
  'Georgette & Mirror Work',
  'Handloom Tussar',
  'Net & French Lace'
];

export const UploadListingModal: React.FC = () => {
  const { 
    activeModal, 
    setActiveModal, 
    addProduct, 
    updateProduct,
    editingProduct,
    setEditingProduct,
    user, 
    setSelectedProduct,
    showToast
  } = useApp();

  const isEditing = Boolean(editingProduct);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<OutfitCategory>('Bridal Lehenga');
  const [brand, setBrand] = useState('Sabyasachi Heritage');
  const [customBrand, setCustomBrand] = useState('');
  const [size, setSize] = useState<OutfitSize>('M');
  const [color, setColor] = useState('Royal Crimson Red');
  const [colorHex, setColorHex] = useState('#8b0000');
  const [condition, setCondition] = useState<OutfitCondition>('Like New (Worn Once)');
  const [listingType, setListingType] = useState<ListingType>('both');
  const [rentPrice, setRentPrice] = useState('3500');
  const [salePrice, setSalePrice] = useState('65000');
  const [deposit, setDeposit] = useState('6000');
  const [retailPrice, setRetailPrice] = useState('180000');
  const [fabric, setFabric] = useState('Raw Silk & Hand Zardozi');
  const [city, setCity] = useState(user.city || 'Mumbai');
  const [state, setState] = useState(user.state || 'Maharashtra');
  const [pincode, setPincode] = useState('400050');
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().split('T')[0]);
  const [availableTo, setAvailableTo] = useState('2026-12-31');
  const [deliveryOptions, setDeliveryOptions] = useState<string[]>([
    'Direct Seller Handover',
    'Local Boutique / Home Pickup'
  ]);

  // Measurements
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [bust, setBust] = useState('36 in');
  const [waist, setWaist] = useState('30 in');
  const [length, setLength] = useState('42 in');
  const [hip, setHip] = useState('38 in');
  const [alterationMargin, setAlterationMargin] = useState('2 inches on both sides');

  // Images state
  const [images, setImages] = useState<string[]>([SAMPLE_PHOTO_PRESETS[0]]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or prefill when editingProduct changes or modal opens
  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title || '');
      setDescription(editingProduct.description || '');
      setCategory(editingProduct.category || 'Bridal Lehenga');
      if (BRANDS_LIST.includes(editingProduct.brand)) {
        setBrand(editingProduct.brand);
        setCustomBrand('');
      } else {
        setBrand('Other');
        setCustomBrand(editingProduct.brand || '');
      }
      setSize(editingProduct.size || 'M');
      setColor(editingProduct.color || 'Royal Crimson Red');
      setColorHex(editingProduct.colorHex || '#8b0000');
      setCondition(editingProduct.condition || 'Like New (Worn Once)');
      setListingType(editingProduct.listingType || 'both');
      setRentPrice(editingProduct.rentPricePerDay?.toString() || '3500');
      setSalePrice(editingProduct.salePrice?.toString() || '');
      setDeposit(editingProduct.securityDeposit?.toString() || '5000');
      setRetailPrice(editingProduct.originalRetailPrice?.toString() || '50000');
      setFabric(editingProduct.fabric || 'Raw Silk');
      setCity(editingProduct.city || user.city || 'Mumbai');
      setState(editingProduct.state || user.state || 'Maharashtra');
      setAvailableFrom(editingProduct.availableFrom || new Date().toISOString().split('T')[0]);
      setAvailableTo(editingProduct.availableTo || '2026-12-31');
      setImages(editingProduct.images?.length > 0 ? editingProduct.images : [SAMPLE_PHOTO_PRESETS[0]]);
      if (editingProduct.measurements) {
        setBust(editingProduct.measurements.bust || '36 in');
        setWaist(editingProduct.measurements.waist || '30 in');
        setLength(editingProduct.measurements.length || '42 in');
        setHip(editingProduct.measurements.hip || '38 in');
        setAlterationMargin(editingProduct.measurements.alterationMargin || '2 inches');
        setShowMeasurements(true);
      }
    } else if (activeModal === 'upload') {
      // Default reset for new listing
      setTitle('');
      setDescription('');
      setCategory('Bridal Lehenga');
      setBrand('Sabyasachi Heritage');
      setCustomBrand('');
      setSize('M');
      setColor('Royal Crimson Red');
      setColorHex('#8b0000');
      setCondition('Like New (Worn Once)');
      setListingType('both');
      setRentPrice('3500');
      setSalePrice('65000');
      setDeposit('6000');
      setRetailPrice('180000');
      setFabric('Raw Silk & Hand Zardozi');
      setCity(user.city || 'Mumbai');
      setState(user.state || 'Maharashtra');
      setImages([SAMPLE_PHOTO_PRESETS[0]]);
      setShowMeasurements(false);
      setFormError(null);
    }
  }, [editingProduct, activeModal, user]);

  if (activeModal !== 'upload' && !editingProduct) return null;

  const handleClose = () => {
    setActiveModal(null);
    setEditingProduct(null);
    setFormError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setCompressionInfo(null);
    setFormError(null);
    try {
      const newImages: string[] = [];
      let totalOriginal = 0;
      let totalCompressed = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateImageFile(file);
        if (!validation.valid) {
          showToast(validation.error || 'Invalid image file', 'error');
          continue;
        }

        const result = await compressImage(file, 1200, 1600, 0.82);
        newImages.push(result.dataUrl);
        totalOriginal += result.originalSizeKB;
        totalCompressed += result.compressedSizeKB;
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
        const savings = totalOriginal > 0 ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100) : 0;
        setCompressionInfo(
          `Compressed ${newImages.length} image(s): ${totalOriginal} KB → ${totalCompressed} KB (${savings}% size reduction for ultra-fast browsing)`
        );
      }
    } catch (err) {
      console.error('Image compression failed', err);
      showToast('Could not process image. Please try another.', 'error');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddImagePreset = (url: string) => {
    if (!images.includes(url)) {
      setImages([...images, url]);
      setFormError(null);
    }
  };

  const handleAddCustomImageUrl = () => {
    if (customImageUrl.trim() && !images.includes(customImageUrl)) {
      setImages([...images, customImageUrl.trim()]);
      setCustomImageUrl('');
      setFormError(null);
    }
  };

  const handleRemoveImage = (idx: number) => {
    if (images.length === 1) {
      showToast('At least one outfit image is required.', 'info');
      return;
    }
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSetMainImage = (idx: number) => {
    if (idx === 0) return;
    const selected = images[idx];
    const rest = images.filter((_, i) => i !== idx);
    setImages([selected, ...rest]);
    showToast('Cover photo updated', 'info');
  };

  const handleGenerateLuxuryDescription = () => {
    setIsGeneratingDesc(true);
    setTimeout(() => {
      const brandToUse = (brand === 'Other' ? customBrand : brand) || 'Couture House';
      setDescription(
        `Exquisite handcrafted ${category} from ${brandToUse} in enchanting ${color}. Masterfully woven in pure ${fabric} with intricate zardozi, pita work, and crystal borders. In ${condition.toLowerCase()} condition, professionally sanitized and stored in protective bridal garment bag. Includes double dupatta styling and expandable side margin allowances.`
      );
      setIsGeneratingDesc(false);
      showToast('AI Luxury description generated ✨', 'success');
    }, 600);
  };

  const handleAutoRecommendDeposit = () => {
    const rentNum = Number(rentPrice) || 3000;
    const recommended = Math.round(rentNum * 1.8);
    setDeposit(recommended.toString());
    showToast(`Recommended security deposit set: ₹${recommended.toLocaleString('en-IN')}`, 'info');
  };

  const toggleDeliveryOption = (opt: string) => {
    if (deliveryOptions.includes(opt)) {
      if (deliveryOptions.length === 1) return;
      setDeliveryOptions(deliveryOptions.filter(o => o !== opt));
    } else {
      setDeliveryOptions([...deliveryOptions, opt]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form Validations
    if (!title.trim() || title.trim().length < 5) {
      setFormError('Please provide a descriptive title (at least 5 characters).');
      return;
    }

    if (images.length === 0) {
      setFormError('Please upload or select at least 1 high-resolution outfit photo.');
      return;
    }

    const rentPriceNum = Number(rentPrice);
    if (listingType !== 'buy' && (!rentPriceNum || rentPriceNum <= 0)) {
      setFormError('Please enter a valid daily rental price greater than ₹0.');
      return;
    }

    const salePriceNum = Number(salePrice);
    if (listingType !== 'rent' && (!salePriceNum || salePriceNum <= 0)) {
      setFormError('Please enter a valid selling price greater than ₹0.');
      return;
    }

    const depositNum = Number(deposit);
    if (listingType !== 'buy' && (!depositNum || depositNum < 0)) {
      setFormError('Please enter a valid security deposit amount.');
      return;
    }

    setIsSubmitting(true);

    const finalBrand = (brand === 'Other' ? customBrand.trim() : brand) || 'BGK Signature';

    (async () => {
      try {
        let finalImages = images;
        // Upload newly added base64 or blob data URLs to Firebase Storage
        const hasDataUrls = images.some((img) => img.startsWith('data:') || img.startsWith('blob:'));
        if (hasDataUrls) {
          finalImages = await uploadMultipleListingImages(images, user.id);
        }

        const productPayload: Partial<Product> = {
          title: title.trim(),
          description: description.trim() || `Exquisite handcrafted ${category} from ${finalBrand}. Condition: ${condition}.`,
          category,
          brand: finalBrand,
          size,
          color,
          colorHex,
          condition,
          listingType,
          rentPricePerDay: listingType !== 'buy' ? rentPriceNum : 0,
          salePrice: listingType !== 'rent' && salePriceNum ? salePriceNum : undefined,
          securityDeposit: listingType !== 'buy' ? depositNum : 0,
          originalRetailPrice: Number(retailPrice) || (listingType === 'rent' ? rentPriceNum * 15 : salePriceNum * 1.5),
          images: finalImages,
          city,
          state,
          fabric: fabric.trim() || 'Pure Silk & Zardozi',
          availableFrom,
          availableTo,
          measurements: showMeasurements ? {
            bust,
            waist,
            length,
            hip,
            alterationMargin
          } : { alterationMargin: '2-3 inches side margin available' },
          occasion: ['Wedding Ceremony', 'Reception', 'Sangeet & Mehendi']
        };

        if (isEditing && editingProduct) {
          const updated = updateProduct(editingProduct.id, productPayload);
          if (updated) {
            setSelectedProduct(updated);
          }
        } else {
          const created = addProduct(productPayload);
          setSelectedProduct(created);
        }

        handleClose();
      } catch (err: any) {
        console.error('Failed to submit listing:', err);
        setFormError(err.message || 'Failed to save listing. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 bg-[#111] border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-inner">
              {isEditing ? <Sparkles className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-light text-white">
                  {isEditing ? 'Edit Outfit Listing' : 'List Wedding / Couture Outfit'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                  {isEditing ? 'Editing Mode' : 'Free Listing'}
                </span>
              </div>
              <p className="text-[11px] text-white/50">
                {isEditing ? 'Update pricing, availability dates, or imagery' : 'Earn direct rental income with verified buyers and 0% platform commission'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-8 space-y-7 no-scrollbar">
          
          {/* Error Banner if any */}
          {formError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Photos & HD Gallery */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Outfit Photos & High-Res Gallery</span>
                <span className="text-white/40 font-normal">({images.length} uploaded)</span>
              </label>
              <span className="text-[11px] text-white/40">First photo is your Cover photo</span>
            </div>

            {/* Device File Upload & Camera */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="px-4 py-2.5 rounded-2xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Compressing & Optimizing...</span>
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4" />
                    <span>Upload Device Photos / Camera</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-white/40">Auto-compressed for high-speed browsing</span>
            </div>

            {compressionInfo && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{compressionInfo}</span>
              </div>
            )}

            {/* Current Images Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group bg-black">
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Top Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded-full bg-red-600 text-white cursor-pointer hover:scale-110 transition-transform"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(idx)}
                        className="w-full py-1 rounded bg-black/80 text-[#D4AF37] text-[10px] font-bold hover:bg-black cursor-pointer text-center"
                      >
                        Set as Cover
                      </button>
                    )}
                  </div>

                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-2 py-0.5 rounded-full bg-black/80 text-[#D4AF37] text-[9px] font-black border border-[#D4AF37]/40 shadow">
                      ★ COVER
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Paste Custom Image URL */}
            <div className="flex gap-2 pt-1">
              <input
                type="url"
                placeholder="Or paste external photo link (Unsplash, Pinterest, Cloud storage)..."
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                className="flex-1 bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomImageUrl}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                + Add Link
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div>
              <p className="text-[11px] text-white/50 mb-1.5">Quick sample bridal & groom photography presets:</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {SAMPLE_PHOTO_PRESETS.map((pUrl, i) => (
                  <img
                    key={i}
                    src={pUrl}
                    alt="Preset"
                    onClick={() => handleAddImagePreset(pUrl)}
                    className="w-14 h-16 rounded-xl object-cover cursor-pointer border border-white/10 hover:border-[#D4AF37] flex-shrink-0 transition-transform active:scale-95"
                    title="Click to add sample photo"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Listing Type (Rent, Buy, Both) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
              2. Listing Type (Choose Transaction Model) *
            </label>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: 'both', label: 'Rent & Sell (Both)', sub: 'Maximize earnings' },
                { id: 'rent', label: 'Rent Only', sub: 'Retain wardrobe' },
                { id: 'buy', label: 'Sell / Purchase Only', sub: 'Permanent transfer' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setListingType(m.id as ListingType)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    listingType === m.id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-lg'
                      : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold block">{m.label}</span>
                  <span className="text-[10px] text-white/40 mt-0.5">{m.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Identity & Categorization */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
              3. Outfit Identity & Classification
            </label>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] text-white/60">Outfit Title *</label>
                <span className="text-[10px] text-white/40">{title.length}/100</span>
              </div>
              <input
                type="text"
                maxLength={100}
                placeholder="e.g. Sabyasachi Royal Crimson Velvet Heritage Bridal Lehenga with Double Dupatta"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OutfitCategory)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {CATEGORIES_DATA.map((c) => (
                    <option key={c.name} value={c.name} className="bg-[#111] text-white">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Designer House / Brand *</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {BRANDS_LIST.map((b) => (
                    <option key={b} value={b} className="bg-[#111] text-white">{b}</option>
                  ))}
                  <option value="Other" className="bg-[#111] text-white">Other / Custom Boutique</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Size Availability *</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as OutfitSize)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Custom Fit'].map((s) => (
                    <option key={s} value={s} className="bg-[#111] text-white">{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {brand === 'Other' && (
              <div className="animate-in fade-in">
                <label className="text-[11px] text-white/60 block mb-1">Enter Custom Designer / Boutique Name *</label>
                <input
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="e.g. Shyamal & Bhumika or Local Artisan Atelier"
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Color Palette & Custom Color */}
            <div className="space-y-2">
              <label className="text-[11px] text-white/60 block">Color & Palette Pick</label>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setColor(c.name);
                      setColorHex(c.hex);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      color === c.name
                        ? 'border-[#D4AF37] bg-white/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Or custom color (e.g. Pastel Rose Gold Lavender)"
                className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Condition & Wear Status *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as OutfitCondition)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="Brand New" className="bg-[#111] text-white">Brand New (Unworn with Tags)</option>
                  <option value="Like New (Worn Once)" className="bg-[#111] text-white">Like New (Worn Once for Photoshoot/Event)</option>
                  <option value="Gently Used" className="bg-[#111] text-white">Gently Used (Minor dry-cleaned wear)</option>
                  <option value="Vintage Mint" className="bg-[#111] text-white">Vintage Mint (Archival Heritage)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Fabric & Craft Technique</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. Pure Mulberry Silk & Hand Zardozi"
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Fabric Chips */}
            <div className="flex flex-wrap gap-1.5">
              {FABRIC_SUGGESTIONS.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFabric(f)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[10px] border border-white/5 transition-colors cursor-pointer"
                >
                  + {f}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: AI Luxury Copywriter & Detailed Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                4. Description & Styling Details
              </label>
              <button
                type="button"
                onClick={handleGenerateLuxuryDescription}
                disabled={isGeneratingDesc}
                className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingDesc ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Writing Luxury Copy...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>AI Luxury Copywriter</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight embroidery, can-can volume, blouse padding, latkans, dupatta drapes, and dry-clean status..."
              className="w-full bg-[#111] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Section 5: Pricing & Security Deposit */}
          <div className="space-y-3.5">
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
              5. Pricing, Security Deposit & Retail Value
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {listingType !== 'buy' && (
                <div>
                  <label className="text-[11px] text-white/60 block mb-1">Daily Rental Price (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-white/40">₹</span>
                    <input
                      type="number"
                      value={rentPrice}
                      onChange={(e) => setRentPrice(e.target.value)}
                      placeholder="3500"
                      className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-7 pr-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {listingType !== 'rent' && (
                <div>
                  <label className="text-[11px] text-white/60 block mb-1">Direct Purchase Price (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-white/40">₹</span>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="65000"
                      className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-7 pr-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      required={listingType === 'buy'}
                    />
                  </div>
                </div>
              )}

              {listingType !== 'buy' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] text-white/60">Security Deposit (₹) *</label>
                    <button
                      type="button"
                      onClick={handleAutoRecommendDeposit}
                      className="text-[10px] text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      Recommend
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-white/40">₹</span>
                    <input
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      placeholder="6000"
                      className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-7 pr-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Original Retail Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-white/40">₹</span>
                  <input
                    type="number"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(e.target.value)}
                    placeholder="180000"
                    className="w-full bg-[#111] border border-white/10 rounded-xl py-2.5 pl-7 pr-3 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-white/60 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Direct Handover Security:</strong> Security deposit is agreed directly between buyer and seller and refunded upon safe return inspection.
              </span>
            </div>
          </div>

          {/* Section 6: Location & Handover */}
          <div className="space-y-3.5">
            <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
              6. Seller Location, Availability Window & Handover Options
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">City Location *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  {CITIES_LIST.filter(c => c !== 'All Cities').map((c) => (
                    <option key={c} value={c} className="bg-[#111] text-white">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Pincode / Local Area</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="400050"
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Date Window */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] text-white/60 block mb-1">Available For Rent From</label>
                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/60 block mb-1">Available Until</label>
                <input
                  type="date"
                  value={availableTo}
                  onChange={(e) => setAvailableTo(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Handover Methods */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] text-white/60 block">Supported Handover & Pickup Arrangements</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Direct Seller Handover',
                  'Local Boutique / Home Pickup',
                  'Mutual Meetup in City'
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleDeliveryOption(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      deliveryOptions.includes(opt)
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${deliveryOptions.includes(opt) ? 'opacity-100' : 'opacity-0'}`} />
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 7: Measurements & Fitting Customization (Collapsible) */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#111]/50">
            <button
              type="button"
              onClick={() => setShowMeasurements(!showMeasurements)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-bold text-[#D4AF37] hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#D4AF37]" />
                <span>7. Specific Measurements & Alteration Margins (Optional)</span>
              </div>
              {showMeasurements ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMeasurements && (
              <div className="p-5 pt-0 space-y-3 border-t border-white/5 animate-in fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Bust / Chest</label>
                    <input
                      type="text"
                      value={bust}
                      onChange={(e) => setBust(e.target.value)}
                      placeholder="36 in"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Waist</label>
                    <input
                      type="text"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      placeholder="30 in"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Length</label>
                    <input
                      type="text"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="42 in"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-white/50 block mb-1">Hip</label>
                    <input
                      type="text"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      placeholder="38 in"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-white/50 block mb-1">Alteration Margin Note</label>
                  <input
                    type="text"
                    value={alterationMargin}
                    onChange={(e) => setAlterationMargin(e.target.value)}
                    placeholder="e.g. 2-3 inches expandable seam allowance inside blouse and lehenga waist"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-4 rounded-full bg-[#D4AF37] text-black font-bold uppercase tracking-wider text-xs sm:text-sm hover:brightness-110 flex items-center justify-center gap-2 shadow-2xl cursor-pointer disabled:opacity-50 transition-all"
              id="publish-outfit-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditing ? 'Saving Changes...' : 'Publishing Outfit...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isEditing ? 'Save & Update Listing' : 'Publish Outfit to BGK WEAR'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
