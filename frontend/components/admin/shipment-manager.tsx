'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Search, Package, Truck, Edit, Trash2, Eye, Download } from 'lucide-react';
import { yalidineAPI, Wilaya, Commune, Center, ShipmentData, TrackingHistory } from '@/lib/yalidine-api';
import { toast } from 'sonner';

export function ShipmentManager() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(false);
  const [yalidineStatus, setYalidineStatus] = useState<{ configured: boolean; message: string } | null>(null);

  // Shipment creation form
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

  // Tracking
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistory[]>([]);
  const [shipmentDetails, setShipmentDetails] = useState<any>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Check Yalidine status
      const status = await yalidineAPI.getStatus();
      setYalidineStatus(status);
      
      if (!status.configured) {
        toast.error('Yalidine shipping is not configured');
        return;
      }

      // Load wilayas
      const wilayasData = await yalidineAPI.getWilayas();
      setWilayas(wilayasData.data);
      
      // Load communes for default wilaya
      const communesData = await yalidineAPI.getCommunes(16);
      setCommunes(communesData.data);
      
      // Load centers for default wilaya
      const centersData = await yalidineAPI.getCenters(16);
      setCenters(centersData.data);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load shipping data');
    } finally {
      setLoading(false);
    }
  };

  const loadCommunes = async (wilayaId: number) => {
    try {
      const communesData = await yalidineAPI.getCommunes(wilayaId);
      setCommunes(communesData.data);
    } catch (error) {
      console.error('Error loading communes:', error);
    }
  };

  const loadCenters = async (wilayaId: number) => {
    try {
      const centersData = await yalidineAPI.getCenters(wilayaId);
      setCenters(centersData.data);
    } catch (error) {
      console.error('Error loading centers:', error);
    }
  };

  const createShipment = async () => {
    try {
      setLoading(true);

      // Validate required fields
      const requiredFields = [
        'orderId', 'customerName', 'customerPhone', 'customerAddress',
        'toWilayaName', 'toCommuneName', 'productList', 'price', 'weight'
      ];

      for (const field of requiredFields) {
        if (!shipmentForm[field as keyof ShipmentData]) {
          toast.error(`Please fill in ${field}`);
          return;
        }
      }

      // Validate phone number
      if (!yalidineAPI.validatePhoneNumber(shipmentForm.customerPhone!)) {
        toast.error('Invalid phone number format');
        return;
      }

      const result = await yalidineAPI.createShipment(shipmentForm as ShipmentData);
      
      if (result.success) {
        toast.success(`Shipment created successfully! Tracking: ${result.tracking}`);
        // Reset form
        setShipmentForm({
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
      } else {
        toast.error('Failed to create shipment');
      }
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      toast.error(error.response?.data?.error || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  const searchTracking = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);

      // Get tracking history
      const historyData = await yalidineAPI.getTracking(trackingNumber);
      setTrackingHistory(historyData.data);

      // Get shipment details
      try {
        const details = await yalidineAPI.getShipment(trackingNumber);
        setShipmentDetails(details);
      } catch (detailsError) {
        console.warn('Could not fetch shipment details:', detailsError);
        setShipmentDetails(null);
      }

    } catch (error: any) {
      console.error('Error searching tracking:', error);
      toast.error(error.response?.data?.error || 'Failed to find tracking information');
      setTrackingHistory([]);
      setShipmentDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!yalidineStatus?.configured) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>
              {yalidineStatus?.message || 'Yalidine shipping is not configured. Please contact support.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Shipment</TabsTrigger>
          <TabsTrigger value="track">Track Shipment</TabsTrigger>
          <TabsTrigger value="manage">Manage Shipments</TabsTrigger>
        </TabsList>

        {/* Create Shipment Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Shipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Order Information</h3>
                  
                  <div className="space-y-2">
                    <Label>Order ID *</Label>
                    <Input
                      value={shipmentForm.orderId}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, orderId: e.target.value })}
                      placeholder="Enter order ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Input
                      value={shipmentForm.customerName}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, customerName: e.target.value })}
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input
                      value={shipmentForm.customerPhone}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, customerPhone: e.target.value })}
                      placeholder="05xxxxxxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Address *</Label>
                    <Textarea
                      value={shipmentForm.customerAddress}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, customerAddress: e.target.value })}
                      placeholder="Enter delivery address"
                    />
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Shipping Information</h3>
                  
                  <div className="space-y-2">
                    <Label>From Wilaya</Label>
                    <Select 
                      value={shipmentForm.fromWilayaName} 
                      onValueChange={(value) => setShipmentForm({ ...shipmentForm, fromWilayaName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayas.map((wilaya) => (
                          <SelectItem key={wilaya.id} value={wilaya.name}>
                            {wilaya.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>To Wilaya *</Label>
                    <Select 
                      value={shipmentForm.toWilayaName} 
                      onValueChange={(value) => {
                        setShipmentForm({ ...shipmentForm, toWilayaName: value, toCommuneName: '' });
                        const wilaya = wilayas.find(w => w.name === value);
                        if (wilaya) {
                          loadCommunes(wilaya.id);
                          loadCenters(wilaya.id);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination wilaya" />
                      </SelectTrigger>
                      <SelectContent>
                        {wilayas.map((wilaya) => (
                          <SelectItem key={wilaya.id} value={wilaya.name}>
                            {wilaya.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Commune *</Label>
                    <Select 
                      value={shipmentForm.toCommuneName} 
                      onValueChange={(value) => setShipmentForm({ ...shipmentForm, toCommuneName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select commune" />
                      </SelectTrigger>
                      <SelectContent>
                        {communes.map((commune) => (
                          <SelectItem key={commune.id} value={commune.name}>
                            {commune.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Description *</Label>
                    <Textarea
                      value={shipmentForm.productList}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, productList: e.target.value })}
                      placeholder="Describe the products"
                    />
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                <h3 className="font-semibold">Package Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Price (DA) *</Label>
                    <Input
                      type="number"
                      value={shipmentForm.price}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (kg) *</Label>
                    <Input
                      type="number"
                      value={shipmentForm.weight}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, weight: parseFloat(e.target.value) || 0 })}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Length (cm)</Label>
                    <Input
                      type="number"
                      value={shipmentForm.length}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, length: parseFloat(e.target.value) || 0 })}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Width (cm)</Label>
                    <Input
                      type="number"
                      value={shipmentForm.width}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, width: parseFloat(e.target.value) || 0 })}
                      placeholder="10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      value={shipmentForm.height}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, height: parseFloat(e.target.value) || 0 })}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Declared Value (DA)</Label>
                    <Input
                      type="number"
                      value={shipmentForm.declaredValue}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, declaredValue: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <h3 className="font-semibold">Shipping Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isStopDesk"
                      checked={shipmentForm.isStopDesk}
                      onCheckedChange={(checked) => setShipmentForm({ ...shipmentForm, isStopDesk: checked as boolean })}
                    />
                    <Label htmlFor="isStopDesk">Pickup Point Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="doInsurance"
                      checked={shipmentForm.doInsurance}
                      onCheckedChange={(checked) => setShipmentForm({ ...shipmentForm, doInsurance: checked as boolean })}
                    />
                    <Label htmlFor="doInsurance">Add Insurance</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="freeshipping"
                      checked={shipmentForm.freeshipping}
                      onCheckedChange={(checked) => setShipmentForm({ ...shipmentForm, freeshipping: checked as boolean })}
                    />
                    <Label htmlFor="freeshipping">Free Shipping</Label>
                  </div>
                </div>
              </div>

              <Button 
                onClick={createShipment} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Shipment...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Shipment
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Track Shipment Tab */}
        <TabsContent value="track" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Track Shipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="tracking" className="sr-only">Tracking Number</Label>
                  <Input
                    id="tracking"
                    placeholder="Enter tracking number (e.g., yal-123456)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchTracking()}
                  />
                </div>
                <Button onClick={searchTracking} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Tracking Results */}
              {trackingHistory.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Tracking History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trackingHistory.map((status, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatDate(status.date_status)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{status.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {status.center_name} - {status.commune_name}, {status.wilaya_name}
                          </TableCell>
                          <TableCell>{status.reason || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Shipment Details */}
              {shipmentDetails && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Shipment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Tracking Number</Label>
                      <p className="text-sm text-muted-foreground">{shipmentDetails.tracking}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Recipient</Label>
                      <p className="text-sm text-muted-foreground">
                        {shipmentDetails.firstname} {shipmentDetails.familyname}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-muted-foreground">{shipmentDetails.contact_phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm text-muted-foreground">{shipmentDetails.address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Destination</Label>
                      <p className="text-sm text-muted-foreground">
                        {shipmentDetails.to_commune_name}, {shipmentDetails.to_wilaya_name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <p className="text-sm text-muted-foreground">{shipmentDetails.last_status}</p>
                    </div>
                    {shipmentDetails.label && (
                      <div className="md:col-span-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(shipmentDetails.label, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Label
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Shipments Tab */}
        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Manage Shipments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Shipment management features will be available in the next update. 
                  For now, you can create and track individual shipments.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 