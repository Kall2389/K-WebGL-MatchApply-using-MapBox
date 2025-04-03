
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Order } from '../types/order';
import { getRandomCountry, getRandomCity, getRandomColor } from '../utils/orderUtils';

interface OrderPanelProps {
  onAddOrder: (order: Order) => void;
  onClearOrders: () => void;
  onToggleAutoOrders: (enabled: boolean) => void;
  orderFrequency: number;
  onOrderFrequencyChange: (value: number) => void;
  autoOrdersEnabled: boolean;
}

const OrderPanel = ({ 
  onAddOrder, 
  onClearOrders, 
  onToggleAutoOrders, 
  orderFrequency, 
  onOrderFrequencyChange,
  autoOrdersEnabled
}: OrderPanelProps) => {
  const { toast } = useToast();
  
  const handleGenerateOrder = () => {
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
    
    onAddOrder(newOrder);
    
    toast({
      title: "New Order Received!",
      description: `$${amount} from ${city.name}, ${country.name}`,
      duration: 3000
    });
  };
  
  const handleToggleAutoOrders = (checked: boolean) => {
    onToggleAutoOrders(checked);
    
    if (checked) {
      toast({
        title: "Auto Orders Enabled",
        description: `Generating a new order every ${orderFrequency} seconds`,
        duration: 3000
      });
    } else {
      toast({
        title: "Auto Orders Disabled",
        description: "You can still manually add orders",
        duration: 3000
      });
    }
  };
  
  return (
    <div className="absolute left-4 bottom-4 md:left-8 md:bottom-8 w-64 md:w-80 bg-card/80 backdrop-blur-md rounded-lg p-4 text-card-foreground border border-border/50 z-10">
      <h2 className="text-lg font-semibold mb-3">Order Controls</h2>
      
      <div className="space-y-4">
        <Button onClick={handleGenerateOrder} className="w-full">
          Generate Random Order
        </Button>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-orders">Auto Generate Orders</Label>
            <Switch 
              id="auto-orders" 
              checked={autoOrdersEnabled}
              onCheckedChange={handleToggleAutoOrders}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Order Frequency</span>
              <span>{orderFrequency} seconds</span>
            </div>
            <Slider 
              value={[orderFrequency]} 
              min={1} 
              max={10} 
              step={1} 
              disabled={!autoOrdersEnabled}
              onValueChange={(values) => onOrderFrequencyChange(values[0])}
            />
          </div>
        </div>
        
        <Button variant="outline" onClick={onClearOrders} className="w-full">
          Clear All Orders
        </Button>
      </div>
      
      <div className="mt-4 pt-2 border-t border-border/50 text-xs text-muted-foreground">
        Note: For demo purposes only. Connect to FootballMatch API for real data.
      </div>
    </div>
  );
};

export default OrderPanel;
