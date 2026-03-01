import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Fashion Blogger',
    avatar: 'S',
    avatarBg: 'from-pink-400 to-rose-500',
    rating: 5,
    text: "The handbag collection is absolutely stunning! I've ordered three times already and the quality never disappoints. Fast shipping too!",
  },
  {
    name: 'James Rodriguez',
    role: 'Sneaker Enthusiast',
    avatar: 'J',
    avatarBg: 'from-blue-400 to-indigo-500',
    rating: 5,
    text: "Finally found a store that carries authentic sneakers at fair prices. The Air Max Retros I got are fire! Will definitely be back.",
  },
  {
    name: 'Emily Chen',
    role: 'Tech Reviewer',
    avatar: 'E',
    avatarBg: 'from-emerald-400 to-teal-500',
    rating: 5,
    text: "Great selection of gadgets and accessories. The Smart Watch Pro X exceeded my expectations. Customer service was super helpful too.",
  },
  {
    name: 'Lisa Thompson',
    role: 'Mom of Three',
    avatar: 'L',
    avatarBg: 'from-amber-400 to-orange-500',
    rating: 5,
    text: "My kids love the toys! Educational and entertaining — perfect combo. The robot kit has kept my son busy for weeks. Highly recommend!",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm tracking-wider uppercase mb-3">
            Customer Love
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            Real reviews from real shoppers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group bg-white rounded-3xl p-7 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative"
            >
              <Quote className="w-8 h-8 text-brand-100 mb-4" />

              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
