import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MapPin,
  Package,
} from 'lucide-react';

export function CheckoutPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const shipping = totalPrice >= 50 ? 0 : 4.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'ZIP code is required';
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.cardName) newErrors.cardName = 'Name on card is required';
    if (!formData.expiry) newErrors.expiry = 'Expiry is required';
    if (!formData.cvv) newErrors.cvv = 'CVV is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStep('success');
      clearCart();
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some products to your cart before checking out.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-lg animate-fade-in-up">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Order Confirmed! 🎉</h2>
          <p className="text-gray-500 mb-2">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            Order #SV-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-brand-600">
                <Package className="w-5 h-5" />
                <span className="font-medium">Processing</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-400">
                <Truck className="w-5 h-5" />
                <span>Shipping</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-200" />
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Delivered</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Estimated delivery: <span className="font-semibold text-gray-700">3–5 business days</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Back to Shop</span>
            </button>
            <a href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-200">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">
                ShopVibe
              </span>
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress steps */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">1</div>
              <span className="font-semibold text-brand-600 hidden sm:inline">Cart</span>
            </div>
            <div className="w-12 h-0.5 bg-brand-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">2</div>
              <span className="font-semibold text-brand-600 hidden sm:inline">Checkout</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-gray-400 hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left – Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* Contact */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 text-sm font-bold">@</span>
                  Contact Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInput}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600"><Truck className="w-4 h-4" /></span>
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input
                      type="text" name="firstName" value={formData.firstName} onChange={handleInput}
                      placeholder="John"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input
                      type="text" name="lastName" value={formData.lastName} onChange={handleInput}
                      placeholder="Doe"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                    <input
                      type="text" name="address" value={formData.address} onChange={handleInput}
                      placeholder="123 Main Street, Apt 4B"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <input
                      type="text" name="city" value={formData.city} onChange={handleInput}
                      placeholder="New York"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                      <input
                        type="text" name="state" value={formData.state} onChange={handleInput}
                        placeholder="NY"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.state ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP Code</label>
                      <input
                        type="text" name="zip" value={formData.zip} onChange={handleInput}
                        placeholder="10001"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.zip ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600"><CreditCard className="w-4 h-4" /></span>
                  Payment Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                    <input
                      type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInput}
                      placeholder="4242 4242 4242 4242" maxLength={19}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name on Card</label>
                    <input
                      type="text" name="cardName" value={formData.cardName} onChange={handleInput}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.cardName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                      <input
                        type="text" name="expiry" value={formData.expiry} onChange={handleInput}
                        placeholder="MM/YY" maxLength={5}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.expiry ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                      <input
                        type="text" name="cvv" value={formData.cvv} onChange={handleInput}
                        placeholder="123" maxLength={4}
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${errors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>

                {/* Payment logos */}
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
                  <span className="text-xs text-gray-400">We accept:</span>
                  {['💳 Visa', '💳 Mastercard', '💳 Amex', '📱 Apple Pay'].map((p) => (
                    <span key={p} className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right – Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>

                {/* Items */}
                <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 group">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.product.gradient} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl">{item.product.emoji}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">{item.product.category}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="w-6 h-6 rounded flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-sm text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 mt-5 pt-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                    <span className="font-medium text-gray-700">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Estimated Tax</span>
                    <span className="font-medium text-gray-700">${tax.toFixed(2)}</span>
                  </div>

                  {shipping === 0 && (
                    <div className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      You qualify for FREE shipping!
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-extrabold text-gray-900">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order */}
                <button
                  type="submit"
                  className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-200 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Shield className="w-4 h-4" />
                  Place Order — ${grandTotal.toFixed(2)}
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  🔒 256-bit SSL encrypted payment
                </p>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Truck className="w-4 h-4 text-blue-400" />
                    Fast Delivery
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CheckCircle className="w-4 h-4 text-brand-400" />
                    Guaranteed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
