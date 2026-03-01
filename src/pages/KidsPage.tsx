import { CategoryPage } from './CategoryPage';
import { kidsProducts } from '../data/products';

export function KidsPage() {
  return (
    <CategoryPage
      title="Kids Toys"
      subtitle="Fun & Learning"
      description="Spark joy and creativity with our hand-picked collection of educational toys, games, and playsets for kids of all ages."
      emoji="🧸"
      heroGradient="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600"
      products={kidsProducts}
      subCategories={['Robot', 'Building', 'Plush', 'Art', 'RC Cars', 'Science', 'Musical', 'Board Games']}
      priceRanges={[
        { label: 'Under $20', min: 0, max: 20 },
        { label: '$20 - $35', min: 20, max: 35 },
        { label: '$35 - $50', min: 35, max: 50 },
        { label: 'Over $50', min: 50, max: 999 },
      ]}
    />
  );
}
