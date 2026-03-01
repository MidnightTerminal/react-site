import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Check,
  ChevronRight,
  TruckIcon,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Share2,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { AddToCartToast } from '../components/AddToCartToast';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { allProducts } from '../data/products';

export function ProductDetailPage() {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === Number(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <CartDrawer />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <span className="text-6xl block mb-6">😕</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Product Not Found</h1>
          <p className="text-gray-500 mb-8">Sorry, we couldn't find the product you're looking for.</p>
          <Link
            to="/"
            className="bg-brand-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const categoryPath =
    product.category === 'Handbags' ? '/handbags'
    : product.category === 'Clothing' ? '/clothing'
    : product.category === 'Sneakers' ? '/sneakers'
    : product.category === 'Gadgets' ? '/gadgets'
    : product.category === 'Kids' ? '/kids'
    : '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CartDrawer />
      <AddToCartToast />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={categoryPath} className="hover:text-brand-600 transition-colors">{product.category}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Product Image */}
            <div className={`relative bg-gradient-to-br ${product.gradient} flex items-center justify-center min-h-[400px] lg:min-h-[550px]`}>
              <span className="text-[10rem] animate-float">{product.emoji}</span>
              {product.badge && (
                <span className={`absolute top-6 left-6 ${product.badgeColor} text-white text-sm font-bold px-4 py-1.5 rounded-xl`}>
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-6 right-6 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <p className="text-sm font-semibold text-brand-600 uppercase tracking-widest mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-8">
                <span className="text-4xl font-extrabold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                    <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-lg">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed mb-8">
                This premium {product.name.toLowerCase()} combines style and functionality. 
                Crafted with the finest materials for lasting quality. Perfect for any occasion, 
                this piece is a must-have addition to your collection.
              </p>

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-500 hover:text-brand-600 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-500 hover:text-brand-600 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                    justAdded
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                      : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200 hover:-translate-y-0.5'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart — ${(product.price * quantity).toFixed(2)}
                    </>
                  )}
                </button>
              </div>

              {/* Wishlist & Share */}
              <div className="flex items-center gap-3 mb-8">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                    liked
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Saved' : 'Wishlist'}
                </button>
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-brand-200 hover:text-brand-600 transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <TruckIcon className="w-5 h-5 text-brand-600 mb-1.5" />
                  <span className="text-[11px] font-semibold text-gray-700">Free Shipping</span>
                  <span className="text-[10px] text-gray-400">Over $50</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-brand-600 mb-1.5" />
                  <span className="text-[11px] font-semibold text-gray-700">Secure Pay</span>
                  <span className="text-[10px] text-gray-400">100% Safe</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-brand-600 mb-1.5" />
                  <span className="text-[11px] font-semibold text-gray-700">Easy Return</span>
                  <span className="text-[10px] text-gray-400">30 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Reviews */}
        <div className="mt-12">
          <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1 w-fit mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'description'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          {activeTab === 'description' ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
              <div className="prose prose-gray max-w-none text-gray-500 space-y-4">
                <p>
                  The {product.name} is a premium product carefully designed for both style and performance. 
                  Whether you're dressing up for a special occasion or keeping it casual, this item delivers 
                  unmatched quality and comfort.
                </p>
                <ul className="space-y-2">
                  <li>✅ Premium quality materials for durability</li>
                  <li>✅ Ergonomic design for maximum comfort</li>
                  <li>✅ Available in multiple colors and sizes</li>
                  <li>✅ Easy care and maintenance</li>
                  <li>✅ Eco-friendly packaging</li>
                </ul>
                <p>
                  At ShopVibe, we believe in offering products that not only look great but feel great too. 
                  Each item in our collection is hand-selected and quality-tested to ensure it meets our 
                  high standards.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-gray-900">{product.rating}</div>
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{product.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-2 ml-6">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const pct = stars === 5 ? 65 : stars === 4 ? 22 : stars === 3 ? 8 : stars === 2 ? 3 : 2;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-6">{stars}★</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sample reviews */}
              <div className="space-y-6 border-t border-gray-100 pt-8">
                {[
                  { name: 'Sarah M.', date: '2 days ago', rating: 5, text: 'Absolutely love this product! The quality exceeded my expectations. Would definitely recommend to anyone looking for a great deal.' },
                  { name: 'James L.', date: '1 week ago', rating: 4, text: 'Great product for the price. Shipping was fast and packaging was excellent. Only minor issue was sizing but customer service helped resolve it quickly.' },
                  { name: 'Emma K.', date: '2 weeks ago', rating: 5, text: 'This is my third purchase from ShopVibe and they never disappoint. The attention to detail is impressive. Will be back for more!' },
                ].map((review, idx) => (
                  <div key={idx} className="pb-6 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
