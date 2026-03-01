import { CategoryPage } from './CategoryPage';
import { handbagProducts } from '../data/products';

export function HandbagsPage() {
  return (
    <CategoryPage
      title="Ladies Handbags"
      subtitle="Curated Collection"
      description="Discover our exquisite collection of designer handbags, from everyday totes to elegant evening clutches."
      emoji="👜"
      heroGradient="bg-gradient-to-br from-pink-600 via-rose-600 to-fuchsia-700"
      products={handbagProducts}
      subCategories={['Crossbody', 'Tote', 'Clutch', 'Shoulder', 'Bucket', 'Hobo', 'Saddle', 'Doctor']}
      priceRanges={[
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $150', min: 100, max: 150 },
        { label: 'Over $150', min: 150, max: 999 },
      ]}
    />
  );
}
