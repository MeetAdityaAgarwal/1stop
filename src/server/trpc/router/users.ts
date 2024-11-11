import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import * as bcrypt from "bcrypt";
import { env } from "../../../env/server.mjs"


export const usersRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    return users;
  }),

  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found!",
      });
    }
    return user;
  }),

  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user?.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not find user",
      });
    }
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    });
    if (!user) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not find user",
      });
    }
    return user.stripeSubscriptionStatus;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3).max(50),
        email: z.string().email(),
        phone: z.string().min(10).max(11),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
        },
      });
      return user;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.delete({
        where: {
          id: input,
        },
      });
      return user;
    }),
  verifyCredentials: publicProcedure
    .input(
      z.object({
        username: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.username,
        },
      });

      if (!user || !user.password) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      const isValidPassword = await bcrypt.compare(input.password, user.password);
      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      return user;
    }),
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Hash password before saving
      const { email, password } = input
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await ctx.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already in use',
        });
      }

      // Create user in the database
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
        },
      });
      return user;
    }),
  markPrimary: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        selectedAddressId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (prisma) => {
        await prisma.savedAddress.updateMany({
          where: {
            userId: input.userId,
            isPrimary: true,
          },
          data: {
            isPrimary: false,
          },
        });

        await prisma.savedAddress.updateMany({
          where: {
            userId: input.userId,
            id: input.selectedAddressId,
          },
          data: {
            isPrimary: true,
          },
        });
      });
    }),
  addAddress: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        receiverName: z.string().optional(),
        addressNickname: z.string(),
        receiverPhone: z.string(),
        zipCode: z.string().optional(),
        isPrimary: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sameNameAddress = await ctx.prisma.savedAddress.findFirst({
        where: {
          addressNickname: input.addressNickname,
        },
      });

      if (!!sameNameAddress) { throw new Error('Same Nick Name already exists') }

      const { latitude, longitude } = input;
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);
        const locationData = await response.json();
        console.log("locationDATA:", locationData)

        if (locationData.results.length > 0) {
          // Extract city, state, and country from the API response
          let city = '';
          let state = '';
          let country = '';

          const addressComponents = locationData.results[0].address_components;

          addressComponents.forEach((component: any) => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name;
            }
            if (component.types.includes('country')) {
              country = component.long_name;
            }
          });

          // Set default values in case city, state, or country are not found
          city = city || 'Unknown City';
          state = state || 'Unknown State';
          country = country || 'Unknown Country';
          if (input.isPrimary) {
            // Update existing primary address to set isPrimary to false
            await ctx.prisma.savedAddress.updateMany({
              where: {
                userId: input.userId,
                isPrimary: true,
              },
              data: {
                isPrimary: false,
              },
            });
          }
          const address = await ctx.prisma.savedAddress.create({
            data: {
              userId: input.userId,
              latitude,
              longitude,
              receiverName: input.receiverName,
              addressNickname: input.addressNickname,
              receiverPhone: input.receiverPhone,
              city,
              state,
              country,
              zipCode: input.zipCode,
              isPrimary: input.isPrimary,
            },
          });
          return address;
        } else {
          throw new Error('Unable to find location details from the given latitude and longitude.');
        }
      } catch (error) {
        console.error('Error during reverse geocoding:', error);
        throw new Error('Failed to retrieve location details.');
      }
    }),

  deleteAddress: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.prisma.savedAddress.delete({
        where: {
          id: input,
        },
      });
      return address;
    }),

  getAddresses: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const addresses = await ctx.prisma.savedAddress.findMany({
        where: {
          userId: input,
        },
      });
      return addresses;
    }),
});
