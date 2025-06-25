const axios = require('axios');

class YalidineService {
  constructor() {
    this.baseURL = 'https://api.yalidine.app/v1';
    this.apiId = process.env.YALIDINE_API_ID;
    this.apiToken = process.env.YALIDINE_API_TOKEN;
    
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
      timeout: 10000
    });
  }

  // Check if API is configured
  isConfigured() {
    return !!(this.apiId && this.apiToken);
  }

  // Get all wilayas (provinces)
  async getWilayas() {
    try {
      const response = await this.client.get('/wilayas/');
      return response.data;
    } catch (error) {
      console.error('Error fetching wilayas:', error.message);
      throw new Error('Failed to fetch wilayas');
    }
  }

  // Get communes by wilaya
  async getCommunes(wilayaId = null) {
    try {
      const url = wilayaId ? `/communes/?wilaya_id=${wilayaId}` : '/communes/';
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching communes:', error.message);
      throw new Error('Failed to fetch communes');
    }
  }

  // Get pickup centers
  async getCenters(wilayaId = null) {
    try {
      const url = wilayaId ? `/centers/?wilaya_id=${wilayaId}` : '/centers/';
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching centers:', error.message);
      throw new Error('Failed to fetch pickup centers');
    }
  }

  // Calculate shipping fees
  async calculateFees(fromWilayaId, toWilayaId) {
    try {
      const response = await this.client.get(`/fees/?from_wilaya_id=${fromWilayaId}&to_wilaya_id=${toWilayaId}`);
      return response.data;
    } catch (error) {
      console.error('Error calculating fees:', error.message);
      throw new Error('Failed to calculate shipping fees');
    }
  }

  // Create a new parcel/shipment
  async createParcel(parcelData) {
    try {
      const response = await this.client.post('/parcels/', [parcelData]);
      return response.data;
    } catch (error) {
      console.error('Error creating parcel:', error.message);
      throw new Error('Failed to create shipment');
    }
  }

  // Create multiple parcels
  async createParcels(parcelsData) {
    try {
      const response = await this.client.post('/parcels/', parcelsData);
      return response.data;
    } catch (error) {
      console.error('Error creating parcels:', error.message);
      throw new Error('Failed to create shipments');
    }
  }

  // Get parcel details
  async getParcel(tracking) {
    try {
      const response = await this.client.get(`/parcels/${tracking}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parcel:', error.message);
      throw new Error('Failed to fetch parcel details');
    }
  }

  // Get parcel history/tracking
  async getParcelHistory(tracking) {
    try {
      const response = await this.client.get(`/histories/?tracking=${tracking}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parcel history:', error.message);
      throw new Error('Failed to fetch tracking information');
    }
  }

  // Update parcel
  async updateParcel(tracking, updateData) {
    try {
      const response = await this.client.patch(`/parcels/${tracking}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating parcel:', error.message);
      throw new Error('Failed to update shipment');
    }
  }

  // Delete parcel
  async deleteParcel(tracking) {
    try {
      const response = await this.client.delete(`/parcels/${tracking}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting parcel:', error.message);
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
}

module.exports = new YalidineService(); 