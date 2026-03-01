import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Toast {
  id: number;
  name: string;
  emoji: string;
}

export function AddToCartToast() {
  const { items } = useCart();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [prevLength, setPrevLength] = useState(0);

  useEffect(() => {
    const totalQty = items.reduce((s, i) => s + i.quantity, 0);
    if (totalQty > prevLength && items.length > 0) {
      const lastItem = items[items.length - 1];
      const toast: Toast = {
        id: Date.now(),
        name: lastItem.product.name,
        emoji: lastItem.product.emoji,
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    }
    setPrevLength(totalQty);
  }, [items, prevLength]);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-cart-pop bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 pr-5 flex items-center gap-3 min-w-[280px] max-w-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Added to cart!</p>
            <p className="text-xs text-gray-500 truncate">{toast.emoji} {toast.name}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
