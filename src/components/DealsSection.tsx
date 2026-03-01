import { useState, useEffect } from 'react';
import { Clock, Flame, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const dealProducts = [
  {
    id: 101,
    name: 'Premium Leather Clutch',
    price: 77.99,
    originalPrice: 129.99,
    category: 'Handbags',
    rating: 4.8,
    reviews: 324,
    emoji: '👜',
    gradient: 'from-pink-100 to-rose-100',
  },
  {
    id: 102,
    name: 'Urban Street Runner',
    price: 111.99,
    originalPrice: 159.99,
    category: 'Sneakers',
    rating: 4.9,
    reviews: 542,
    emoji: '👟',
    gradient: 'from-blue-100 to-indigo-100',
  },
  {
    id: 103,
    name: 'Noise-Cancel Headphones',
    price: 149.99,
    originalPrice: 199.99,
    category: 'Gadgets',
    rating: 4.8,
    reviews: 876,
    emoji: '🎧',
    gradient: 'from-emerald-100 to-teal-100',
  },
];

export function DealsSection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const handleAddDeal = (index: number) => {
    const product = dealProducts[index];
    addToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const deals = [
    {
      title: 'Premium Leather Collection',
      subtitle: 'Ladies Handbags',
      discount: '40% OFF',
      emoji: '👜',
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50',
      price: '$77.99',
      originalPrice: '$129.99',
    },
    {
      title: 'Summer Streetwear',
      subtitle: "Men's Sneakers",
      discount: '30% OFF',
      emoji: '👟',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      price: '$111.99',
      originalPrice: '$159.99',
    },
    {
      title: 'Tech Essentials Bundle',
      subtitle: 'Gadgets & Accessories',
      discount: '25% OFF',
      emoji: '🎧',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      price: '$149.99',
      originalPrice: '$199.99',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-brand-900 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Flame className="w-4 h-4" />
            Limited Time Only
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Flash Deals & Offers
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            Grab these deals before they're gone!
          </p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Clock className="w-5 h-5 text-brand-400" />
            <div className="flex gap-3">
              {[
                { value: pad(timeLeft.hours), label: 'HRS' },
                { value: pad(timeLeft.minutes), label: 'MIN' },
                { value: pad(timeLeft.seconds), label: 'SEC' },
              ].map((t, i) => (
                <div key={i} className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[64px] border border-white/10">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                      {t.value}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 font-semibold tracking-widest">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal, index) => {
            const justAdded = addedIds.has(dealProducts[index].id);
            return (
              <div
                key={deal.title}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${deal.bgGradient} p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500`}
              >
                <div className="space-y-4">
                  <span className="text-6xl">{deal.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{deal.subtitle}</p>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{deal.title}</h3>
                  </div>
                  <div
                    className={`inline-block bg-gradient-to-r ${deal.gradient} text-white text-2xl font-extrabold px-5 py-2 rounded-xl`}
                  >
                    {deal.discount}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-extrabold text-gray-900">{deal.price}</span>
                    <span className="text-base text-gray-400 line-through">{deal.originalPrice}</span>
                  </div>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleAddDeal(index)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md ${
                        justAdded
                          ? 'bg-emerald-500 text-white shadow-emerald-200'
                          : 'bg-gray-900 text-white hover:bg-gray-800 shadow-gray-300'
                      }`}
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 group-hover:text-brand-600 transition-colors cursor-pointer">
                      Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                <div
                  className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${deal.gradient} opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
