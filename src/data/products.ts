import { type Product } from '../context/CartContext';

// Helper: badges are now computed dynamically.
// If a product has `originalPrice`, badge = "X% OFF" (red badge)
// If a product has `isNew: true`, badge = "New" (brand badge)
// Otherwise, badge can be manually set for things like "Best Seller", "Trending", etc.

function computeBadge(product: Product): Product {
  if (product.originalPrice && product.originalPrice > product.price) {
    const percent = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    return {
      ...product,
      badge: `${percent}% OFF`,
      badgeColor: 'bg-red-500',
    };
  }
  if (product.isNew) {
    return {
      ...product,
      badge: 'New',
      badgeColor: 'bg-brand-600',
    };
  }
  return product;
}

function processProducts(products: Product[]): Product[] {
  return products.map(computeBadge);
}

export const handbagProducts: Product[] = processProducts([
  { id: 101, name: 'Leather Crossbody Bag', price: 89.99, originalPrice: 129.99, category: 'Handbags', rating: 4.8, reviews: 324, emoji: '👜', gradient: 'from-pink-100 to-rose-100' },
  { id: 102, name: 'Designer Tote Bag', price: 119.99, category: 'Handbags', badge: 'Best Seller', badgeColor: 'bg-emerald-500', rating: 4.7, reviews: 256, emoji: '💼', gradient: 'from-rose-100 to-pink-100' },
  { id: 103, name: 'Mini Clutch Purse', price: 49.99, originalPrice: 69.99, category: 'Handbags', rating: 4.6, reviews: 189, emoji: '👛', gradient: 'from-fuchsia-100 to-pink-100' },
  { id: 104, name: 'Canvas Shoulder Bag', price: 65.99, category: 'Handbags', isNew: true, rating: 4.5, reviews: 112, emoji: '🎒', gradient: 'from-amber-100 to-orange-100' },
  { id: 105, name: 'Quilted Chain Bag', price: 159.99, originalPrice: 199.99, category: 'Handbags', rating: 4.9, reviews: 478, emoji: '👜', gradient: 'from-violet-100 to-purple-100' },
  { id: 106, name: 'Woven Straw Tote', price: 42.99, category: 'Handbags', rating: 4.4, reviews: 87, emoji: '🧺', gradient: 'from-yellow-100 to-amber-100' },
  { id: 107, name: 'Satin Evening Bag', price: 79.99, category: 'Handbags', badge: 'Elegant', badgeColor: 'bg-purple-500', rating: 4.7, reviews: 203, emoji: '✨', gradient: 'from-purple-100 to-violet-100' },
  { id: 108, name: 'Bucket Bag Leather', price: 95.99, originalPrice: 135.99, category: 'Handbags', rating: 4.6, reviews: 167, emoji: '👜', gradient: 'from-teal-100 to-emerald-100' },
  { id: 109, name: 'Hobo Slouchy Bag', price: 72.99, category: 'Handbags', rating: 4.5, reviews: 134, emoji: '💼', gradient: 'from-indigo-100 to-blue-100' },
  { id: 110, name: 'Envelope Clutch', price: 55.99, category: 'Handbags', isNew: true, rating: 4.3, reviews: 78, emoji: '✉️', gradient: 'from-rose-100 to-red-100' },
  { id: 111, name: 'Saddle Crossbody', price: 108.99, category: 'Handbags', badge: 'Trending', badgeColor: 'bg-orange-500', rating: 4.8, reviews: 345, emoji: '👜', gradient: 'from-orange-100 to-amber-100' },
  { id: 112, name: 'Doctor Frame Bag', price: 135.99, originalPrice: 179.99, category: 'Handbags', rating: 4.7, reviews: 212, emoji: '💼', gradient: 'from-sky-100 to-blue-100' },
]);

export const clothingProducts: Product[] = processProducts([
  { id: 201, name: 'Floral Summer Dress', price: 54.99, category: 'Clothing', isNew: true, rating: 4.7, reviews: 189, emoji: '👗', gradient: 'from-purple-100 to-violet-100' },
  { id: 202, name: 'Casual Linen Blazer', price: 74.99, category: 'Clothing', isNew: true, rating: 4.5, reviews: 98, emoji: '🧥', gradient: 'from-violet-100 to-purple-100' },
  { id: 203, name: 'Silk Blouse Top', price: 45.99, originalPrice: 65.99, category: 'Clothing', rating: 4.6, reviews: 234, emoji: '👚', gradient: 'from-pink-100 to-rose-100' },
  { id: 204, name: 'High-Waist Trousers', price: 62.99, category: 'Clothing', rating: 4.4, reviews: 156, emoji: '👖', gradient: 'from-blue-100 to-indigo-100' },
  { id: 205, name: 'Knit Cardigan Sweater', price: 58.99, originalPrice: 79.99, category: 'Clothing', rating: 4.7, reviews: 312, emoji: '🧶', gradient: 'from-amber-100 to-orange-100' },
  { id: 206, name: 'Maxi Wrap Skirt', price: 39.99, category: 'Clothing', badge: 'Trending', badgeColor: 'bg-orange-500', rating: 4.5, reviews: 145, emoji: '👗', gradient: 'from-emerald-100 to-teal-100' },
  { id: 207, name: 'Denim Jacket Classic', price: 85.99, category: 'Clothing', badge: 'Best Seller', badgeColor: 'bg-emerald-500', rating: 4.8, reviews: 567, emoji: '🧥', gradient: 'from-sky-100 to-blue-100' },
  { id: 208, name: 'Cocktail Party Dress', price: 99.99, originalPrice: 139.99, category: 'Clothing', rating: 4.9, reviews: 423, emoji: '👗', gradient: 'from-fuchsia-100 to-pink-100' },
  { id: 209, name: 'Cotton Palazzo Pants', price: 35.99, category: 'Clothing', rating: 4.3, reviews: 89, emoji: '👖', gradient: 'from-lime-100 to-green-100' },
  { id: 210, name: 'Off-Shoulder Blouse', price: 42.99, category: 'Clothing', isNew: true, rating: 4.6, reviews: 178, emoji: '👚', gradient: 'from-rose-100 to-red-100' },
  { id: 211, name: 'Pleated Midi Skirt', price: 48.99, category: 'Clothing', rating: 4.5, reviews: 201, emoji: '👗', gradient: 'from-violet-100 to-indigo-100' },
  { id: 212, name: 'Oversized Wool Coat', price: 129.99, originalPrice: 189.99, category: 'Clothing', rating: 4.8, reviews: 389, emoji: '🧥', gradient: 'from-gray-100 to-slate-100' },
]);

export const sneakerProducts: Product[] = processProducts([
  { id: 301, name: 'Air Max Retro Sneakers', price: 129.99, originalPrice: 159.99, category: 'Sneakers', rating: 4.9, reviews: 542, emoji: '👟', gradient: 'from-blue-100 to-indigo-100' },
  { id: 302, name: 'Classic Canvas Low-Top', price: 59.99, category: 'Sneakers', rating: 4.5, reviews: 234, emoji: '👟', gradient: 'from-gray-100 to-slate-100' },
  { id: 303, name: 'Running Performance X', price: 149.99, originalPrice: 189.99, category: 'Sneakers', rating: 4.8, reviews: 678, emoji: '🏃', gradient: 'from-emerald-100 to-teal-100' },
  { id: 304, name: 'High-Top Basketball', price: 119.99, category: 'Sneakers', badge: 'Best Seller', badgeColor: 'bg-emerald-500', rating: 4.7, reviews: 456, emoji: '🏀', gradient: 'from-orange-100 to-amber-100' },
  { id: 305, name: 'Slip-On Comfort Walk', price: 69.99, category: 'Sneakers', rating: 4.4, reviews: 189, emoji: '👞', gradient: 'from-sky-100 to-blue-100' },
  { id: 306, name: 'Suede Skater Shoes', price: 89.99, originalPrice: 109.99, category: 'Sneakers', rating: 4.6, reviews: 312, emoji: '🛹', gradient: 'from-purple-100 to-violet-100' },
  { id: 307, name: 'Trail Runner Pro', price: 139.99, category: 'Sneakers', isNew: true, rating: 4.8, reviews: 267, emoji: '⛰️', gradient: 'from-green-100 to-emerald-100' },
  { id: 308, name: 'Minimalist Trainer', price: 79.99, category: 'Sneakers', badge: 'Trending', badgeColor: 'bg-orange-500', rating: 4.5, reviews: 345, emoji: '👟', gradient: 'from-rose-100 to-pink-100' },
  { id: 309, name: 'Retro Jordan Style', price: 169.99, originalPrice: 219.99, category: 'Sneakers', rating: 4.9, reviews: 891, emoji: '👟', gradient: 'from-red-100 to-orange-100' },
  { id: 310, name: 'Gym CrossFit Shoes', price: 109.99, category: 'Sneakers', rating: 4.6, reviews: 234, emoji: '💪', gradient: 'from-amber-100 to-yellow-100' },
  { id: 311, name: 'Knit Running Boost', price: 159.99, category: 'Sneakers', badge: 'Premium', badgeColor: 'bg-indigo-500', rating: 4.8, reviews: 512, emoji: '🏃', gradient: 'from-indigo-100 to-blue-100' },
  { id: 312, name: 'Casual Everyday White', price: 54.99, category: 'Sneakers', isNew: true, rating: 4.4, reviews: 167, emoji: '👟', gradient: 'from-zinc-100 to-gray-100' },
]);

export const gadgetProducts: Product[] = processProducts([
  { id: 401, name: 'Smart Watch Pro X', price: 199.99, category: 'Gadgets', badge: 'Best Seller', badgeColor: 'bg-emerald-500', rating: 4.8, reviews: 876, emoji: '⌚', gradient: 'from-emerald-100 to-teal-100' },
  { id: 402, name: 'Wireless Earbuds Pro', price: 79.99, originalPrice: 99.99, category: 'Gadgets', rating: 4.9, reviews: 1024, emoji: '🎧', gradient: 'from-cyan-100 to-blue-100' },
  { id: 403, name: 'Portable Bluetooth Speaker', price: 49.99, category: 'Gadgets', rating: 4.6, reviews: 456, emoji: '🔊', gradient: 'from-orange-100 to-amber-100' },
  { id: 404, name: 'USB-C Power Bank 20K', price: 35.99, originalPrice: 49.99, category: 'Gadgets', rating: 4.5, reviews: 678, emoji: '🔋', gradient: 'from-green-100 to-emerald-100' },
  { id: 405, name: 'LED Ring Light Kit', price: 29.99, category: 'Gadgets', badge: 'Trending', badgeColor: 'bg-orange-500', rating: 4.4, reviews: 234, emoji: '💡', gradient: 'from-yellow-100 to-amber-100' },
  { id: 406, name: 'Mechanical Keyboard RGB', price: 89.99, category: 'Gadgets', isNew: true, rating: 4.7, reviews: 345, emoji: '⌨️', gradient: 'from-purple-100 to-violet-100' },
  { id: 407, name: 'Wireless Phone Charger', price: 24.99, category: 'Gadgets', rating: 4.3, reviews: 567, emoji: '📱', gradient: 'from-sky-100 to-blue-100' },
  { id: 408, name: 'Noise-Cancel Headphones', price: 159.99, originalPrice: 219.99, category: 'Gadgets', rating: 4.9, reviews: 789, emoji: '🎧', gradient: 'from-gray-100 to-slate-100' },
  { id: 409, name: 'Action Camera 4K', price: 129.99, category: 'Gadgets', badge: 'Hot', badgeColor: 'bg-orange-500', rating: 4.7, reviews: 423, emoji: '📷', gradient: 'from-red-100 to-rose-100' },
  { id: 410, name: 'Smart Home Mini Hub', price: 59.99, category: 'Gadgets', isNew: true, rating: 4.5, reviews: 312, emoji: '🏠', gradient: 'from-indigo-100 to-blue-100' },
  { id: 411, name: 'Fitness Tracker Band', price: 39.99, originalPrice: 59.99, category: 'Gadgets', rating: 4.6, reviews: 534, emoji: '⌚', gradient: 'from-lime-100 to-green-100' },
  { id: 412, name: 'Tablet Stand Adjustable', price: 19.99, category: 'Gadgets', rating: 4.4, reviews: 189, emoji: '📱', gradient: 'from-teal-100 to-cyan-100' },
]);

export const kidsProducts: Product[] = processProducts([
  { id: 501, name: 'Educational Robot Kit', price: 45.99, originalPrice: 59.99, category: 'Kids', rating: 4.6, reviews: 213, emoji: '🤖', gradient: 'from-amber-100 to-orange-100' },
  { id: 502, name: 'Building Blocks Set 500pc', price: 34.99, category: 'Kids', badge: 'Best Seller', badgeColor: 'bg-emerald-500', rating: 4.8, reviews: 567, emoji: '🧱', gradient: 'from-red-100 to-orange-100' },
  { id: 503, name: 'Plush Teddy Bear XL', price: 29.99, category: 'Kids', rating: 4.7, reviews: 345, emoji: '🧸', gradient: 'from-amber-100 to-yellow-100' },
  { id: 504, name: 'Art & Craft Supply Kit', price: 24.99, originalPrice: 39.99, category: 'Kids', rating: 4.5, reviews: 234, emoji: '🎨', gradient: 'from-pink-100 to-rose-100' },
  { id: 505, name: 'Remote Control Car', price: 39.99, category: 'Kids', badge: 'Hot', badgeColor: 'bg-orange-500', rating: 4.6, reviews: 456, emoji: '🏎️', gradient: 'from-blue-100 to-indigo-100' },
  { id: 506, name: 'Science Experiment Set', price: 32.99, category: 'Kids', isNew: true, rating: 4.4, reviews: 178, emoji: '🔬', gradient: 'from-emerald-100 to-teal-100' },
  { id: 507, name: 'Musical Keyboard Piano', price: 49.99, originalPrice: 69.99, category: 'Kids', rating: 4.7, reviews: 289, emoji: '🎹', gradient: 'from-violet-100 to-purple-100' },
  { id: 508, name: 'Doll House Playset', price: 59.99, category: 'Kids', badge: 'Trending', badgeColor: 'bg-orange-500', rating: 4.8, reviews: 423, emoji: '🏠', gradient: 'from-pink-100 to-fuchsia-100' },
  { id: 509, name: 'Puzzle World Map 1000pc', price: 18.99, category: 'Kids', rating: 4.3, reviews: 156, emoji: '🧩', gradient: 'from-green-100 to-lime-100' },
  { id: 510, name: 'Water Gun Super Soaker', price: 15.99, category: 'Kids', isNew: true, rating: 4.5, reviews: 312, emoji: '🔫', gradient: 'from-cyan-100 to-sky-100' },
  { id: 511, name: 'Dinosaur Figure Set', price: 27.99, originalPrice: 37.99, category: 'Kids', rating: 4.6, reviews: 234, emoji: '🦕', gradient: 'from-lime-100 to-emerald-100' },
  { id: 512, name: 'Board Game Collection', price: 22.99, category: 'Kids', badge: 'Family Fun', badgeColor: 'bg-indigo-500', rating: 4.7, reviews: 389, emoji: '🎲', gradient: 'from-indigo-100 to-blue-100' },
]);

export const allProducts = [
  ...handbagProducts,
  ...clothingProducts,
  ...sneakerProducts,
  ...gadgetProducts,
  ...kidsProducts,
];
