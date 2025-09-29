import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Star,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react';
import { getProducts } from '@/data/products';
import { Product } from '@/data/products';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Ensure page starts from top when navigated to
  useScrollToTop();

  const categories = [
    { id: 'all', name: 'All Products', icon: Grid3X3 },
    { id: 'bestsellers', name: 'Best Sellers', icon: TrendingUp },
    { id: 'focus', name: 'Focus & Memory', icon: Zap },
    { id: 'beauty', name: 'Beauty & Glow', icon: Heart },
    { id: 'gut-health', name: 'Gut Health', icon: Star },
    { id: 'sleep-mood', name: 'Sleep & Mood', icon: Heart },
    { id: 'bundles', name: 'Bundles', icon: Grid3X3 },
  ];

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  useEffect(() => {
    // Get category from URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category === selectedCategory || 
        (selectedCategory === 'bestsellers' && product.badge === 'BEST SELLER') ||
        (selectedCategory === 'gut-health' && product.category === 'focus') ||
        (selectedCategory === 'sleep-mood' && product.category === 'beauty') ||
        (selectedCategory === 'bundles' && product.category === 'bestsellers')
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category || categories[0];
  };

  const currentCategory = getCategoryInfo(selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <currentCategory.icon className="h-6 w-6 icon-accent" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold heading-text">
              {currentCategory.name}
            </h1>
          </div>
          <p className="body-text max-w-2xl">
            Discover our premium wellness supplements designed to support your health and vitality. 
            Each product is carefully formulated with scientifically-backed ingredients.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 icon-muted" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Most Popular</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-r-none transition-all duration-200 ${
                viewMode === 'grid' ? 'btn-selected' : ''
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={`rounded-l-none transition-all duration-200 ${
                viewMode === 'list' ? 'btn-selected' : ''
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h3 className="font-heading text-lg font-semibold mb-4 heading-text">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                    className={`w-full justify-start font-body transition-all duration-200 ${
                      selectedCategory === category.id ? 'category-selected' : 'hover:bg-muted'
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <category.icon className={`h-4 w-4 mr-2 ${selectedCategory === category.id ? 'selected-icon' : 'icon-primary'}`} />
                    <span className={selectedCategory === category.id ? 'selected-text' : 'category-text'}>
                      {category.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="muted-text">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="font-body">
                    {currentCategory.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={viewMode === 'list' ? 'flex' : ''}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 icon-muted" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2 heading-text">No products found</h3>
                <p className="muted-text mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSearchParams({});
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;