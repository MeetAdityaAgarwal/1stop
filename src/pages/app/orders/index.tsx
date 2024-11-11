// pages/orders.tsx
import type { NextPageWithLayout } from "@/src/pages/_app";
import type { OrderWithDetails } from "@/src/types/globals";
import { formatCurrency } from "@/src/utils/format";
import { trpc } from "@/src/utils/trpc";
import { Tab } from "@headlessui/react";
import { useIsMutating } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import React from 'react'

// UI Components from shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Layout and other components
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import LoadingScreen from "@/src/components/screens/LoadingScreen";

const Orders: NextPageWithLayout = () => {
  // Redirect to signin page if unauthenticated
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      Router.push("/api/auth/signin");
    }
  }, [status]);

  // Get queries
  const utils = trpc.useContext();
  const ordersQuery = trpc.orders.get.useQuery();
  const archivedOrdersQuery = trpc.orders.getArchived.useQuery();

  // Refetch queries
  const number = useIsMutating();
  useEffect(() => {
    if (number === 0) {
      utils.orders.get.invalidate();
      utils.orders.getArchived.invalidate();
    }
  }, [number, utils]);

  // HeadlessUI Tab
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = [{ name: "Orders" }, { name: "Archived Orders" }];

  // Set tab index based on query
  useEffect(() => {
    if (Router.query.tab === "archived") {
      setSelectedIndex(1);
    }
  }, []);

  if (ordersQuery.isLoading || archivedOrdersQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (ordersQuery.isError) {
    return <ErrorScreen error={ordersQuery.error} />;
  }

  if (archivedOrdersQuery.isError) {
    return <ErrorScreen error={archivedOrdersQuery.error} />;
  }

  if (
    ordersQuery.data?.length === 0 &&
    archivedOrdersQuery.data?.length === 0
  ) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-xl font-semibold text-title md:text-3xl">
          You have no orders
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Orders | Mind &amp; Body</title>
      </Head>
      <main className="min-h-screen ">
        <div className="mx-auto w-full max-w-screen-lg px-4 sm:w-[95vw]">
          <h1 className="text-xl font-semibold text-title md:text-2xl">
            Your Orders
          </h1>
          <div className="mt-5">
            <Tab.Group
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            >
              <Tab.List className="flex gap-5">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className="text-sm font-medium text-link ring-2 ring-white hover:text-opacity-80 focus:outline-none ui-selected:border-b-2 ui-selected:border-primary ui-selected:font-bold ui-selected:text-title md:text-base"
                  >
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel>
                  {ordersQuery.data?.every(
                    (order) => order.items.length === 0
                  ) ? (
                    <div className="mt-40 grid place-items-center">
                      <div className="text-xl font-semibold text-title md:text-3xl">
                        You have no unarchived orders
                      </div>
                    </div>
                  ) : (
                    <GroupedOrders data={ordersQuery.data} />
                  )}
                </Tab.Panel>
                <Tab.Panel>
                  {archivedOrdersQuery.data?.every(
                    (order) => order.items.length === 0
                  ) ? (
                    <div className="mt-40 grid place-items-center">
                      <div className="text-xl font-semibold text-title md:text-3xl">
                        You have no archived orders
                      </div>
                    </div>
                  ) : (
                    <GroupedOrders data={archivedOrdersQuery.data} />
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </main>
    </>
  );
};

export default Orders;

Orders.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

// GroupedOrders Component
const GroupedOrders = ({ data }: { data: OrderWithDetails[] }) => {
  return (
    <div className="mt-5 grid gap-8">
      {data
        .filter((order) => order.items.length > 0)
        .map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
    </div>
  );
};

// OrderCard Component using the new template
const OrderCard = ({ order }: { order: OrderWithDetails }) => {
  const totalPrice = order.items.reduce(
    (acc, product) => acc + product.product.price * product.quantity,
    0
  );

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="font-medium">Order #{order.id}</p>
          <p className="text-muted-foreground text-sm">
            Placed on {dayjs(order.createdAt).format("MMMM D, YYYY")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-medium">{formatCurrency(totalPrice, "INR")}</p>
          <Badge variant={order.status === "DELIVERED" ? "secondary" : "outline"}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium mb-2">Order Details</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <span className="font-medium">Items:</span>
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      <span className="font-medium">Item:</span> {item.product.name}
                      <span className="font-medium"> x </span>
                      <span>{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <span className="font-medium">Total:</span> {formatCurrency(totalPrice, "INR")}
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Shipping Information</p>
            <address className="text-muted-foreground not-italic">
              <p>{order.shippingAddress?.receiverName}</p>
              <p>{order.shippingAddress?.addressNickname}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.zipCode}
              </p>
            </address>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-2">
        <Link href={`/app/orders/${order.id}`}>
          <Button variant="outline" size="sm">
            View Order
          </Button>
        </Link>
        {/* Remove Return Items Button */}
        {/* <Button variant="outline" size="sm">
          Return Items
        </Button> */}
      </CardFooter>
    </Card>
  );
};



