'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  User, 
  Truck, 
  Check, 
  CreditCard, 
  ArrowLeft, 
  ArrowRight,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

// Wilaya data for Algeria
const WILAYAS = [
  { id: 1, name: 'Adrar', nameAr: 'أدرار' },
  { id: 2, name: 'Chlef', nameAr: 'الشلف' },
  { id: 3, name: 'Laghouat', nameAr: 'الأغواط' },
  { id: 4, name: 'Oum El Bouaghi', nameAr: 'أم البواقي' },
  { id: 5, name: 'Batna', nameAr: 'باتنة' },
  { id: 6, name: 'Béjaïa', nameAr: 'بجاية' },
  { id: 7, name: 'Biskra', nameAr: 'بسكرة' },
  { id: 8, name: 'Béchar', nameAr: 'بشار' },
  { id: 9, name: 'Blida', nameAr: 'البليدة' },
  { id: 10, name: 'Bouira', nameAr: 'البويرة' },
  { id: 11, name: 'Tamanrasset', nameAr: 'تمنراست' },
  { id: 12, name: 'Tébessa', nameAr: 'تبسة' },
  { id: 13, name: 'Tlemcen', nameAr: 'تلمسان' },
  { id: 14, name: 'Tiaret', nameAr: 'تيارت' },
  { id: 15, name: 'Tizi Ouzou', nameAr: 'تيزي وزو' },
  { id: 16, name: 'Algiers', nameAr: 'الجزائر' },
  { id: 17, name: 'Djelfa', nameAr: 'الجلفة' },
  { id: 18, name: 'Jijel', nameAr: 'جيجل' },
  { id: 19, name: 'Sétif', nameAr: 'سطيف' },
  { id: 20, name: 'Saïda', nameAr: 'سعيدة' },
  { id: 21, name: 'Skikda', nameAr: 'سكيكدة' },
  { id: 22, name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس' },
  { id: 23, name: 'Annaba', nameAr: 'عنابة' },
  { id: 24, name: 'Guelma', nameAr: 'قالمة' },
  { id: 25, name: 'Constantine', nameAr: 'قسنطينة' },
  { id: 26, name: 'Médéa', nameAr: 'المدية' },
  { id: 27, name: 'Mostaganem', nameAr: 'مستغانم' },
  { id: 28, name: "M'Sila", nameAr: 'المسيلة' },
  { id: 29, name: 'Mascara', nameAr: 'معسكر' },
  { id: 30, name: 'Ouargla', nameAr: 'ورقلة' },
  { id: 31, name: 'Oran', nameAr: 'وهران' },
  { id: 32, name: 'El Bayadh', nameAr: 'البيض' },
  { id: 33, name: 'Illizi', nameAr: 'إليزي' },
  { id: 34, name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج' },
  { id: 35, name: 'Boumerdès', nameAr: 'بومرداس' },
  { id: 36, name: 'El Tarf', nameAr: 'الطارف' },
  { id: 37, name: 'Tindouf', nameAr: 'تندوف' },
  { id: 38, name: 'Tissemsilt', nameAr: 'تيسمسيلت' },
  { id: 39, name: 'El Oued', nameAr: 'الوادي' },
  { id: 40, name: 'Khenchela', nameAr: 'خنشلة' },
  { id: 41, name: 'Souk Ahras', nameAr: 'سوق أهراس' },
  { id: 42, name: 'Tipaza', nameAr: 'تيبازة' },
  { id: 43, name: 'Mila', nameAr: 'ميلة' },
  { id: 44, name: 'Aïn Defla', nameAr: 'عين الدفلى' },
  { id: 45, name: 'Naâma', nameAr: 'النعامة' },
  { id: 46, name: 'Aïn Témouchent', nameAr: 'عين تموشنت' },
  { id: 47, name: 'Ghardaïa', nameAr: 'غرداية' },
  { id: 48, name: 'Relizane', nameAr: 'غليزان' },
  { id: 49, name: 'Timimoun', nameAr: 'تيميمون' },
  { id: 50, name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار' },
  { id: 51, name: 'Ouled Djellal', nameAr: 'أولاد جلال' },
  { id: 52, name: 'Béni Abbès', nameAr: 'بني عباس' },
  { id: 53, name: 'In Salah', nameAr: 'عين صالح' },
  { id: 54, name: 'In Guezzam', nameAr: 'عين قزام' },
  { id: 55, name: 'Touggourt', nameAr: 'تقرت' },
  { id: 56, name: 'Djanet', nameAr: 'جانت' },
  { id: 57, name: "M'Sila", nameAr: 'المسيلة' },
  { id: 58, name: 'El M\'Ghair', nameAr: 'المغير' }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  sizeId?: string;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryType: 'HOME_DELIVERY' | 'PICKUP';
  deliveryAddress: string;
  wilayaId: string;
  notes: string;
}

export default function CheckoutNewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryType: 'HOME_DELIVERY',
    deliveryAddress: '',
    wilayaId: '5', // Default to Batna
    notes: ''
  });

  // Load cart items on component mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          const cart = JSON.parse(cartData);
          if (cart.items && cart.items.length > 0) {
            setItems(cart.items);
          } else {
            toast.error('Your cart is empty');
            router.push('/products');
          }
        } else {
          toast.error('No cart found');
          router.push('/products');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        toast.error('Error loading cart');
        router.push('/products');
      }
    };

    loadCart();
  }, [router]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    return formData.deliveryType === 'HOME_DELIVERY' ? 500 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const validateStep1 = () => {
    if (!formData.customerName.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.customerPhone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (formData.customerPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.wilayaId) {
      toast.error('Please select a wilaya');
      return false;
    }
    if (formData.deliveryType === 'HOME_DELIVERY' && !formData.deliveryAddress.trim()) {
      toast.error('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setItems([]);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep1() || !validateStep2()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('🔍 Starting order creation...');
      console.log('📦 Cart items:', items);
      console.log('📝 Form data:', formData);

      // Prepare order data
      const orderData = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        deliveryType: formData.deliveryType,
        deliveryAddress: formData.deliveryType === 'HOME_DELIVERY' ? formData.deliveryAddress.trim() : undefined,
        wilayaId: parseInt(formData.wilayaId),
        notes: formData.notes.trim() || undefined,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          sizeId: item.sizeId
        }))
      };

      console.log('📋 Order data being sent:', orderData);

      // Make API call
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      console.log('📊 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Order created successfully:', result);

      // Clear cart
      clearCart();
      
      // Redirect to success page
      router.push(`/order-success?orderNumber=${result.order.orderNumber}`);
      
      toast.success('Order placed successfully!');
    } catch (error: any) {
      console.error('❌ Order creation failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Customer Info', icon: User },
    { number: 2, title: 'Delivery', icon: Truck },
    { number: 3, title: 'Review', icon: Check }
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Checkout
              </h1>
              <p className="text-lg text-muted-foreground">
                Complete your order safely and easily
              </p>
            </motion.div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.number
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground text-muted-foreground'
                    }`}>
                      {currentStep > step.number ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`ml-2 font-medium ${
                      currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        currentStep > step.number ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <Card>
                <CardContent className="p-6">
                  {/* Step 1: Customer Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-2 mb-6">
                        <User className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold">Customer Information</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerName">Full Name *</Label>
                          <Input
                            id="customerName"
                            value={formData.customerName}
                            onChange={(e) => updateFormData('customerName', e.target.value)}
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customerPhone">Phone Number *</Label>
                          <Input
                            id="customerPhone"
                            value={formData.customerPhone}
                            onChange={(e) => updateFormData('customerPhone', e.target.value)}
                            placeholder="e.g., 0550123456"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customerEmail">Email (Optional)</Label>
                          <Input
                            id="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => updateFormData('customerEmail', e.target.value)}
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Delivery Information */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-2 mb-6">
                        <Truck className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold">Delivery Information</h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label>Delivery Type</Label>
                          <RadioGroup
                            value={formData.deliveryType}
                            onValueChange={(value: 'HOME_DELIVERY' | 'PICKUP') => 
                              updateFormData('deliveryType', value)
                            }
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="HOME_DELIVERY" id="home-delivery" />
                              <Label htmlFor="home-delivery">Home Delivery</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="PICKUP" id="pickup" />
                              <Label htmlFor="pickup">Pickup from Store</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="wilayaId">Wilaya *</Label>
                          <Select value={formData.wilayaId} onValueChange={(value) => updateFormData('wilayaId', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your wilaya" />
                            </SelectTrigger>
                            <SelectContent>
                              {WILAYAS.map((wilaya) => (
                                <SelectItem key={wilaya.id} value={wilaya.id.toString()}>
                                  {wilaya.name} - {wilaya.nameAr}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.deliveryType === 'HOME_DELIVERY' && (
                          <div className="space-y-2">
                            <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                            <Textarea
                              id="deliveryAddress"
                              value={formData.deliveryAddress}
                              onChange={(e) => updateFormData('deliveryAddress', e.target.value)}
                              placeholder="Enter your complete delivery address"
                              rows={3}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="notes">Order Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => updateFormData('notes', e.target.value)}
                            placeholder="Any special instructions or notes"
                            rows={3}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-2 mb-6">
                        <Check className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-semibold">Review Your Order</h2>
                      </div>

                      {/* Customer Information Review */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Customer Information</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{formData.customerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">{formData.customerPhone}</span>
                          </div>
                          {formData.customerEmail && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Email:</span>
                              <span className="font-medium">{formData.customerEmail}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Delivery Information Review */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Truck className="w-4 h-4" />
                            <span>Delivery Information</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">
                              {formData.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Pickup'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Wilaya:</span>
                            <span className="font-medium">
                              {WILAYAS.find(w => w.id.toString() === formData.wilayaId)?.name}
                            </span>
                          </div>
                          {formData.deliveryType === 'HOME_DELIVERY' && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Address:</span>
                              <span className="font-medium">{formData.deliveryAddress}</span>
                            </div>
                          )}
                          {formData.notes && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Notes:</span>
                              <span className="font-medium">{formData.notes}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        onClick={handleNext}
                        className="flex items-center space-x-2"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Placing Order...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Place Order</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.sizeId || 'no-size'}`} className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 bg-muted rounded-md overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          {item.size && (
                            <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                          )}
                          <p className="text-sm">
                            {item.quantity} × {item.price.toLocaleString()} DA
                          </p>
                        </div>
                        <p className="font-medium">
                          {(item.quantity * item.price).toLocaleString()} DA
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{calculateSubtotal().toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{calculateDeliveryFee().toLocaleString()} DA</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">{calculateTotal().toLocaleString()} DA</span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="font-medium">Payment Method</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cash on Delivery (COD)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
