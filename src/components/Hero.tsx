import { ArrowRight, Star, TrendingUp, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-purple-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-brand-100/80 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              New Collection 2025
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="text-gray-900">Discover Your</span>
              <br />
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-purple-500 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-lg leading-relaxed">
              From luxury handbags to trendy sneakers, cutting-edge gadgets to kids' favorites — everything you love, all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-300 hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold text-sm border border-gray-200 hover:border-brand-300 hover:text-brand-600 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              >
                Explore Categories
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[
                  'bg-gradient-to-br from-pink-400 to-rose-500',
                  'bg-gradient-to-br from-blue-400 to-indigo-500',
                  'bg-gradient-to-br from-green-400 to-emerald-500',
                  'bg-gradient-to-br from-amber-400 to-orange-500',
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="font-semibold text-gray-700">50K+</span> happy customers
                </p>
              </div>
            </div>
          </div>

          {/* Right — Hero Visual */}
          <div className="relative animate-fade-in-up delay-200" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Main image placeholder */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-purple-500 rounded-[3rem] rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-300 to-purple-400 rounded-[3rem] -rotate-3 opacity-10" />
                <div className="relative bg-gradient-to-br from-brand-100 to-purple-100 rounded-[3rem] overflow-hidden h-full flex items-center justify-center">
                  <div className="text-center p-8 space-y-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-brand-400 to-purple-500 rounded-3xl flex items-center justify-center animate-float shadow-2xl shadow-brand-300/50">
                      <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">Trending Now</p>
                      <p className="text-gray-500 mt-1">2025 Collection</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sales Today</p>
                  <p className="text-sm font-bold text-gray-800">+2,450</p>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-sm font-bold text-gray-800">4.9/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative border-t border-gray-100 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '10K+', label: 'Products Available' },
              { value: '99%', label: 'Satisfaction Rate' },
              { value: '24/7', label: 'Customer Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
