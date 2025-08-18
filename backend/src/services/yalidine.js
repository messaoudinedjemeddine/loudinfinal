const axios = require('axios');

class YalidineService {
  constructor() {
    this.baseURL = 'https://api.yalidine.app/v1';
    this.apiId = process.env.YALIDINE_API_ID;
    this.apiToken = process.env.YALIDINE_API_TOKEN;
    
    console.log('🔍 Yalidine API Debug Info:');
    console.log('API ID:', this.apiId ? `${this.apiId.substring(0, 10)}...` : 'NOT SET');
    console.log('API Token:', this.apiToken ? `${this.apiToken.substring(0, 10)}...` : 'NOT SET');
    console.log('Base URL:', this.baseURL);
    
    if (!this.apiId || !this.apiToken) {
      console.warn('⚠️ Yalidine API credentials not configured. Shipping features will be disabled.');
    }
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'X-API-ID': this.apiId,
        'X-API-TOKEN': this.apiToken,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // Increased timeout for better reliability
    });

    // Add response interceptor to log rate limit headers
    this.client.interceptors.response.use(
      (response) => {
        console.log('📊 Rate Limits:', {
          'Second-Quota-Left': response.headers['second-quota-left'],
          'Minute-Quota-Left': response.headers['minute-quota-left'],
          'Hour-Quota-Left': response.headers['hour-quota-left'],
          'Day-Quota-Left': response.headers['day-quota-left']
        });
        return response;
      },
      (error) => {
        if (error.response) {
          console.error('❌ API Error:', {
            status: error.response.status,
            data: error.response.data,
            headers: {
              'Second-Quota-Left': error.response.headers['second-quota-left'],
              'Minute-Quota-Left': error.response.headers['minute-quota-left'],
              'Hour-Quota-Left': error.response.headers['hour-quota-left'],
              'Day-Quota-Left': error.response.headers['day-quota-left']
            }
          });
        }
        return Promise.reject(error);
      }
    );
  }

  // Check if API is configured
  isConfigured() {
    return !!(this.apiId && this.apiToken);
  }

  // Get all wilayas (provinces)
  async getWilayas() {
    try {
      console.log('🔍 Fetching wilayas from Yalidine API...');
      const response = await this.client.get('/wilayas/');
      console.log('✅ Successfully fetched wilayas');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching wilayas:', error.message);
      throw new Error('Failed to fetch wilayas');
    }
  }

  // Get communes by wilaya
  async getCommunes(wilayaId = null) {
    try {
      const url = wilayaId ? `/communes/?wilaya_id=${wilayaId}` : '/communes/';
      console.log('🔍 Fetching communes from Yalidine API...', wilayaId ? `for wilaya ${wilayaId}` : '');
      const response = await this.client.get(url);
      console.log('✅ Successfully fetched communes');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching communes:', error.message);
      throw new Error('Failed to fetch communes');
    }
  }

  // Get pickup centers
  async getCenters(wilayaId = null) {
    try {
      const url = wilayaId ? `/centers/?wilaya_id=${wilayaId}` : '/centers/';
      console.log('🔍 Fetching centers from Yalidine API...', wilayaId ? `for wilaya ${wilayaId}` : '');
      const response = await this.client.get(url);
      console.log('✅ Successfully fetched centers');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching centers:', error.message);
      throw new Error('Failed to fetch pickup centers');
    }
  }

  // Calculate shipping fees
  async calculateFees(fromWilayaId, toWilayaId) {
    try {
      console.log('🔍 Calculating fees from wilaya', fromWilayaId, 'to wilaya', toWilayaId);
      const response = await this.client.get(`/fees/?from_wilaya_id=${fromWilayaId}&to_wilaya_id=${toWilayaId}`);
      console.log('✅ Successfully calculated fees');
      return response.data;
    } catch (error) {
      console.error('❌ Error calculating fees:', error.message);
      throw new Error('Failed to calculate shipping fees');
    }
  }

  // Create a new parcel/shipment
  async createParcel(parcelData) {
    try {
      console.log('🔍 Creating parcel with data:', {
        order_id: parcelData.order_id,
        firstname: parcelData.firstname,
        familyname: parcelData.familyname,
        contact_phone: parcelData.contact_phone,
        to_wilaya_name: parcelData.to_wilaya_name,
        to_commune_name: parcelData.to_commune_name
      });
      
      const response = await this.client.post('/parcels/', [parcelData]);
      console.log('✅ Successfully created parcel');
      return response.data;
    } catch (error) {
      console.error('❌ Error creating parcel:', error.message);
      if (error.response && error.response.data) {
        console.error('API Error details:', error.response.data);
      }
      throw new Error('Failed to create shipment');
    }
  }

  // Create multiple parcels
  async createParcels(parcelsData) {
    try {
      console.log('🔍 Creating multiple parcels:', parcelsData.length);
      const response = await this.client.post('/parcels/', parcelsData);
      console.log('✅ Successfully created parcels');
      return response.data;
    } catch (error) {
      console.error('❌ Error creating parcels:', error.message);
      throw new Error('Failed to create shipments');
    }
  }

  // Get parcel details
  async getParcel(tracking) {
    try {
      console.log('🔍 Fetching parcel details for tracking:', tracking);
      const response = await this.client.get(`/parcels/${tracking}`);
      console.log('✅ Successfully fetched parcel details');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching parcel:', error.message);
      throw new Error('Failed to fetch parcel details');
    }
  }

  // Get parcel history/tracking
  async getParcelHistory(tracking) {
    try {
      console.log('🔍 Fetching parcel history for tracking:', tracking);
      const response = await this.client.get(`/histories/?tracking=${tracking}`);
      console.log('✅ Successfully fetched parcel history');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching parcel history:', error.message);
      throw new Error('Failed to fetch tracking information');
    }
  }

  // Update parcel
  async updateParcel(tracking, updateData) {
    try {
      console.log('🔍 Updating parcel:', tracking);
      const response = await this.client.patch(`/parcels/${tracking}`, updateData);
      console.log('✅ Successfully updated parcel');
      return response.data;
    } catch (error) {
      console.error('❌ Error updating parcel:', error.message);
      throw new Error('Failed to update shipment');
    }
  }

  // Delete parcel
  async deleteParcel(tracking) {
    try {
      console.log('🔍 Deleting parcel:', tracking);
      const response = await this.client.delete(`/parcels/${tracking}`);
      console.log('✅ Successfully deleted parcel');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting parcel:', error.message);
      throw new Error('Failed to delete shipment');
    }
  }

  // Calculate weight fees
  calculateWeightFees(weight, oversizeFee) {
    if (weight <= 5) return 0;
    return (weight - 5) * oversizeFee;
  }

  // Calculate volumetric weight
  calculateVolumetricWeight(length, width, height) {
    return (length * width * height * 0.0002);
  }

  // Get billable weight
  getBillableWeight(actualWeight, length, width, height) {
    const volumetricWeight = this.calculateVolumetricWeight(length, width, height);
    return Math.max(actualWeight, volumetricWeight);
  }

  // Calculate total shipping cost
  calculateTotalCost(baseFee, weight, oversizeFee, codPercentage = 0, declaredValue = 0) {
    const weightFee = this.calculateWeightFees(weight, oversizeFee);
    const codFee = codPercentage > 0 ? (declaredValue * codPercentage / 100) : 0;
    
    return {
      baseFee,
      weightFee,
      codFee,
      total: baseFee + weightFee + codFee
    };
  }

  // Validate phone number (Algerian format)
  validatePhoneNumber(phone) {
    const phoneRegex = /^0[5-7][0-9]{8}$/; // Mobile: 05xxxxxxxx, 06xxxxxxxx, 07xxxxxxxx
    const landlineRegex = /^0[2-4][0-9]{7}$/; // Landline: 02xxxxxxx, 03xxxxxxx, 04xxxxxxx
    
    return phoneRegex.test(phone) || landlineRegex.test(phone);
  }

  // Format parcel data for API
  formatParcelData(orderData) {
    const {
      orderId,
      customerName,
      customerPhone,
      customerAddress,
      fromWilayaName,
      toWilayaName,
      toCommuneName,
      productList,
      price,
      weight,
      length,
      width,
      height,
      isStopDesk = false,
      stopDeskId = null,
      doInsurance = false,
      declaredValue = 0,
      freeshipping = false,
      hasExchange = false,
      productToCollect = null
    } = orderData;

    // Split customer name into first and last name
    const nameParts = customerName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      order_id: orderId,
      from_wilaya_name: fromWilayaName,
      firstname: firstName,
      familyname: lastName,
      contact_phone: customerPhone,
      address: customerAddress,
      to_commune_name: toCommuneName,
      to_wilaya_name: toWilayaName,
      product_list: productList,
      price: Math.round(price),
      do_insurance: doInsurance,
      declared_value: Math.round(declaredValue),
      length: Math.round(length),
      width: Math.round(width),
      height: Math.round(height),
      weight: Math.round(weight),
      freeshipping: freeshipping,
      is_stopdesk: isStopDesk,
      stopdesk_id: stopDeskId,
      has_exchange: hasExchange,
      product_to_collect: productToCollect
    };
  }

  // Test API connection
  async testConnection() {
    try {
      console.log('🔍 Testing Yalidine API connection...');
      const response = await this.client.get('/wilayas/');
      console.log('✅ API connection successful');
      return {
        success: true,
        message: 'API connection successful',
        data: response.data
      };
    } catch (error) {
      console.error('❌ API connection failed:', error.message);
      return {
        success: false,
        message: error.message,
        error: error.response ? error.response.data : null
      };
    }
  }

  // Get API status and rate limits
  async getApiStatus() {
    try {
      const response = await this.client.get('/wilayas/');
      return {
        status: 'connected',
        rateLimits: {
          secondQuotaLeft: response.headers['second-quota-left'],
          minuteQuotaLeft: response.headers['minute-quota-left'],
          hourQuotaLeft: response.headers['hour-quota-left'],
          dayQuotaLeft: response.headers['day-quota-left']
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}

module.exports = new YalidineService(); 