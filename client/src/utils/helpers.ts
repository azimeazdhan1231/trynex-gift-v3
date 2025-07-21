export const formatPrice = (price: string | number, currency = '৳'): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `${currency}${num.toLocaleString()}`;
};

export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('trynex_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('trynex_session_id', sessionId);
  }
  return sessionId;
};

export const calculateDeliveryFee = (district: string, total: number): number => {
  // Free delivery for orders above 1500
  if (total >= 1500) return 0;
  
  // Different rates based on district
  const dhakaDistricts = ['ঢাকা', 'গাজীপুর', 'নারায়ণগঞ্জ'];
  if (dhakaDistricts.includes(district)) {
    return 60;
  }
  
  return 120;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+?88)?01[3-9]\d{8}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatOrderId = (orderId: string): string => {
  return orderId.toUpperCase();
};

export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'text-yellow-500';
    case 'confirmed':
      return 'text-blue-500';
    case 'processing':
      return 'text-orange-500';
    case 'shipped':
      return 'text-purple-500';
    case 'delivered':
      return 'text-green-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getOrderStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'অপেক্ষায়';
    case 'confirmed':
      return 'নিশ্চিত';
    case 'processing':
      return 'প্রস্তুত হচ্ছে';
    case 'shipped':
      return 'পাঠানো হয়েছে';
    case 'delivered':
      return 'ডেলিভার হয়েছে';
    case 'cancelled':
      return 'বাতিল';
    default:
      return status;
  }
};

export const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const openWhatsApp = (message?: string) => {
  const baseUrl = 'https://wa.me/8801940689487';
  const encodedMessage = message ? encodeURIComponent(message) : '';
  const url = encodedMessage ? `${baseUrl}?text=${encodedMessage}` : baseUrl;
  window.open(url, '_blank');
};

export const copyToClipboard = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch(() => resolve(false));
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        resolve(true);
      } catch (err) {
        resolve(false);
      }
      document.body.removeChild(textArea);
    }
  });
};
