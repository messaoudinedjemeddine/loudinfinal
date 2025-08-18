'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Package, Truck, Eye, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { yalidineAPI, Wilaya, Commune, Center, ShipmentData } from '@/lib/yalidine-api';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: 'HOME_DELIVERY' | 'PICKUP';
  deliveryAddress?: string;
  city: {
    name: string;
    nameAr?: string;
  };
  deliveryDesk?: {
    name: string;
    nameAr?: string;
  };
  total: number;
  subtotal: number;
  deliveryFee: number;
  callCenterStatus: 'NEW' | 'CONFIRMED' | 'CANCELED' | 'NO_RESPONSE';
  deliveryStatus: 'NOT_READY' | 'READY' | 'IN_TRANSIT' | 'DONE';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      nameAr?: string;
      image?: string;
    };
  }>;
}

interface ShippingStats {
  confirmedOrders: number;
  readyOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  totalShippable: number;
}

const statusColors = {
  NOT_READY: 'bg-gray-100 text-gray-800',
  READY: 'bg-yellow-100 text-yellow-800',
  IN_TRANSIT: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800'
};

const statusLabels = {
  NOT_READY: 'Not Ready',
  READY: 'Ready',
  IN_TRANSIT: 'In Transit',
  DONE: 'Delivered'
};

export function ShippingDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ShippingStats>({
    confirmedOrders: 0,
    readyOrders: 0,
    inTransitOrders: 0,
    deliveredOrders: 0,
    totalShippable: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showShipmentDialog, setShowShipmentDialog] = useState(false);
  const [creatingShipment, setCreatingShipment] = useState(false);
  
  // Yalidine shipments
  const [yalidineShipments, setYalidineShipments] = useState<any[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(false);

  // Yalidine data
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<string>('');

  // Shipment form
  const [shipmentForm, setShipmentForm] = useState<Partial<ShipmentData>>({
    orderId: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    fromWilayaName: 'Alger',
    toWilayaName: '',
    toCommuneName: '',
    productList: '',
    price: 0,
    weight: 1,
    length: 10,
    width: 10,
    height: 10,
    isStopDesk: false,
    doInsurance: false,
    declaredValue: 0,
    freeshipping: false,
    hasExchange: false,
  });

  useEffect(() => {
    fetchShippingData();
    loadYalidineData();
    fetchYalidineShipments();
  }, []);

  const fetchShippingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch only confirmed orders
      const response = await api.admin.getOrders({ confirmedOnly: 'true' }) as { orders: Order[] };
      const confirmedOrders = response.orders || [];
      
      setOrders(confirmedOrders);

      // Calculate stats
      const stats = {
        confirmedOrders: confirmedOrders.filter(o => o.deliveryStatus === 'NOT_READY').length,
        readyOrders: confirmedOrders.filter(o => o.deliveryStatus === 'READY').length,
        inTransitOrders: confirmedOrders.filter(o => o.deliveryStatus === 'IN_TRANSIT').length,
        deliveredOrders: confirmedOrders.filter(o => o.deliveryStatus === 'DONE').length,
        totalShippable: confirmedOrders.length
      };
      setStats(stats);

    } catch (err) {
      console.error('Error fetching shipping data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadYalidineData = async () => {
    try {
      const [wilayasData, communesData] = await Promise.all([
        yalidineAPI.getWilayas(),
        yalidineAPI.getCommunes(16) // Default to Alger
      ]);

      setWilayas(wilayasData.data || []);
      setCommunes(communesData.data || []);
    } catch (error) {
      console.error('Error loading Yalidine data:', error);
    }
  };

  const fetchYalidineShipments = async () => {
    try {
      setLoadingShipments(true);
      const response = await yalidineAPI.getAllShipments();
      setYalidineShipments(response.data || []);
    } catch (error) {
      console.error('Error fetching Yalidine shipments:', error);
      setYalidineShipments([]);
    } finally {
      setLoadingShipments(false);
    }
  };

  const handleCreateShipment = async (order: Order) => {
    setSelectedOrder(order);
    
    // Pre-fill shipment form with exact order data
    const productList = order.items.map(item => 
      `${item.quantity}x ${item.product.name}`
    ).join(', ');

    // Get the exact wilaya ID for the order's city
    const orderWilaya = wilayas.find(w => w.name === order.city.name);
    const orderWilayaId = orderWilaya?.id || '5'; // Default to Batna if not found

    // Load communes for the order's wilaya
    if (orderWilayaId) {
      try {
        const communesData = await yalidineAPI.getCommunes(parseInt(orderWilayaId));
        setCommunes(communesData.data || []);
        setSelectedWilaya(orderWilayaId);
      } catch (error) {
        console.error('Error loading communes for order wilaya:', error);
      }
    }

    setShipmentForm({
      orderId: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.deliveryAddress || '',
      fromWilayaName: 'Batna',
      toWilayaName: order.city.name,
      toCommuneName: order.deliveryDesk?.name || '',
      productList,
      price: order.total,
      weight: 1,
      length: 10,
      width: 10,
      height: 10,
      isStopDesk: order.deliveryType === 'PICKUP',
      doInsurance: false,
      declaredValue: order.total,
      freeshipping: false,
      hasExchange: false,
    });

    setShowShipmentDialog(true);
  };

  const createShipment = async () => {
    if (!selectedOrder) return;

    try {
      setCreatingShipment(true);

      // Validate required fields
      if (!shipmentForm.toWilayaName || !shipmentForm.toCommuneName) {
        toast.error('Please select destination wilaya and commune');
        return;
      }

      // Create shipment in Yalidine
      const result = await yalidineAPI.createShipment(shipmentForm as ShipmentData);
      
      if (result.success) {
        // Update order status to READY
        await api.admin.updateOrderStatus(selectedOrder.id, { 
          deliveryStatus: 'READY' 
        });

        toast.success(`Shipment created successfully! Tracking: ${result.tracking}`);
        setShowShipmentDialog(false);
        fetchShippingData(); // Refresh data
      } else {
        toast.error('Failed to create shipment');
      }
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      toast.error(error.message || 'Failed to create shipment');
    } finally {
      setCreatingShipment(false);
    }
  };

  const updateDeliveryStatus = async (orderId: string, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, { deliveryStatus: status });
      fetchShippingData(); // Refresh data
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleWilayaChange = async (wilayaId: string) => {
    setSelectedWilaya(wilayaId);
    try {
      const communesData = await yalidineAPI.getCommunes(parseInt(wilayaId));
      setCommunes(communesData.data || []);
    } catch (error) {
      console.error('Error loading communes:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedOrders}</div>
            <p className="text-xs text-muted-foreground">Ready for shipping</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.readyOrders}</div>
            <p className="text-xs text-muted-foreground">Shipment created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransitOrders}</div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shippable</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShippable}</div>
            <p className="text-xs text-muted-foreground">All confirmed orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Orders and Yalidine Shipments */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Confirmed Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="yalidine">Yalidine Shipments ({yalidineShipments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirmed Orders Ready for Shipping</CardTitle>
            </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.deliveryType === 'HOME_DELIVERY' 
                          ? order.deliveryAddress 
                          : order.deliveryDesk?.name
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">{order.city.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.total.toLocaleString()} DA</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.deliveryStatus]}>
                      {statusLabels[order.deliveryStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {order.deliveryStatus === 'NOT_READY' && (
                        <Button
                          size="sm"
                          onClick={() => handleCreateShipment(order)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create Shipment
                        </Button>
                      )}
                      
                      {order.deliveryStatus === 'READY' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateDeliveryStatus(order.id, 'IN_TRANSIT')}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Mark In Transit
                        </Button>
                      )}
                      
                      {order.deliveryStatus === 'IN_TRANSIT' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateDeliveryStatus(order.id, 'DONE')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="yalidine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Yalidine Shipments</CardTitle>
              <p className="text-sm text-muted-foreground">
                View all shipments created in your Yalidine account
              </p>
            </CardHeader>
            <CardContent>
              {loadingShipments ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading shipments...</span>
                </div>
              ) : yalidineShipments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>No shipments found in Yalidine account</p>
                  <p className="text-sm">Shipments will appear here once created</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {yalidineShipments.map((shipment) => (
                    <div key={shipment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium">#{shipment.tracking}</p>
                              <p className="text-sm text-muted-foreground">{shipment.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{shipment.customer_phone}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Badge className="bg-blue-100 text-blue-800">
                                {shipment.status || 'Active'}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {shipment.to_wilaya_name} • {shipment.to_commune_name} • {shipment.price?.toLocaleString()} DA
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Shipment Dialog */}
      <Dialog open={showShipmentDialog} onOpenChange={setShowShipmentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Yalidine Shipment</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Order Number</label>
                <div className="text-sm text-muted-foreground">{shipmentForm.orderId}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Customer Name</label>
                <div className="text-sm text-muted-foreground">{shipmentForm.customerName}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Customer Phone</label>
                <div className="text-sm text-muted-foreground">{shipmentForm.customerPhone}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Total Amount</label>
                <div className="text-sm text-muted-foreground">{shipmentForm.price?.toLocaleString()} DA</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Products</label>
              <div className="text-sm text-muted-foreground">{shipmentForm.productList}</div>
            </div>

                         <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-medium">Destination Wilaya</label>
                 <select
                   className="w-full p-2 border rounded"
                   value={selectedWilaya}
                   onChange={(e) => handleWilayaChange(e.target.value)}
                 >
                   <option value="">Select Wilaya</option>
                   {wilayas.map((wilaya) => (
                     <option key={wilaya.id} value={wilaya.id} selected={wilaya.name === shipmentForm.toWilayaName}>
                       {wilaya.name}
                     </option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="text-sm font-medium">Destination Commune</label>
                 <select
                   className="w-full p-2 border rounded"
                   value={shipmentForm.toCommuneName}
                   onChange={(e) => setShipmentForm({...shipmentForm, toCommuneName: e.target.value})}
                 >
                   <option value="">Select Commune</option>
                   {communes.map((commune) => (
                     <option key={commune.id} value={commune.name}>
                       {commune.name}
                     </option>
                   ))}
                 </select>
               </div>
             </div>

             <div>
               <label className="text-sm font-medium">Delivery Address</label>
               <div className="text-sm text-muted-foreground p-2 bg-gray-50 rounded">
                 {shipmentForm.customerAddress || 'No address provided'}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-medium">Delivery Type</label>
                 <div className="text-sm text-muted-foreground p-2 bg-gray-50 rounded">
                   {selectedOrder?.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup'}
                 </div>
               </div>
               <div>
                 <label className="text-sm font-medium">Pickup Location</label>
                 <div className="text-sm text-muted-foreground p-2 bg-gray-50 rounded">
                   {selectedOrder?.deliveryDesk?.name || 'N/A'}
                 </div>
               </div>
             </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowShipmentDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createShipment}
                disabled={creatingShipment}
              >
                {creatingShipment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Shipment
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
