import { Link } from 'react-router-dom';
import { ShoppingBag, Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const shopLinks = [
  { label: 'Handbags', to: '/handbags' },
  { label: 'Ladies Clothing', to: '/clothing' },
  { label: "Men's Sneakers", to: '/sneakers' },
  { label: 'Gadgets & Accessories', to: '/gadgets' },
  { label: 'Kids Toys', to: '/kids' },
  { label: 'New Arrivals', to: '/' },
];

const footerLinks = {
  Shop: ['Handbags', 'Ladies Clothing', "Men's Sneakers", 'Gadgets & Accessories', 'Kids Toys', 'New Arrivals'],
  Company: ['About Us', 'Careers', 'Press', 'Blog', 'Affiliate Program'],
  Support: ['Help Center', 'Contact Us', 'Shipping Info', 'Returns & Exchanges', 'Size Guide', 'Track Order'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
};

const socials = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Youtube, label: 'Youtube' },
];

const paymentMethods = ['Visa', 'MC', 'Amex', 'PayPal', 'Apple'];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">ShopVibe</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for fashion, tech, and lifestyle products. Shop confidently with our quality guarantee.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>123 Fashion Ave, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>hello@shopvibe.com</span>
              </div>
            </div>

            <div className="flex gap-3">
              {socials.map((s) => (
                <button
                  key={s.label}
                  className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-brand-600 transition-colors duration-300"
                  aria-label={s.label}
                >
                  <s.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop links with router */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other links */}
          {Object.entries(footerLinks)
            .filter(([heading]) => heading !== 'Shop')
            .map(([heading, links]) => (
              <div key={heading}>
                <h4 className="font-bold text-white mb-5 text-sm">{heading}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-400 hover:text-brand-400 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 ShopVibe. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm}
                className="w-12 h-8 bg-gray-800 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-400"
              >
                {pm}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
