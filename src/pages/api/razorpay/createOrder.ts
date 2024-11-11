
// pages/api/razorpay/createOrder.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import { z } from 'zod';

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: "rzp_test_GcZZFDPPOjHtC4",
  key_secret: "6JdtQv2u7oUw7EWziYeyoewJ"
  //key_id: process.env.RAZORPAY_KEY_ID!,
  //key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const CreateOrderSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  userId: z.string(),
  orderId: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const parsedBody = CreateOrderSchema.parse(req.body);

      const razorpayOrder = await razorpay.orders.create({
        amount: parsedBody.amount * 100, // amount in paise
        currency: parsedBody.currency,
        receipt: parsedBody.orderId || undefined,
      });

      await prisma.razorpayOrder.create({
        data: {
          razorpayId: razorpayOrder.id,
          amount: parsedBody.amount,
          currency: parsedBody.currency,
          status: 'CREATED',
          userId: parsedBody.userId,
          orderId: parsedBody.orderId,
        },
      });

      res.status(200).json({ orderId: razorpayOrder.id });
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
