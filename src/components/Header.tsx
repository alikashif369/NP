import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const menuItems = [
    { name: "Best Sellers", href: "/products?category=bestsellers" },
    { name: "Gut Health", href: "/products?category=gut-health" },
    { name: "Sleep & Mood", href: "/products?category=sleep-mood" },
    { name: "Bundles", href: "/products?category=bundles" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-tertiary shadow-elegant">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 font-display text-xl font-medium tracking-tight"
          >
            <span className="heading-text">Nutrition pHirst</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-base font-serif nav-text transition-colors hover:text-primary">
                NUTRIENT BY BENEFIT
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-screen max-w-none left-0 right-0 p-8 bg-white border-0 shadow-product rounded-none mt-4">
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Left Column - Categories */}
                    <div className="col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Link to="/benefit/ultra-strength" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">🔥</span>
                            </div>
                            <span className="font-medium">Ultra Strength Softgels</span>
                          </Link>
                          <Link to="/benefit/sleep" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 flex items-center justify-center">
                              <span className="text-white text-xs">🌙</span>
                            </div>
                            <span className="font-medium">Sleep</span>
                          </Link>
                          <Link to="/benefit/mood" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
                              <span className="text-white text-xs">☀️</span>
                            </div>
                            <span className="font-medium">Mood</span>
                          </Link>
                          <Link to="/benefit/beauty" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                              <span className="text-white text-xs">✨</span>
                            </div>
                            <span className="font-medium">Beauty</span>
                          </Link>
                          <Link to="/benefit/womens-health" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                              <span className="text-white text-xs">♀️</span>
                            </div>
                            <span className="font-medium">Women's Health</span>
                          </Link>
                          <Link to="/benefit/gut-health" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 flex items-center justify-center">
                              <span className="text-white text-xs">🫀</span>
                            </div>
                            <span className="font-medium">Gut Health</span>
                          </Link>
                          <Link to="/benefit/immunity" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 flex items-center justify-center">
                              <span className="text-white text-xs">➕</span>
                            </div>
                            <span className="font-medium">Immunity</span>
                          </Link>
                          <Link to="/benefit/multivitamins" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center">
                              <span className="text-white text-xs">💊</span>
                            </div>
                            <span className="font-medium">Multivitamins</span>
                          </Link>
                        </div>
                        <div className="space-y-3">
                          <Link to="/benefit/kids" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
                              <span className="text-white text-xs">⭐</span>
                            </div>
                            <span className="font-medium">Kids</span>
                          </Link>
                          <Link to="/benefit/energy" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center">
                              <span className="text-white text-xs">⚡</span>
                            </div>
                            <span className="font-medium">Energy</span>
                          </Link>
                          <Link to="/benefit/adaptogens" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-yellow-400 flex items-center justify-center">
                              <span className="text-white text-xs">🍃</span>
                            </div>
                            <span className="font-medium">Adaptogens</span>
                          </Link>
                          <Link to="/benefit/foundational-wellness" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                              <span className="text-white text-xs">😊</span>
                            </div>
                            <span className="font-medium">Foundational Wellness</span>
                          </Link>
                          <Link to="/benefit/cognitive-health" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
                              <span className="text-white text-xs">🧠</span>
                            </div>
                            <span className="flex items-center">
                              <span className="font-medium">Cognitive Health</span>
                              <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">NEW!</span>
                            </span>
                          </Link>
                          <Link to="/benefit/vegetarian" className="flex items-center space-x-3 text-sm hover:text-primary transition-colors py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">V</span>
                            </div>
                            <span className="flex items-center">
                              <span className="font-medium">Vegetarian</span>
                              <span className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded-full">NEW!</span>
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column - Product Showcases */}
                    <div className="col-span-1">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Sleep Support Showcase */}
                        <div className="text-center">
                          <div className="relative w-full h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                            <div className="relative z-10 flex items-center space-x-2">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">💊</span>
                              </div>
                              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">🕐</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-foreground">SLEEP</p>
                        </div>
                        
                        {/* Mood Support Showcase */}
                        <div className="text-center">
                          <div className="relative w-full h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg mb-3 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                            <div className="relative z-10 flex items-center space-x-2">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">😊</span>
                              </div>
                              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">📚</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-foreground">MOOD SUPPORT</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link
              to="/products?category=all"
              className="flex items-center space-x-1 text-base font-serif nav-text transition-colors"
            >
              SHOP
            </Link>
            
            <Link
              to="/learn"
              className="text-base font-serif nav-text transition-colors"
            >
              LEARN
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4 icon-primary" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={() => navigate("/account")}>
              <User className="h-4 w-4 icon-primary" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-4 w-4 icon-primary" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-tertiary bg-white shadow-elegant">
            <nav className="flex flex-col space-y-4 p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium nav-text transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/learn"
                className="text-sm font-medium nav-text transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                LEARN
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;