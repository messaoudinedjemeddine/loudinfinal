'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Search, Package, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { yalidineAPI, TrackingHistory } from '@/lib/yalidine-api';

interface TrackingComponentProps {
  initialTrackingNumber?: string;
}

const statusIcons = {
  'Livré': <CheckCircle className="h-4 w-4 text-green-500" />,
  'Echèc livraison': <XCircle className="h-4 w-4 text-red-500" />,
  'En attente': <Clock className="h-4 w-4 text-yellow-500" />,
  'Sorti en livraison': <Package className="h-4 w-4 text-blue-500" />,
  'Expédié': <Package className="h-4 w-4 text-blue-500" />,
  'Centre': <MapPin className="h-4 w-4 text-purple-500" />,
  'default': <AlertCircle className="h-4 w-4 text-gray-500" />
};

const statusColors = {
  'Livré': 'bg-green-100 text-green-800 border-green-200',
  'Echèc livraison': 'bg-red-100 text-red-800 border-red-200',
  'En attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Sorti en livraison': 'bg-blue-100 text-blue-800 border-blue-200',
  'Expédié': 'bg-blue-100 text-blue-800 border-blue-200',
  'Centre': 'bg-purple-100 text-purple-800 border-purple-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

export function TrackingComponent({ initialTrackingNumber }: TrackingComponentProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || '');
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistory[]>([]);
  const [shipmentDetails, setShipmentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchTracking = async () => {
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

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
      setError(error.response?.data?.error || 'Failed to find tracking information');
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

  const getStatusIcon = (status: string) => {
    return statusIcons[status as keyof typeof statusIcons] || statusIcons.default;
  };

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || statusColors.default;
  };

  const getCurrentStatus = () => {
    if (trackingHistory.length === 0) return null;
    return trackingHistory[0]; // Most recent status
  };

  const currentStatus = getCurrentStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Track Your Package
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Status */}
      {currentStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {getStatusIcon(currentStatus.status)}
              <div className="flex-1">
                <Badge className={getStatusColor(currentStatus.status)}>
                  {currentStatus.status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(currentStatus.date_status)}
                </p>
                {currentStatus.reason && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Reason: {currentStatus.reason}
                  </p>
                )}
              </div>
            </div>
            {currentStatus.center_name && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">
                  {currentStatus.center_name} - {currentStatus.commune_name}, {currentStatus.wilaya_name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shipment Details */}
      {shipmentDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Shipment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Recipient</Label>
                <p className="text-sm text-muted-foreground">
                  {shipmentDetails.firstname} {shipmentDetails.familyname}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-muted-foreground">
                  {shipmentDetails.contact_phone}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-muted-foreground">
                  {shipmentDetails.address}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Destination</Label>
                <p className="text-sm text-muted-foreground">
                  {shipmentDetails.to_commune_name}, {shipmentDetails.to_wilaya_name}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Product</Label>
                <p className="text-sm text-muted-foreground">
                  {shipmentDetails.product_list}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Value</Label>
                <p className="text-sm text-muted-foreground">
                  {shipmentDetails.price} DA
                </p>
              </div>
              {shipmentDetails.label && (
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">Shipping Label</Label>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(shipmentDetails.label, '_blank')}
                    >
                      View Label
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking History */}
      {trackingHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracking History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingHistory.map((status, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {getStatusIcon(status.status)}
                    {index < trackingHistory.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getStatusColor(status.status)}>
                        {status.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(status.date_status)}
                      </span>
                    </div>
                    {status.reason && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {status.reason}
                      </p>
                    )}
                    <div className="text-sm text-muted-foreground">
                      <p>{status.center_name}</p>
                      <p>{status.commune_name}, {status.wilaya_name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searched && !loading && trackingHistory.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tracking information found</h3>
            <p className="text-muted-foreground">
              Please check your tracking number and try again.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 