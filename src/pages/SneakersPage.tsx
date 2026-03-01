import { CategoryPage } from './CategoryPage';
import { sneakerProducts } from '../data/products';

export function SneakersPage() {
  return (
    <CategoryPage
      title="Men's Sneakers"
      subtitle="Step Up Your Game"
      description="From retro classics to cutting-edge performance shoes — find your perfect pair of sneakers."
      emoji="👟"
      heroGradient="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800"
      products={sneakerProducts}
      subCategories={['Running', 'Basketball', 'Casual', 'Skater', 'Trail', 'Gym', 'Retro', 'Minimalist']}
      priceRanges={[
        { label: 'Under $70', min: 0, max: 70 },
        { label: '$70 - $120', min: 70, max: 120 },
        { label: '$120 - $160', min: 120, max: 160 },
        { label: 'Over $160', min: 160, max: 999 },
      ]}
    />
  );
}
