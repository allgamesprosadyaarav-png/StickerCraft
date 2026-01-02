import { useState } from 'react';
import { Package, Truck, CheckCircle2, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface OrderTrackingProps {
  orderId: string;
  status: 'processing' | 'confirmed' | 'shipped' | 'out-for-delivery' | 'delivered';
  estimatedDelivery: string;
  trackingNumber?: string;
}

const STATUS_STEPS = [
  { key: 'processing', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export function OrderTracking({ orderId, status, estimatedDelivery, trackingNumber }: OrderTrackingProps) {
  const [expanded, setExpanded] = useState(false);

  const currentStepIndex = STATUS_STEPS.findIndex(step => step.key === status);

  return (
    <Card className="glass">
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Order Tracking</CardTitle>
            <p className="text-sm text-muted-foreground">Order #{orderId}</p>
          </div>
          <Button variant="ghost" size="sm">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6">
          {/* Status Progress */}
          <div className="space-y-4">
            {STATUS_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-primary/20 animate-pulse' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-primary font-medium mt-1">
                        Currently at this stage
                      </p>
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < STATUS_STEPS.length - 1 && (
                    <div className={`absolute left-9 w-0.5 h-12 translate-y-10 ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tracking Details */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Estimated Delivery:</span>
              <span className="font-medium">{estimatedDelivery}</span>
            </div>

            {trackingNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Tracking Number:</span>
                <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {trackingNumber}
                </code>
              </div>
            )}
          </div>

          {/* Delivery Address Preview */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Delivery Address</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Delivering to your registered address
            </p>
          </div>

          {status === 'delivered' && (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <p className="font-medium">Order Delivered Successfully!</p>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                Thank you for shopping with StickerCraft! 🎉
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
