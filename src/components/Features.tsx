import { Truck, ShieldCheck, RefreshCcw, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free delivery on orders over $50. Fast and reliable worldwide shipping.',
    gradient: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: 'Your payment information is encrypted and processed securely.',
    gradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
  },
  {
    icon: RefreshCcw,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy. No questions asked.',
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our customer support team is here to help around the clock.',
    gradient: 'from-brand-500 to-purple-500',
    bgLight: 'bg-brand-50',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm tracking-wider uppercase mb-3">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Shopping Made Easy
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group text-center p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-transparent hover:border-gray-100 bg-white"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-7 h-7 text-brand-600`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
