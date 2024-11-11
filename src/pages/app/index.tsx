// import { trpc } from "@/src/utils/trpc";
// import type { NextPageWithLayout } from "../_app";
//
// // external imports
// import CategoryList from "@/src/components/CategoryList";
// import Hero from "@/src/components/Hero";
// import ProductList from "@/src/components/ProductList";
// import DefaultLayout from "@/src/components/layouts/DefaultLayout";
// import ErrorScreen from "@/src/components/screens/ErrorScreen";
// import LoadingScreen from "@/src/components/screens/LoadingScreen";
// import React from 'react'
//
// const App: NextPageWithLayout = () => {
//   // get queries
//   const categoriesQuery = trpc.products.getCategories.useQuery(undefined, {
//     staleTime: 1000 * 60 * 60 * 24,
//   });
//   const productsQuery = trpc.products.get.useQuery(undefined, {
//     staleTime: 1000 * 60 * 60 * 24,
//   });
//
//   if (categoriesQuery.isLoading || productsQuery.isLoading) {
//     return <LoadingScreen />;
//   }
//
//   if (categoriesQuery.isError) {
//     return <ErrorScreen error={categoriesQuery.error} />;
//   }
//
//   if (productsQuery.isError) {
//     return <ErrorScreen error={productsQuery.error} />;
//   }
//
//   return (
//     <>
//       <main className="min-h-screen bg-gradient-blue pt-52 md:pt-40">
//         <Hero />
//         <div className="flex flex-col gap-5 mt-8 pb-14">
//           <CategoryList categories={categoriesQuery.data} />
//           <ProductList products={productsQuery.data} />
//         </div>
//       </main>
//     </>
//   );
// };
//
// export default App;
//
// App.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

// pages/index.tsx

import type { NextPageWithLayout } from "../_app";
import type { PRODUCT_CATEGORY } from "@prisma/client";

// external imports
import { appRouter } from "@/src/server/trpc/router/_app";
import { createContext } from "@/src/server/trpc/context";
import CategoryList from "@/src/components/CategoryList";
import Hero from "@/src/components/Hero";
import ProductList from "@/src/components/ProductList";
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import LoadingScreen from "@/src/components/screens/LoadingScreen";
import React from 'react';

// Define the type for product and category
type PRODUCT = {
  id: string;
  name: string;
  price: number;
  category: PRODUCT_CATEGORY;
  description: string;
  image: string;
  rating: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
// Define the props for the component
interface AppProps {
  categories: PRODUCT_CATEGORY[] | undefined;
  products: PRODUCT[] | undefined;
  error?: string;
}

const App: NextPageWithLayout<AppProps> = ({ categories, products }) => {
  if (!categories || !products) {
    return <LoadingScreen />;
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-blue pt-52 md:pt-40">
        <Hero />
        <div className="flex flex-col gap-5 mt-8 pb-14">
          <CategoryList categories={categories} />
          <ProductList products={products} />
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async () => {
  const ctx = await createContext(); // Create context for tRPC server-side
  const caller = appRouter.createCaller(ctx); // Create a caller to access procedures

  try {

    const categories = await caller.products.getCategories(); // Adjust method name
    const products = await caller.products.get(); // Adjust method name

    const serializedProducts = products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(), // Convert to string
      updatedAt: product.updatedAt.toISOString(), // Convert to string
    }));

    return {
      props: {
        categories,
        products: serializedProducts,
      },
      revalidate: 60 * 60 * 24, // Revalidate every 24 hours
    };
  } catch (error) {
    return {
      props: {
        categories: [],
        products: [],
        error: (error as Error).message,
      },
      revalidate: 60, // Revalidate after 1 minute if there's an error
    };
  }
};

export default App;

App.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

