import { ArrowRight } from 'lucide-react';

const categories = [
  {
    title: 'Ladies Handbags',
    description: 'Luxury & designer collections',
    emoji: '👜',
    gradient: 'from-pink-500 to-rose-500',
    bgLight: 'bg-pink-50',
    count: '2,400+ items',
  },
  {
    title: 'Ladies Clothing',
    description: 'Dresses, tops & more',
    emoji: '👗',
    gradient: 'from-purple-500 to-violet-500',
    bgLight: 'bg-purple-50',
    count: '5,200+ items',
  },
  {
    title: "Men's Sneakers",
    description: 'Trending kicks & sportswear',
    emoji: '👟',
    gradient: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    count: '1,800+ items',
  },
  {
    title: 'Gadgets & Accessories',
    description: 'Tech, watches & more',
    emoji: '⌚',
    gradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    count: '3,100+ items',
  },
  {
    title: 'Kids Toys',
    description: 'Fun & educational toys',
    emoji: '🧸',
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    count: '1,500+ items',
  },
];

export function Categories() {
  return (
    <section id="categories" className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm tracking-wider uppercase mb-3">
            Browse by Category
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Shop What You Love
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Explore our curated collections across five trending categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <a
              key={cat.title}
              href="#products"
              className={`group relative overflow-hidden rounded-3xl p-8 ${cat.bgLight} border border-white/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-3">
                  <span className="text-5xl">{cat.emoji}</span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800">
                    {cat.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{cat.description}</p>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {cat.count}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 shadow-lg`}
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Decorative circle */}
              <div
                className={`absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-gradient-to-br ${cat.gradient} opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
