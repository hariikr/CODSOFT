import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Badge } from './components/ui/badge';

const PEXELS_API_KEY = 'I0tMd3zVHbCr95zD65I76fvsqo0mRRcxoVZa2P0HhxaLfkYamOtWDd1W'; // Replace with your Pexels API key

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=6');
      const data = await response.json();

      const productPromises = data.products.map(async (item) => {
        const imageUrl = await fetchImage(item.title);
        return {
          id: item.id,
          name: item.title,
          price: item.price,
          image: imageUrl,
          category: item.category,
        };
      });

      const formattedProducts = await Promise.all(productPromises);
      setProducts(formattedProducts);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    }
  };

  const fetchImage = async (query) => {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });
      const data = await response.json();
      return data.photos[0]?.src?.medium || 'default-image-url';
    } catch (error) {
      console.error('Error fetching image:', error);
      return 'default-image-url';
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-green-100">
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-8 bg-gradient-to-r from-orange-500 to-green-500 text-white p-4 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold font-devanagari">Indian Bazaar</h1>
          <Button
            variant="outline"
            size="icon"
            className="relative bg-white text-orange-500 hover:bg-orange-100 transition-colors duration-200"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </header>
        
        {isLoading ? (
          <div className="text-center text-2xl text-gray-600">Loading products...</div>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Card key={product.id} className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-white">
                <CardHeader className="p-0">
                  <div className="relative h-48 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                    <Badge className="absolute top-2 right-2" variant="outline">{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-xl mb-2 text-gray-800">{product.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-orange-600">₹{product.price}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => addToCart(product)} className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white transition-all duration-200">
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </main>
        )}

        {isCartOpen && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl p-6 overflow-y-auto z-50 transition-transform duration-300 transform translate-x-0">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-orange-600">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)} className="text-orange-500 border-orange-500">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-2 text-gray-800">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)} className="text-green-500 border-green-500">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-xl font-bold mt-4 mb-4 text-gray-800">
                  Total: ₹{calculateTotal()}
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white transition-all duration-200">
                  Checkout
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
