import { trpc } from "@/src/utils/trpc";
import type { PRODUCT_CATEGORY } from "@prisma/client";
import Head from "next/head";
import Router from "next/router";
import type { NextPageWithLayout } from "../../_app";

// external imports
import ProductList from "@/src/components/ProductList";
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import LoadingScreen from "@/src/components/screens/LoadingScreen";

const ShowCategory: NextPageWithLayout = () => {
  const category = Router.query.category as PRODUCT_CATEGORY;

  // get products by category query
  const productsQuery = trpc.products.getByCategory.useQuery(category, {
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
        <title>Products | 1Stop4It</title>
      </Head>
      <main className="min-h-screen bg-bg-gray ">
        <ProductList products={productsQuery.data} />
      </main>
    </>
  );
};

export default ShowCategory;

ShowCategory.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
