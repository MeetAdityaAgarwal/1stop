import { formatCurrency } from "@/src/utils/format";
import { trpc } from "@/src/utils/trpc";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";
import React from 'react'

// external imports
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import LoadingScreen from "@/src/components/screens/LoadingScreen";

const ShowOrder: NextPageWithLayout = () => {
  const orderId = Router.query.orderId as string;

  // get order query
  const orderQuery = trpc.orders.getOne.useQuery(orderId);

  if (orderQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (orderQuery.isError) {
    return <ErrorScreen error={orderQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Order | Siddharth-Electricals</title>
      </Head>
      <main className="min-h-screen ">
        <div className="mx-auto w-full max-w-screen-lg px-4 sm:w-[95vw]">
          {orderQuery.data.items.map((item) => (
            <div key={item.id}>
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain"
                  />
                  <div className="grid flex-1 gap-0.5">
                    <Link
                      aria-label={`go to ${item.product.name}`}
                      href={`/app/products/${item.product.id}`}
                    >
                      <div className="text-sm font-semibold text-title line-clamp-2 hover:text-primary md:text-base">
                        {item.product.name}
                      </div>
                    </Link>
                    <div className="text-sm text-gray-500 md:text-base">
                      {item.quantity} x{" "}
                      {formatCurrency(item.product.price, "USD")}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-title md:text-base">
                  ${item.product.price * item.quantity}
                </div>
              </div>
              <hr className="my-4" />
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default ShowOrder;

ShowOrder.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
