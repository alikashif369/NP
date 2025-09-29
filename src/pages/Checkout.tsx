import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Lock, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Truck,
  Plus,
  Minus,
  X
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  
  useScrollToTop();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    useShippingAsBilling: true,
    saveInfo: true,
    emailOffers: true,
    shippingProtection: false
  });

  const [shippingMethod, setShippingMethod] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  // Calculate totals
  const shipping = subtotal > 75 ? 0 : 7.99;
  const tax = subtotal * 0.08;
  const protectionFee = formData.shippingProtection ? 1200 : 0;
  const total = subtotal + shipping + tax + protectionFee;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckout = () => {
    // Here you would typically process the payment
    console.log("Processing checkout with:", formData);
    clearCart();
    navigate("/");
  };

  const addToOrder = (item: any) => {
    // This would add the recommended item to cart
    console.log("Adding to order:", item);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 lg:px-8 py-16">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Button variant="premium" size="lg" onClick={() => navigate("/cart")}>
              View Cart
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Express Checkout */}
            <div className="space-y-4">
              <h1 className="text-2xl font-serif font-bold text-foreground">Checkout</h1>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white">
                  <span className="font-semibold">shop</span>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                By continuing with your payment, you agree to the future charges listed on this page and the cancellation policy.
              </p>
            </div>

            {/* Contact */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-foreground">Contact</h2>
                <Button variant="link" className="p-0 h-auto">
                  Sign in
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailOffers"
                    checked={formData.emailOffers}
                    onCheckedChange={(checked) => handleInputChange("emailOffers", checked as boolean)}
                  />
                  <Label htmlFor="emailOffers" className="text-sm">
                    Email me with news and offers
                  </Label>
                </div>
              </div>
            </Card>

            {/* Delivery */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Delivery</h2>
              
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  This product is not available for delivery to your location.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Bloat - 3 Month Delivery</span>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Change delivery address or remove unavailable item.
                  </Button>
                </div>
                
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>ATTENTION CUSTOMERS:</strong> Due to shipping issues, we are currently unable to deliver to PO Box addresses. For all standard addresses, shipping will continue as normal.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country/Region</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="pk">Pakistan</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter your address"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange("apartment", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Enter mobile # for order, shipping, subscription, and product guidance...</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+92"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Shipping Method */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Shipping method</h2>
              
              <div className="space-y-4">
                <Input
                  placeholder="Enter your shipping address to view available shipping methods."
                  disabled
                  className="bg-muted"
                />
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shippingProtection"
                    checked={formData.shippingProtection}
                    onCheckedChange={(checked) => handleInputChange("shippingProtection", checked as boolean)}
                  />
                  <Label htmlFor="shippingProtection" className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>Shipping Protection Route</span>
                      <span className="font-semibold">PKR 1,200.00</span>
                    </div>
                  </Label>
                </div>
                
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Failed to fetch
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20" />
                  ))}
                </div>
              </div>
            </Card>

            {/* Payment */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Payment</h2>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All transactions are secure and encrypted.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Credit card</span>
                    <div className="flex space-x-2 ml-auto">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">V</div>
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">M</div>
                      <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center">A</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiration date (MM/YY)</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">Security code</Label>
                        <div className="relative">
                          <Input
                            id="cvv"
                            value={formData.cvv}
                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                            placeholder="123"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Name on card</Label>
                      <Input
                        id="cardName"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange("cardName", e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="useShippingAsBilling"
                        checked={formData.useShippingAsBilling}
                        onCheckedChange={(checked) => handleInputChange("useShippingAsBilling", checked as boolean)}
                      />
                      <Label htmlFor="useShippingAsBilling" className="text-sm">
                        Use shipping address as billing address
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Remember me */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Remember me</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={(checked) => handleInputChange("saveInfo", checked as boolean)}
                  />
                  <Label htmlFor="saveInfo" className="text-sm">
                    Save my information for a faster checkout with a Shop account
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Mobile phone number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+92"
                  />
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure and encrypted</span>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    shop
                  </Button>
                </div>
              </div>
            </Card>

            <Button 
              onClick={handleCheckout}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold"
            >
              Pay now
            </Button>
          </div>

          {/* Order Summary & Recommendations */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="p-6 sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">3 month subscription with 20% discount</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">Rs {item.price.toLocaleString()}.00</div>
                      <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
                
                {formData.shippingProtection && (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Truck className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">Route Package Protection</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">Rs 1,200.00</div>
                      <div className="text-xs text-muted-foreground">$3.95</div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">Rs {subtotal.toLocaleString()}.00</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `Rs ${shipping.toLocaleString()}.00`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">Rs {tax.toLocaleString()}.00</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>PKR Rs {total.toLocaleString()}.00</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Recurring subtotal: Rs {subtotal.toLocaleString()}.00 every 3 months
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Discount code or gift card"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

