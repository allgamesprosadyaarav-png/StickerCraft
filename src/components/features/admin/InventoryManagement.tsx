import { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, RefreshCw, Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { getAllInventory, getInventoryAlerts, updateInventory, addInventoryItem } from '../../../lib/admin';
import { ALL_PRODUCTS } from '../../../constants/products';
import { toast } from '../../../hooks/use-toast';

export function InventoryManagement() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');
  const [editThreshold, setEditThreshold] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductId, setNewProductId] = useState('');
  const [newStock, setNewStock] = useState('100');
  const [newThreshold, setNewThreshold] = useState('10');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    const [invData, alertsData] = await Promise.all([
      getAllInventory(),
      getInventoryAlerts(),
    ]);
    setInventory(invData);
    setAlerts(alertsData);
    setLoading(false);
  };

  const handleUpdateInventory = async (productId: string) => {
    try {
      await updateInventory(
        productId,
        parseInt(editStock),
        parseInt(editThreshold)
      );
      
      toast({
        title: 'Inventory updated! ✓',
        description: `Stock updated for ${productId}`,
      });
      
      setEditingId(null);
      loadInventory();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update inventory',
        variant: 'destructive',
      });
    }
  };

  const handleAddInventory = async () => {
    try {
      await addInventoryItem(
        newProductId,
        parseInt(newStock),
        parseInt(newThreshold)
      );
      
      toast({
        title: 'Inventory added! ✓',
        description: `Added inventory for ${newProductId}`,
      });
      
      setShowAddForm(false);
      setNewProductId('');
      setNewStock('100');
      setNewThreshold('10');
      loadInventory();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add inventory',
        variant: 'destructive',
      });
    }
  };

  const getProductInfo = (productId: string) => {
    return ALL_PRODUCTS.find(p => p.id === productId);
  };

  const getStockStatus = (item: any) => {
    if (item.available_quantity === 0) {
      return { label: 'Out of Stock', color: 'bg-red-500' };
    } else if (item.available_quantity <= item.low_stock_threshold) {
      return { label: 'Low Stock', color: 'bg-yellow-500' };
    }
    return { label: 'In Stock', color: 'bg-green-500' };
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.filter(a => a.stock_status !== 'IN_STOCK').length > 0 && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts
                .filter(a => a.stock_status !== 'IN_STOCK')
                .map((alert) => {
                  const product = getProductInfo(alert.product_id);
                  return (
                    <div
                      key={alert.product_id}
                      className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {product && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product?.name || alert.product_id}</p>
                          <p className="text-sm text-muted-foreground">
                            Available: {alert.available_quantity} units
                          </p>
                        </div>
                      </div>
                      <Badge className={alert.stock_status === 'OUT_OF_STOCK' ? 'bg-red-500' : 'bg-yellow-500'}>
                        {alert.stock_status.replace('_', ' ')}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Inventory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        {showAddForm && (
          <CardContent className="border-t">
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="productId">Product ID</Label>
                <select
                  id="productId"
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Select a product</option>
                  {ALL_PRODUCTS.filter(p => !inventory.find(i => i.product_id === p.id)).map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newStock">Initial Stock</Label>
                  <Input
                    id="newStock"
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newThreshold">Low Stock Alert</Label>
                  <Input
                    id="newThreshold"
                    type="number"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddInventory} disabled={!newProductId}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Inventory
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Inventory List */}
      <div className="grid md:grid-cols-2 gap-4">
        {inventory.map((item) => {
          const product = getProductInfo(item.product_id);
          const status = getStockStatus(item);
          const isEditing = editingId === item.product_id;

          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {product && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{product?.name || item.product_id}</h3>
                        <p className="text-sm text-muted-foreground">{item.product_id}</p>
                      </div>
                      <Badge className={`${status.color} text-white`}>
                        {status.label}
                      </Badge>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Stock Quantity</Label>
                            <Input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              size={1}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Low Stock Alert</Label>
                            <Input
                              type="number"
                              value={editThreshold}
                              onChange={(e) => setEditThreshold(e.target.value)}
                              size={1}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateInventory(item.product_id)}
                          >
                            <Save className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Total Stock</p>
                            <p className="font-semibold">{item.stock_quantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reserved</p>
                            <p className="font-semibold">{item.reserved_quantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Available</p>
                            <p className="font-semibold text-green-600">
                              {item.available_quantity}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(item.product_id);
                            setEditStock(item.stock_quantity.toString());
                            setEditThreshold(item.low_stock_threshold.toString());
                          }}
                          className="w-full"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit Inventory
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {inventory.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No inventory items found</p>
            <Button onClick={() => setShowAddForm(true)} className="mt-4">
              Add First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
