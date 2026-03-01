const brands = [
  'Nike', 'Adidas', 'Gucci', 'Prada', 'Apple', 'Samsung', 'Louis Vuitton', 'Zara',
  'H&M', 'Chanel', 'LEGO', 'Sony', 'Coach', 'Michael Kors', 'New Balance',
];

export function BrandsMarquee() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
          Trusted by Top Brands
        </p>
      </div>
      <div className="relative">
        <div className="flex gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="text-2xl font-extrabold text-gray-200 hover:text-brand-400 transition-colors duration-300 cursor-default select-none flex-shrink-0"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
