
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const razorpayRouter = router({
  // Create a new Razorpay order
  createOrder: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        currency: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { amount, currency, userId } = input;

      // Create a Razorpay order in the database
      const razorpayOrder = await ctx.prisma.razorpayOrder.create({
        data: {
          razorpayId: "", // This should be set after creating the order on Razorpay
          amount,
          currency,
          status: "CREATED",
          userId,
        },
      });

      return razorpayOrder;
    }),

  // Update the status of a Razorpay order
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        razorpayId: z.string(),
        status: z.enum(["CREATED", "PAID", "FAILED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { razorpayId, status } = input;

      // Update the Razorpay order status in the database
      const razorpayOrder = await ctx.prisma.razorpayOrder.update({
        where: { razorpayId },
        data: { status },
      });

      return razorpayOrder;
    }),

  // Get a Razorpay order by its ID
  getOrderById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const razorpayOrder = await ctx.prisma.razorpayOrder.findUnique({
        where: { id: input },
      });

      if (!razorpayOrder) {
        throw new Error("Razorpay order not found!");
      }

      return razorpayOrder;
    }),

  // Get all Razorpay orders for a user
  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    const razorpayOrders = await ctx.prisma.razorpayOrder.findMany({
      where: { userId: ctx.session.user.id },
    });

    return razorpayOrders;
  }),

  // Get all payments associated with a Razorpay order
  getPaymentsForOrder: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const razorpayPayments = await ctx.prisma.razorpayPayment.findMany({
        where: { orderId: input },
      });

      return razorpayPayments;
    }),
  updatePaymentStatus: protectedProcedure
    .input(
      z.object({
        razorpayId: z.string(),
        status: z.enum(['SUCCESS', 'PENDING', 'FAILED']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { razorpayId, status } = input;

      // Update the RazorpayPayment record
      const razorpayPayment = await ctx.prisma.razorpayPayment.upsert({
        where: { razorpayId },
        update: { status },
        create: {
          razorpayId,
          amount: 0, // Set actual amount
          currency: 'INR', // Set actual currency
          status,
          orderId: '', // Link with actual order ID if applicable
        },
      });

      return razorpayPayment;
    }),
});
