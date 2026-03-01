import { useState } from 'react';
import { Send, Gift, CheckCircle } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 p-10 sm:p-16">
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Get 15% Off Your First Order
            </h2>
            <p className="text-brand-200 text-lg max-w-lg mx-auto">
              Subscribe to our newsletter for exclusive deals, new arrivals, and style tips delivered to your inbox.
            </p>

            {submitted ? (
              <div className="flex items-center justify-center gap-2 text-white bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">You're in! Check your inbox for your discount code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-brand-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-brand-50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                >
                  Subscribe
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}

            <p className="text-brand-300 text-xs">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
