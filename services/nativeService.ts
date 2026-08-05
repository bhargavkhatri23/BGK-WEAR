import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { App as CapApp } from '@capacitor/app';

/**
 * Checks if running natively inside the Android (or iOS) Capacitor container
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Initialize native device UI features upon startup
 */
export const initNativeApp = async (): Promise<void> => {
  if (!isNativePlatform()) return;

  try {
    // Style native status bar with BGK WEAR dark theme
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#050505' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (err) {
    console.debug('StatusBar setup notice:', err);
  }

  try {
    // Hide splash screen smoothly
    await SplashScreen.hide({ fadeOutDuration: 400 });
  } catch (err) {
    console.debug('SplashScreen notice:', err);
  }

  try {
    // Register native hardware back button listener
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        // Confirm or minimize
        CapApp.minimizeApp();
      }
    });
  } catch (err) {
    console.debug('BackButton setup notice:', err);
  }
};

/**
 * Trigger light haptic feedback on interactive buttons
 */
export const triggerHaptic = async (style: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const impact =
      style === 'heavy'
        ? ImpactStyle.Heavy
        : style === 'medium'
        ? ImpactStyle.Medium
        : ImpactStyle.Light;
    await Haptics.impact({ style: impact });
  } catch {
    // Silently continue if haptics unavailable
  }
};

/**
 * Trigger success/error notification haptic
 */
export const triggerNotificationHaptic = async (type: 'success' | 'warning' | 'error' = 'success'): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const notifType =
      type === 'error'
        ? NotificationType.Error
        : type === 'warning'
        ? NotificationType.Warning
        : NotificationType.Success;
    await Haptics.notification({ type: notifType });
  } catch {
    // Silently continue
  }
};

/**
 * Native Share dialog for outfits and collections
 */
export const nativeShare = async (title: string, text: string, url?: string): Promise<boolean> => {
  if (isNativePlatform()) {
    try {
      await Share.share({
        title,
        text,
        url: url || window.location.href,
        dialogTitle: 'Share Luxury Outfit'
      });
      return true;
    } catch {
      return false;
    }
  }

  // Fallback to Web Share API or clipboard
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: url || window.location.href });
      return true;
    } catch {
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(`${title} - ${text} ${url || window.location.href}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Pick or take photo using Native Camera / Gallery plugin with fallback to HTML file input
 */
export const captureOrPickPhoto = async (): Promise<string | null> => {
  if (isNativePlatform()) {
    try {
      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt // Prompts user: Camera or Photos
      });
      return image.dataUrl || null;
    } catch (err) {
      console.warn('Native camera cancelled or error:', err);
      return null;
    }
  }
  return null;
};

/**
 * Open WhatsApp directly with telephone number and prefilled message
 */
export const openWhatsApp = (phone: string, text: string): void => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
};

/**
 * Open phone dialer directly
 */
export const openPhoneDialer = (phone: string): void => {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  window.location.href = `tel:${cleanPhone}`;
};
