import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const ADMIN_PHONE = '9354040524'; // Your phone number for order notifications

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, orderTotal, customerName, customerPhone, items } = await req.json();

    if (!orderId || !orderTotal) {
      return new Response(
        JSON.stringify({ error: 'Order details required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create WhatsApp message
    const itemsList = items.map((item: any) => 
      `${item.quantity}x ${item.product.name} (₹${item.product.price})`
    ).join('\\n');

    const message = `🎉 *NEW ORDER RECEIVED!*\\n\\n` +
      `Order ID: ${orderId}\\n` +
      `Customer: ${customerName}\\n` +
      `Phone: ${customerPhone}\\n` +
      `Total: ₹${orderTotal}\\n\\n` +
      `*Items:*\\n${itemsList}\\n\\n` +
      `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

    console.log('Order Notification:', message);

    // Here you can integrate with SMS/WhatsApp services:
    // 1. Twilio: https://www.twilio.com/
    // 2. MSG91: https://msg91.com/
    // 3. Fast2SMS: https://www.fast2sms.com/
    // 4. Gupshup: https://www.gupshup.io/
    // 5. WATI: https://www.wati.io/
    
    // Example using MSG91 (uncomment and add API key when ready):
    /*
    const msg91ApiKey = Deno.env.get('MSG91_API_KEY');
    const msg91Response = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'authkey': msg91ApiKey || '',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        flow_id: 'YOUR_FLOW_ID',
        sender: 'STKCRF',
        mobiles: ADMIN_PHONE,
        message: message.replace(/\\n/g, ' ')
      })
    });
    */

    // Example using Fast2SMS (uncomment and add API key when ready):
    /*
    const fast2smsApiKey = Deno.env.get('FAST2SMS_API_KEY');
    const fast2smsResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': fast2smsApiKey || '',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        route: 'q',
        message: message.replace(/\\n/g, ' '),
        flash: 0,
        numbers: ADMIN_PHONE
      })
    });
    */

    // For now, log the notification (will be sent when you add SMS service API keys)
    console.log(`📱 SMS to ${ADMIN_PHONE}:`, message);

    // Also send via WhatsApp API if available
    // You can use WATI.io or Gupshup for WhatsApp Business API

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order notification logged',
        phone: ADMIN_PHONE,
        orderId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Order Notification Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
