import { useEffect, useState } from 'react';
import { supabase, subscribeToTable, unsubscribe } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeSubscription = (table: string, queryKeys: string[][]) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const subscription = subscribeToTable(table, (payload) => {
      console.log(`Real-time update for ${table}:`, payload);
      
      // Invalidate relevant queries
      queryKeys.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey });
      });
      
      // Show notification for new orders in admin
      if (table === 'orders' && payload.eventType === 'INSERT') {
        // Could add toast notification here
      }
    });

    // Check connection status
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('products').select('id').limit(1);
        setIsConnected(!error);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();

    return () => {
      unsubscribe(subscription);
    };
  }, [table, queryClient, queryKeys]);

  return { isConnected };
};

export const useProductsRealtime = () => {
  return useRealtimeSubscription('products', [
    ['/api/products'],
    ['/api/products', 'featured']
  ]);
};

export const useOrdersRealtime = () => {
  return useRealtimeSubscription('orders', [
    ['/api/orders']
  ]);
};

export const useCartRealtime = () => {
  return useRealtimeSubscription('cart_items', [
    ['/api/cart']
  ]);
};
