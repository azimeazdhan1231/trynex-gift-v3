
import { DISTRICTS, DELIVERY_ZONES, ORDER_STATUSES } from "./constants";

// Price formatting
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `৳${numPrice.toLocaleString()}`;
};

// Delivery fee calculation
export const calculateDeliveryFee = (district: string, subtotal: number): number => {
  const isDhaka = district === "ঢাকা";
  const zone = isDhaka ? DELIVERY_ZONES.dhaka : DELIVERY_ZONES.outside;
  
  if (subtotal >= zone.freeAbove) {
    return 0;
  }
  
  return zone.fee;
};

// Phone number validation
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Order status utilities
export const getOrderStatusColor = (status: string): string => {
  const statusObj = ORDER_STATUSES.find(s => s.value === status);
  return statusObj?.color || "bg-gray-500";
};

export const getOrderStatusText = (status: string, inBengali: boolean = false): string => {
  const statusObj = ORDER_STATUSES.find(s => s.value === status);
  return statusObj ? (inBengali ? statusObj.labelBn : statusObj.label) : status;
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const formatDateBengali = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

// URL utilities
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Image utilities
export const getImageUrl = (path: string): string => {
  if (path.startsWith("http")) return path;
  return `https://images.unsplash.com/photo-${path}`;
};

// Session ID generation
export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Local storage utilities
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem("trynex_session_id");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("trynex_session_id", sessionId);
  }
  return sessionId;
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

// WhatsApp utilities
export const openWhatsApp = (phone: string, message?: string): void => {
  const formattedPhone = phone.startsWith("+") ? phone.substring(1) : phone;
  const encodedMessage = message ? encodeURIComponent(message) : "";
  const url = `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ""}`;
  window.open(url, "_blank");
};

// Order tracking message
export const generateOrderTrackingMessage = (orderId: string): string => {
  return `Hello! I want to track my order. Order ID: ${orderId}`;
};

// Payment confirmation message
export const generatePaymentMessage = (orderId: string, amount: number): string => {
  return `Payment completed for Order ID: ${orderId}. Amount: ${formatPrice(amount)}. Please confirm.`;
};

// District validation
export const isValidDistrict = (district: string): boolean => {
  return DISTRICTS.includes(district);
};

// Promo code utilities
export const calculateDiscount = (
  subtotal: number,
  discountType: "percentage" | "fixed",
  discountValue: number
): number => {
  if (discountType === "percentage") {
    return (subtotal * discountValue) / 100;
  }
  return Math.min(discountValue, subtotal);
};

// Search utilities
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

// Product utilities
export const getProductUrl = (id: number, name: string): string => {
  return `/products/${id}/${generateSlug(name)}`;
};

// File upload utilities
export const validateImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

// Error handling
export const getErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return "An unexpected error occurred";
};

// Loading states
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Analytics
export const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
  // Add analytics tracking here if needed
  console.log(`Event: ${eventName}`, properties);
};
