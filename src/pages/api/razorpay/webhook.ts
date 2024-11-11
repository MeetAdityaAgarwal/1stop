
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/server/db/client';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    try {
      const secret = process.env.RAZORPAY_KEY_SECRET
      if (!secret) throw new Error('RAZORPAY_KEY_SECRET is not defined');
      // Verify the payment signature
      const generatedSignature = crypto.createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid signature' });
      }

      // Upsert RazorpayPayment record
      await prisma.razorpayPayment.upsert({
        where: { razorpayId: razorpay_payment_id },
        update: {
          status: 'SUCCESS',
          // Other fields as needed
        },
        create: {
          razorpayId: razorpay_payment_id,
          amount: 0, // Set actual amount
          currency: 'INR', // Set actual currency
          status: 'SUCCESS',
          orderId: razorpay_order_id,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Payment handling error:', error);
      res.status(500).json({ success: false, message: 'Payment handling failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
