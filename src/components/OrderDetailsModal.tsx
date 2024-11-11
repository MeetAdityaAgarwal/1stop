
import { useState } from "react";
import { Button } from "@/components/ui";
import type { OrderWithDetails } from "../types/globals";
import { Separator } from "@/components/ui/separator";
import React from 'react';

interface OrderDetailsModalProps {
  order: OrderWithDetails;
  _onClose: () => void;
}

export default function OrderDetailModal({ order, _onClose }: OrderDetailsModalProps) {
  const [isOrderItemsOpen, setIsOrderItemsOpen] = useState(false);

  // Calculate total price
  const totalPrice = order?.items?.reduce(
    (acc, item) => acc + (item.product?.price * item.quantity),
    0
  );

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 md:px-6">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="sm:max-w-[800px] p-6 bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="order-2 md:order-1">
            <div>
              <div>Order #{order.id}</div>
              <div>Placed on {order.createdAt.toDateString()}</div>
            </div>
            <div className="grid gap-6 py-6">
              <div className="grid gap-4">
                <div className="font-medium">Shipping Address</div>
                {order.shippingAddress ? (
                  <address className="not-italic text-muted-foreground">
                    <div>{order.shippingAddress.receiverName ?? "N/A"}</div>
                    <div>{order.shippingAddress.addressNickname ?? "123 Main St."}</div>
                    <div>
                      {order.shippingAddress.city ?? "N/A"}, {order.shippingAddress.state ?? "N/A"}{" "}
                      {order.shippingAddress.zipCode ?? "N/A"}
                    </div>
                  </address>
                ) : (
                  <div>No shipping address provided</div>
                )}
              </div>
              <div className="grid gap-4">
                <div className="font-medium">Payment Information</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-4 w-4" />
                    Visa
                  </div>
                  <div>**** **** **** 4532</div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="grid gap-6 py-6">
              <div className="grid gap-4">
                <div className="font-medium">Order Summary</div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Subtotal</div>
                    <div>{totalPrice} Rs.</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Shipping</div>
                    <div>0.00 Rs.</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Tax</div>
                    <div>0.00 Rs.</div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between font-medium">
                    <div>Total</div>
                    <div>{totalPrice} Rs.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex justify-between gap-4">
            <Button variant="outline" onClick={() => { _onClose() }}>
              {"X"}
            </Button>

            <Button variant="outline" onClick={() => setIsOrderItemsOpen(true)}>
              View Products
            </Button>
          </div>
        </div>
      </div>

      {isOrderItemsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="sm:max-w-[800px] p-6 bg-white rounded-lg shadow-lg grid grid-cols-1 gap-6 relative">
            <div className="font-medium">Products Ordered</div>
            <div className="grid gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div>{item.product.name}</div>
                    <div className="text-muted-foreground">Qty: {item.quantity}</div>
                  </div>
                  <div>{item.product.price * item.quantity} Rs.</div>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <div>Total Price</div>
                <div>{totalPrice} Rs.</div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsOrderItemsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

