import { Heart, ShoppingBag, Trash2, Star, ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart, type Product } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { AddToCartToast } from '../components/AddToCartToast';

export function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach((p) => addToCart(p));
  };

  const getDiscountPercent = (orig: number, curr: number) =>
    Math.round(((orig - curr) / orig) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartDrawer />
      <WishlistDrawer />
      <AddToCartToast />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="font-medium text-gray-900">Wishlist</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 text-sm">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-brand-200"
            >
              <ShoppingBag className="w-4 h-4" />
              Add All to Cart
            </button>
          )}
        </div>

        {/* Content */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Save the items you love by tapping the heart icon on any product. They'll show up here so you can find them easily later!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistItems.map((product) => {
              const justAdded = addedIds.has(product.id);
              const discount = product.originalPrice
                ? getDiscountPercent(product.originalPrice, product.price)
                : 0;
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className={`relative bg-gradient-to-br ${product.gradient} p-10 flex items-center justify-center min-h-[280px] sm:min-h-[300px] block`}
                  >
                    <span className="text-8xl sm:text-9xl group-hover:scale-110 transition-transform duration-500">
                      {product.emoji}
                    </span>
                    {discount > 0 && (
                      <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                        {discount}% OFF
                      </span>
                    )}
                    {product.isNew && !product.originalPrice && (
                      <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                        New
                      </span>
                    )}
                    {/* Remove btn */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(product.id);
                      }}
                      className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 text-red-500 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs font-medium text-brand-600 uppercase tracking-wider">
                      {product.category}
                    </p>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          justAdded
                            ? 'bg-emerald-500 text-white shadow-emerald-200'
                            : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200'
                        }`}
                      >
                        {justAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
