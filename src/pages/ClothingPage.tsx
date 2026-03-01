import { CategoryPage } from './CategoryPage';
import { clothingProducts } from '../data/products';

export function ClothingPage() {
  return (
    <CategoryPage
      title="Ladies Clothing"
      subtitle="Fashion Forward"
      description="Elevate your wardrobe with our stunning collection of dresses, tops, blazers, and more for every occasion."
      emoji="👗"
      heroGradient="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700"
      products={clothingProducts}
      subCategories={['Dress', 'Blouse', 'Blazer', 'Trouser', 'Skirt', 'Cardigan', 'Jacket', 'Coat']}
      priceRanges={[
        { label: 'Under $40', min: 0, max: 40 },
        { label: '$40 - $70', min: 40, max: 70 },
        { label: '$70 - $100', min: 70, max: 100 },
        { label: 'Over $100', min: 100, max: 999 },
      ]}
    />
  );
}
