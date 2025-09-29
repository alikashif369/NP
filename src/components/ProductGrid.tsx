import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import focusProducts from "@/assets/product-1.jpg";
import beautyProducts from "@/assets/product-2.jpg";
import supplementsProducts from "@/assets/product-3.jpg";

const ProductGrid = () => {
  const products = [
    {
      id: "1",
      name: "Memory & Focus Booster",
      description: "Cognitive support formula to enhance focus and clarity",
      price: 49.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviewCount: 1024,
      image: focusProducts,
      badge: "BEST SELLER",
      category: "focus",
    },
    {
      id: "2",
      name: "Beauty Glow Bundle",
      description: "Holistic skin & hair support with powerful antioxidants",
      price: 69.99,
      rating: 4.7,
      reviewCount: 876,
      image: beautyProducts,
      badge: "NEW",
      category: "beauty",
    },
    {
      id: "3",
      name: "Daily Essentials Stack",
      description: "Foundational wellness pack for energy, sleep, and calm",
      price: 89.99,
      originalPrice: 109.99,
      rating: 4.9,
      reviewCount: 1622,
      image: supplementsProducts,
      badge: "TRENDING",
      category: "bestsellers",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Targeted Formulas. Real Results.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Thoughtfully designed products to help you focus better, feel calmer, and look your best.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {products.map((product) => (
            <div className="h-full" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/products">
            <Button variant="luxury" size="lg" className="min-w-48">
              VIEW ALL PRODUCTS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ProductGrid;
