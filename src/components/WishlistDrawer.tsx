import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export function WishlistDrawer() {
  const { wishlistItems, isWishlistOpen, closeWishlist, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (productId: number) => {
    const item = wishlistItems.find((p) => p.id === productId);
    if (item) {
      addToCart(item);
      removeFromWishlist(productId);
    }
  };

  const getDiscountPercent = (orig: number, curr: number) =>
    Math.round(((orig - curr) / orig) * 100);

  return (
    <>
      {/* Backdrop */}
      {isWishlistOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={closeWishlist}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Wishlist</h2>
              <p className="text-sm text-gray-500">
                {wishlistCount} item{wishlistCount !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          <button
            onClick={closeWishlist}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 text-sm mb-6">
                Save items you love by tapping the heart icon.
              </p>
              <button
                onClick={closeWishlist}
                className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 bg-gray-50 rounded-2xl p-4 group hover:bg-gray-100 transition-colors"
              >
                {/* Product image */}
                <Link
                  to={`/product/${product.id}`}
                  onClick={closeWishlist}
                  className={`w-20 h-20 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform`}
                >
                  <span className="text-3xl">{product.emoji}</span>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-brand-600 font-medium uppercase tracking-wider">
                        {product.category}
                      </p>
                      <h4 className="font-bold text-gray-900 text-sm truncate mt-0.5">
                        {product.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xs text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {getDiscountPercent(product.originalPrice, product.price)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product.id)}
                    className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Move to Cart
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white space-y-3">
            <button
              onClick={() => {
                wishlistItems.forEach((p) => addToCart(p));
                closeWishlist();
              }}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              Add All to Cart ({wishlistCount} items)
            </button>
            <p className="text-center text-xs text-gray-400">
              ❤️ Your favorites are saved here
            </p>
          </div>
        )}
      </div>
    </>
  );
}
