'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin, Truck, Package, Calculator } from 'lucide-react';
import { yalidineAPI, Wilaya, Commune, Center, ShippingFees } from '@/lib/yalidine-api';

interface ShippingCalculatorProps {
  onShippingSelected: (shippingData: {
    method: string;
    cost: number;
    deliveryTime: number;
    trackingNumber?: string;
  }) => void;
  orderTotal: number;
  items: Array<{
    id: string;
    name: string;
    weight: number;
    dimensions: { length: number; width: number; height: number };
  }>;
}

export function ShippingCalculator({ onShippingSelected, orderTotal, items }: ShippingCalculatorProps) {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [yalidineStatus, setYalidineStatus] = useState<{ configured: boolean; message: string } | null>(null);

  // Form state
  const [fromWilayaId, setFromWilayaId] = useState<number>(16); // Default: Alger
  const [toWilayaId, setToWilayaId] = useState<number>(16);
  const [toCommuneId, setToCommuneId] = useState<number | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'desk'>('home');
  const [serviceType, setServiceType] = useState<'express' | 'economic'>('express');
  const [isStopDesk, setIsStopDesk] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  const [doInsurance, setDoInsurance] = useState(false);
  const [declaredValue, setDeclaredValue] = useState(orderTotal);

  // Results
  const [shippingFees, setShippingFees] = useState<ShippingFees | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate total weight and dimensions
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const maxDimensions = items.reduce(
    (max, item) => ({
      length: Math.max(max.length, item.dimensions.length),
      width: Math.max(max.width, item.dimensions.width),
      height: Math.max(max.height, item.dimensions.height),
    }),
    { length: 0, width: 0, height: 0 }
  );

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load wilayas and communes when wilaya changes
  useEffect(() => {
    if (toWilayaId) {
      loadCommunes(toWilayaId);
      loadCenters(toWilayaId);
    }
  }, [toWilayaId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Check Yalidine status
      const status = await yalidineAPI.getStatus();
      setYalidineStatus(status);
      
      if (!status.configured) {
        setError('Yalidine shipping is not configured. Please contact support.');
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
      setError('Failed to load shipping data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCommunes = async (wilayaId: number) => {
    try {
      const communesData = await yalidineAPI.getCommunes(wilayaId);
      setCommunes(communesData.data);
      setToCommuneId(null); // Reset commune selection
    } catch (error) {
      console.error('Error loading communes:', error);
    }
  };

  const loadCenters = async (wilayaId: number) => {
    try {
      const centersData = await yalidineAPI.getCenters(wilayaId);
      setCenters(centersData.data);
      setSelectedCenter(null); // Reset center selection
    } catch (error) {
      console.error('Error loading centers:', error);
    }
  };

  const calculateShipping = async () => {
    if (!toWilayaId) {
      setError('Please select a destination wilaya');
      return;
    }

    try {
      setCalculating(true);
      setError(null);

      const fees = await yalidineAPI.calculateFees({
        fromWilayaId,
        toWilayaId,
        weight: totalWeight,
        length: maxDimensions.length,
        width: maxDimensions.width,
        height: maxDimensions.height,
        declaredValue: doInsurance ? declaredValue : undefined,
      });

      setShippingFees(fees);
    } catch (error) {
      console.error('Error calculating shipping:', error);
      setError('Failed to calculate shipping costs. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  const selectShippingMethod = () => {
    if (!shippingFees) return;

    const deliveryOptions = shippingFees.deliveryOptions[serviceType];
    const cost = deliveryOptions[deliveryMethod] || 0;
    
    // Estimate delivery time based on commune data
    const selectedCommune = communes.find(c => c.id === toCommuneId);
    const deliveryTime = selectedCommune?.delivery_time_parcel || 3; // Default 3 days

    onShippingSelected({
      method: `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} ${deliveryMethod === 'home' ? 'Home' : 'Pickup'} Delivery`,
      cost,
      deliveryTime,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading shipping options...</span>
        </CardContent>
      </Card>
    );
  }

  if (!yalidineStatus?.configured) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>
              {yalidineStatus?.message || 'Shipping service is currently unavailable. Please contact support.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Package Information */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Package className="h-4 w-4" />
            Package Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Total Weight</Label>
              <p className="text-muted-foreground">{totalWeight} kg</p>
            </div>
            <div>
              <Label>Dimensions</Label>
              <p className="text-muted-foreground">
                {maxDimensions.length} × {maxDimensions.width} × {maxDimensions.height} cm
              </p>
            </div>
          </div>
        </div>

        {/* Origin */}
        <div className="space-y-2">
          <Label>From Wilaya (Origin)</Label>
          <Select value={fromWilayaId.toString()} onValueChange={(value) => setFromWilayaId(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select origin wilaya" />
            </SelectTrigger>
            <SelectContent>
              {wilayas.map((wilaya) => (
                <SelectItem key={wilaya.id} value={wilaya.id.toString()}>
                  {wilaya.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Destination */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>To Wilaya (Destination)</Label>
            <Select value={toWilayaId.toString()} onValueChange={(value) => setToWilayaId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination wilaya" />
              </SelectTrigger>
              <SelectContent>
                {wilayas.map((wilaya) => (
                  <SelectItem key={wilaya.id} value={wilaya.id.toString()}>
                    {wilaya.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Commune</Label>
            <Select value={toCommuneId?.toString() || ''} onValueChange={(value) => setToCommuneId(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select commune" />
              </SelectTrigger>
              <SelectContent>
                {communes.map((commune) => (
                  <SelectItem key={commune.id} value={commune.id.toString()}>
                    {commune.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="space-y-4">
          <h3 className="font-semibold">Delivery Options</h3>
          
          <div className="space-y-2">
            <Label>Service Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="express"
                  name="serviceType"
                  value="express"
                  checked={serviceType === 'express'}
                  onChange={(e) => setServiceType(e.target.value as 'express' | 'economic')}
                  className="w-4 h-4"
                />
                <Label htmlFor="express">Express</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="economic"
                  name="serviceType"
                  value="economic"
                  checked={serviceType === 'economic'}
                  onChange={(e) => setServiceType(e.target.value as 'express' | 'economic')}
                  className="w-4 h-4"
                />
                <Label htmlFor="economic">Economic</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="home"
                  name="deliveryMethod"
                  value="home"
                  checked={deliveryMethod === 'home'}
                  onChange={(e) => setDeliveryMethod(e.target.value as 'home' | 'desk')}
                  className="w-4 h-4"
                />
                <Label htmlFor="home">Home Delivery</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="desk"
                  name="deliveryMethod"
                  value="desk"
                  checked={deliveryMethod === 'desk'}
                  onChange={(e) => setDeliveryMethod(e.target.value as 'home' | 'desk')}
                  className="w-4 h-4"
                />
                <Label htmlFor="desk">Pickup Point</Label>
              </div>
            </div>
          </div>

          {deliveryMethod === 'desk' && centers.length > 0 && (
            <div className="space-y-2">
              <Label>Pickup Center</Label>
              <Select value={selectedCenter?.toString() || ''} onValueChange={(value) => setSelectedCenter(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pickup center" />
                </SelectTrigger>
                <SelectContent>
                  {centers.map((center) => (
                    <SelectItem key={center.center_id} value={center.center_id.toString()}>
                      {center.name} - {center.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Insurance */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="insurance"
              checked={doInsurance}
              onCheckedChange={(checked) => setDoInsurance(checked as boolean)}
            />
            <Label htmlFor="insurance">Add Insurance</Label>
          </div>
          
          {doInsurance && (
            <div className="space-y-2">
              <Label>Declared Value (DA)</Label>
              <Input
                type="number"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(parseFloat(e.target.value) || 0)}
                placeholder="Enter declared value"
                min="0"
              />
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={calculateShipping} 
          disabled={calculating || !toWilayaId || !toCommuneId}
          className="w-full"
        >
          {calculating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Shipping
            </>
          )}
        </Button>

        {/* Results */}
        {shippingFees && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold">Shipping Options</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Express Home Delivery:</span>
                <span className="font-semibold">{shippingFees.deliveryOptions.express.home} DA</span>
              </div>
              <div className="flex justify-between">
                <span>Express Pickup:</span>
                <span className="font-semibold">{shippingFees.deliveryOptions.express.desk} DA</span>
              </div>
              {shippingFees.deliveryOptions.economic.home && (
                <div className="flex justify-between">
                  <span>Economic Home Delivery:</span>
                  <span className="font-semibold">{shippingFees.deliveryOptions.economic.home} DA</span>
                </div>
              )}
              {shippingFees.deliveryOptions.economic.desk && (
                <div className="flex justify-between">
                  <span>Economic Pickup:</span>
                  <span className="font-semibold">{shippingFees.deliveryOptions.economic.desk} DA</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Weight Fees:</span>
                <span>{shippingFees.weightFees} DA</span>
              </div>
              {doInsurance && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Insurance Fees:</span>
                  <span>{shippingFees.codFees} DA</span>
                </div>
              )}
            </div>

            <Button onClick={selectShippingMethod} className="w-full">
              Select This Option
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 