import type { NextPageWithLayout } from "@/src/pages/_app";
import { trpc } from "@/src/utils/trpc";
import Head from "next/head";

// external components
import ProductList from "@/src/components/ProductList";
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import LoadingScreen from "@/src/components/screens/LoadingScreen";
import React from 'react'

const Products: NextPageWithLayout = () => {
  // get products query
  const productsQuery = trpc.products.get.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (productsQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (productsQuery.isError) {
    return <ErrorScreen error={productsQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Products | Siddharth-Electricals</title>
      </Head>
      <main className="min-h-screen bg-bg-gray ">
        <ProductList products={productsQuery.data} />
      </main>
    </>
  );
};

export default Products;

Products.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
