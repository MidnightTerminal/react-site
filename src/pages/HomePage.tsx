import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { BrandsMarquee } from '../components/BrandsMarquee';
import { Categories } from '../components/Categories';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { DealsSection } from '../components/DealsSection';
import { Features } from '../components/Features';
import { Testimonials } from '../components/Testimonials';
import { Newsletter } from '../components/Newsletter';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { AddToCartToast } from '../components/AddToCartToast';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartDrawer />
      <WishlistDrawer />
      <AddToCartToast />
      <Hero />
      <BrandsMarquee />
      <Categories />
      <FeaturedProducts />
      <DealsSection />
      <Features />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}
