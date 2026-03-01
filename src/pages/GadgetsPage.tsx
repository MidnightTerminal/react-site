import { CategoryPage } from './CategoryPage';
import { gadgetProducts } from '../data/products';

export function GadgetsPage() {
  return (
    <CategoryPage
      title="Gadgets & Accessories"
      subtitle="Tech Essentials"
      description="Explore the latest tech gadgets, wearables, audio gear, and smart accessories at unbeatable prices."
      emoji="⚡"
      heroGradient="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700"
      products={gadgetProducts}
      subCategories={['Watch', 'Earbuds', 'Speaker', 'Charger', 'Camera', 'Keyboard', 'Headphones', 'Smart Home']}
      priceRanges={[
        { label: 'Under $30', min: 0, max: 30 },
        { label: '$30 - $80', min: 30, max: 80 },
        { label: '$80 - $150', min: 80, max: 150 },
        { label: 'Over $150', min: 150, max: 999 },
      ]}
    />
  );
}
