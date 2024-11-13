
// components/RazorpayCheckout.tsx

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from "@/src/stores/cart";
import { trpc } from "@/src/utils/trpc";



interface RazorpayCheckoutProps {
  currency: string;
  orderId: string;
  userId: string
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({ currency, userId, orderId }) => {
  const sessionQuery = trpc.users.getSession.useQuery();
  const name = sessionQuery.data?.user?.name
  const email = sessionQuery.data?.user?.email
  const phone = sessionQuery.data?.user?.phone

  const cartStore = useCartStore((state) => ({
    products: state.products,
  }));
  const amount = cartStore.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(script);

    // Cleanup script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Razorpay script is not loaded yet.');
      return;
    }
    const res = await fetch('/api/razorpay/createOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, userId, orderId }),
    });
    const data = await res.json();

    const options = {
      //key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key: 'rzp_test_Ld8VJIKgd9spxQ',
      amount: amount * 100, // amount in paise
      currency,
      name: '1Stop4It',
      description: 'Order Description',
      order_id: data.orderId,
      handler: async function(response: any) {
        const verificationRes = await fetch('/api/razorpay/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayOrderId: response.order_id,
            razorpayPaymentId: response.payment_id,
            razorpaySignature: response.signature,
          }),
        });
        const verificationData = await verificationRes.json();

        if (verificationData.success) {
          alert('Payment successful');
        } else {
          alert('Payment verification failed');
        }
      },
      prefill: {
        name,
        email,
        contact: phone,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return <Button className="m-4 bg-gray-400" disabled={true} onClick={handlePayment}>Pay {amount} Rs</Button>;
};

export default RazorpayCheckout;
