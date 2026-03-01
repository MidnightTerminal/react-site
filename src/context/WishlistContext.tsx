import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Product } from './CartContext';

interface WishlistContextType {
  wishlistItems: Product[];
  isWishlistOpen: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlistItem: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const addToWishlist = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const toggleWishlistItem = useCallback((product: Product) => {
    setWishlistItems((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => wishlistItems.some((p) => p.id === productId),
    [wishlistItems]
  );

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);
  const toggleWishlist = useCallback(() => setIsWishlistOpen((p) => !p), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isWishlistOpen,
        addToWishlist,
        removeFromWishlist,
        toggleWishlistItem,
        isInWishlist,
        openWishlist,
        closeWishlist,
        toggleWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
