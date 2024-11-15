import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const ordersRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({
      where: {
        userId: ctx.session.user.id,
        archived: false,
      },
      include: {
        items: {
          include: {
            product: true,
          },
          where: {
            archived: false,
          },
        },
        shippingAddress: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return orders;
  }),

  getArchived: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.prisma.order.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
          where: {
            archived: true,
          },
        },
        shippingAddress: true
      },
    });
    return orders;
  }),

  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const order = await ctx.prisma.order.findUnique({
      where: {
        id: input,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      throw new Error("Order not found!");
    }
    return order;
  }),

  getItems: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const orderItems = await ctx.prisma.orderItem.findMany({
        where: {
          orderId: input,
        },
        include: {
          product: true,
        },
      });
      if (!orderItems) {
        throw new Error("Order not found!");
      }
      return orderItems;
    }),

  getUserItems: protectedProcedure.query(async ({ ctx }) => {
    const orderItems = await ctx.prisma.orderItem.findMany({
      where: {
        order: {
          userId: ctx.session.user.id,
        },
      },
      include: {
        product: true,
      },
    });
    if (!orderItems) {
      throw new Error("Order not found!");
    }
    return orderItems;
  }),

  updateItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        archived: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const orderItem = await ctx.prisma.orderItem.update({
        where: {
          id: input.id,
        },
        data: {
          archived: !input.archived,
        },
      });
      if (!orderItem) {
        throw new Error("Order item not found!");
      }
      const orderItems = await ctx.prisma.orderItem.findMany({
        where: {
          orderId: orderItem.orderId,
        },
      });
      const orderItemsArchived = orderItems.every((item) => item.archived);
      const order = await ctx.prisma.order.update({
        where: {
          id: orderItem.orderId,
        },
        data: {
          archived: orderItemsArchived,
        },
      });
      if (!order) {
        throw new Error("Order not found!");
      }
      return orderItem;
    }),

  create: protectedProcedure
    .input(
      z.object({
        products: z.array(
          z.object({
            productId: z.string(),
            productQuantity: z.number(),
          }),
        ),
        shippingAddressId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const shippingAddress = await ctx.prisma.savedAddress.findUnique({
        where: { id: input.shippingAddressId },
      });

      if (!shippingAddress) {
        throw new Error("Shipping address not found!");
      }
      const order = await ctx.prisma.order.create({
        data: {
          userId: ctx.session.user.id,
          shippingAddressId: shippingAddress.id
        },
      });
      if (!order) {
        throw new Error("Order not found!");
      }
      const orderItems = await Promise.all(
        input.products.map(async ({ productId, productQuantity }) => {
          const product = await ctx.prisma.product.findUnique({
            where: {
              id: productId,
            },
          });
          if (!product) {
            throw new Error("Product not found!");
          }
          const orderItem = await ctx.prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: product.id,
              quantity: productQuantity,
            },
          });
          return orderItem;
        })
      );
      return orderItems;
    }),
});
