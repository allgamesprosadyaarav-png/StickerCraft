import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const ADMIN_PHONE = '9354040524'; // Your phone number for SMS notifications
const SHIPROCKET_EMAIL = 'admin@stickercraft.com'; // Update with your Shiprocket account email
const SHIPROCKET_PASSWORD = 'YOUR_PASSWORD'; // Update with your Shiprocket password

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderId, 
      orderTotal, 
      customerName, 
      customerPhone, 
      customerEmail,
      shippingAddress,
      items 
    } = await req.json();

    if (!orderId || !customerName || !shippingAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required order details' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('📦 Creating delivery order:', orderId);

    // Step 1: Authenticate with Shiprocket
    const shiprocketApiKey = Deno.env.get('SHIPROCKET_API_KEY');
    let authToken = '';

    if (shiprocketApiKey) {
      // Use API key if available
      authToken = shiprocketApiKey;
    } else {
      // Otherwise, login to get token
      try {
        const loginResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: SHIPROCKET_EMAIL,
            password: SHIPROCKET_PASSWORD,
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          authToken = loginData.token;
          console.log('✅ Shiprocket authentication successful');
        } else {
          console.warn('⚠️ Shiprocket login failed, will send SMS notification only');
        }
      } catch (loginError) {
        console.warn('⚠️ Shiprocket authentication error:', loginError);
      }
    }

    let trackingNumber = '';
    let awbCode = '';
    let courierName = '';

    // Step 2: Create Shiprocket order (if authenticated)
    if (authToken) {
      try {
        const shiprocketOrderData = {
          order_id: orderId,
          order_date: new Date().toISOString().split('T')[0],
          pickup_location: 'Primary', // Update with your Shiprocket pickup location name
          billing_customer_name: customerName,
          billing_last_name: '',
          billing_address: shippingAddress.address || '',
          billing_city: shippingAddress.city || '',
          billing_pincode: shippingAddress.pincode || '',
          billing_state: shippingAddress.state || '',
          billing_country: shippingAddress.country || 'India',
          billing_email: customerEmail,
          billing_phone: customerPhone,
          shipping_is_billing: true,
          order_items: items.map((item: any) => ({
            name: item.product.name,
            sku: item.product.id,
            units: item.quantity,
            selling_price: item.product.price,
          })),
          payment_method: 'Prepaid',
          sub_total: orderTotal,
          length: 10, // Package dimensions in cm
          breadth: 10,
          height: 5,
          weight: 0.1, // Weight in kg
        };

        const createOrderResponse = await fetch(
          'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(shiprocketOrderData),
          }
        );

        if (createOrderResponse.ok) {
          const orderData = await createOrderResponse.json();
          trackingNumber = orderData.shipment_id || '';
          awbCode = orderData.awb_code || '';
          courierName = orderData.courier_name || 'Shiprocket';
          console.log('✅ Shiprocket order created:', trackingNumber);
        } else {
          const errorText = await createOrderResponse.text();
          console.error('❌ Shiprocket order creation failed:', errorText);
        }
      } catch (shiprocketError) {
        console.error('❌ Shiprocket API error:', shiprocketError);
      }
    }

    // Step 3: Send SMS notification to admin
    const itemsList = items.map((item: any) => 
      `${item.quantity}x ${item.product.name} (₹${item.product.price})`
    ).join(', ');

    const smsMessage = `🎉 NEW ORDER #${orderId}
Customer: ${customerName}
Phone: ${customerPhone}
Items: ${itemsList}
Total: ₹${orderTotal}
Address: ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}
${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`;

    // Send SMS via Fast2SMS (you'll need to add API key in Secrets)
    const fast2smsApiKey = Deno.env.get('FAST2SMS_API_KEY');
    if (fast2smsApiKey) {
      try {
        const smsResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': fast2smsApiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            route: 'q',
            message: smsMessage,
            flash: 0,
            numbers: ADMIN_PHONE,
          }),
        });

        if (smsResponse.ok) {
          console.log('✅ SMS notification sent to', ADMIN_PHONE);
        } else {
          console.warn('⚠️ SMS sending failed');
        }
      } catch (smsError) {
        console.error('❌ SMS error:', smsError);
      }
    }

    // Send WhatsApp notification via WATI or Gupshup (optional)
    const watiApiKey = Deno.env.get('WATI_API_KEY');
    if (watiApiKey) {
      try {
        const whatsappMessage = smsMessage.replace(/\n/g, '\\n');
        const whatsappResponse = await fetch('https://live-server-XXXX.wati.io/api/v1/sendSessionMessage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${watiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: ADMIN_PHONE,
            message: whatsappMessage,
          }),
        });

        if (whatsappResponse.ok) {
          console.log('✅ WhatsApp notification sent');
        }
      } catch (whatsappError) {
        console.error('❌ WhatsApp error:', whatsappError);
      }
    }

    console.log('📱 Order notification logged for admin:', ADMIN_PHONE);

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId,
        trackingNumber: trackingNumber || 'Will be assigned shortly',
        awbCode,
        courierName: courierName || 'Shiprocket',
        message: 'Order created successfully. You will receive tracking details via SMS.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('❌ Delivery Order Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
