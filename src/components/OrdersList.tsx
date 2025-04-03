
import { useState, useEffect } from 'react';
import { Order } from '../types/order';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface OrdersListProps {
  orders: Order[];
}

const OrdersList = ({ orders }: OrdersListProps) => {
  const [visibleOrders, setVisibleOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    setVisibleOrders(orders.slice(0, 10));
  }, [orders]);
  
  return (
    <div className="absolute right-4 top-20 md:right-8 md:top-24 w-64 md:w-80 bg-card/80 backdrop-blur-md rounded-lg p-4 text-card-foreground border border-border/50 overflow-hidden z-10">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <span className="mr-2">Recent Orders</span>
        <Badge variant="outline" className="bg-primary/20 text-primary-foreground">
          {orders.length}
        </Badge>
      </h2>
      
      <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
        {visibleOrders.length > 0 ? (
          visibleOrders.map((order, index) => (
            <div 
              key={order.id} 
              className={`p-3 rounded-md bg-secondary/50 border border-border/50 ${index === 0 ? 'rise-up' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{order.country}</h3>
                  <p className="text-sm text-muted-foreground">{order.city}</p>
                </div>
                <Badge 
                  variant="outline" 
                  style={{ backgroundColor: `${order.color}20`, borderColor: order.color }} 
                  className="text-xs"
                >
                  ${order.amount}
                </Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {formatDistanceToNow(order.timestamp, { addSuffix: true })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-6">No orders yet</div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
