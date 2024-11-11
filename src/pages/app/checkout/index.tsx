import type { NextPageWithLayout } from "@/src/pages/_app";
import { useCartStore } from "@/src/stores/cart";
import Head from "next/head";
import React from 'react'

// external imports
import Cart from "@/src/components/Cart";
import DefaultLayout from "@/src/components/layouts/DefaultLayout";

const Checkout: NextPageWithLayout = () => {
  //  cart store
  const cartStore = useCartStore((state) => ({
    products: state.products,
  }));

  return (
    <>
      <Head>
        <title>Checkout | Siddharth-Electricals</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pb-14 ">
        <Cart products={cartStore.products} />
      </main>
    </>
  );
};

export default Checkout;

Checkout.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
