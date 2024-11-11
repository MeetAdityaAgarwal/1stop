import type { Order, OrderItem, Product } from "@prisma/client";

export type OrderItemWithProduct = OrderItem & { product: Product };

export type OrderWithItems = Order & { items: OrderItemWithProduct[] };


export type OrderWithDetails = Order & {
  items: OrderItemWithProduct[];
  shippingAddress: {
    id: string;
    userId: string;
    latitude?: number | null;  // Making latitude optional
    longitude?: number | null; // Making longitude optional
    receiverName?: string | null; // Making receiverName optional
    addressNickname?: string | null; // Making addressNickname optional
    receiverPhone: string;
    city?: string | null; // Making city optional
    state?: string | null; // Making state optional
    country?: string | null; // Making country optional
    zipCode?: string | null; // Making zipCode optional
    isPrimary: boolean;
  } | null;
};

