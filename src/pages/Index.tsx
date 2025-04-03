
import { useState, useEffect, useCallback } from 'react';
import Globe from '../components/Globe';
import OrdersList from '../components/OrdersList';
import OrderPanel from '../components/OrderPanel';
import { Order, OrderMarker } from '../types/order';
import { getRandomCountry, getRandomCity, getRandomColor } from '../utils/orderUtils';

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [markers, setMarkers] = useState<OrderMarker[]>([]);
  const [autoOrdersEnabled, setAutoOrdersEnabled] = useState(false);
  const [orderFrequency, setOrderFrequency] = useState(3);
  
  const addOrder = useCallback((order: Order) => {
    setOrders(prevOrders => [order, ...prevOrders]);
    
    // Add marker for the globe
    const marker: OrderMarker = {
      latitude: order.latitude,
      longitude: order.longitude,
      country: order.country,
      city: order.city,
      color: order.color,
      timestamp: order.timestamp
    };
    
    setMarkers(prevMarkers => [...prevMarkers, marker]);
    
    // Clean up old markers after 1 minute
    setTimeout(() => {
      setMarkers(prevMarkers => 
        prevMarkers.filter(m => m.timestamp !== order.timestamp)
      );
    }, 60000);
  }, []);
  
  const clearOrders = useCallback(() => {
    setOrders([]);
    setMarkers([]);
  }, []);
  
  const toggleAutoOrders = useCallback((enabled: boolean) => {
    setAutoOrdersEnabled(enabled);
  }, []);
  
  // Generate automatic orders
  useEffect(() => {
    if (!autoOrdersEnabled) return;
    
    const interval = setInterval(() => {
      const country = getRandomCountry();
      const city = getRandomCity(country);
      const amount = Math.floor(Math.random() * 300) + 20;
      
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        country: country.name,
        city: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        amount,
        color: getRandomColor(),
        timestamp: Date.now()
      };
      
      addOrder(newOrder);
    }, orderFrequency * 1000);
    
    return () => clearInterval(interval);
  }, [autoOrdersEnabled, orderFrequency, addOrder]);
  
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 flex justify-between items-center">
        <div className="text-xl md:text-2xl font-bold text-foreground">
          Shopify Order Globe
        </div>
        <div className="text-sm text-muted-foreground">
          Real-time order visualization
        </div>
      </header>
      
      <Globe markers={markers} />
      
      <OrdersList orders={orders} />
      
      <OrderPanel 
        onAddOrder={addOrder}
        onClearOrders={clearOrders}
        onToggleAutoOrders={toggleAutoOrders}
        orderFrequency={orderFrequency}
        onOrderFrequencyChange={setOrderFrequency}
        autoOrdersEnabled={autoOrdersEnabled}
      />
      
      {/* Add earth texture in public folder */}
      <link rel="preload" href="/earth-blue-marble.jpg" as="image" />
    </div>
  );
};

export default Index;
