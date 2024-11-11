import type { NextPageWithLayout } from "@/src/pages/_app";
import { trpc } from "@/src/utils/trpc";
import Head from "next/head";

// external imports
import CategoryList from "@/src/components/CategoryList";
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import LoadingScreen from "@/src/components/screens/LoadingScreen";

const Categories: NextPageWithLayout = () => {
  // get categories query
  const categoriesQuery = trpc.products.getCategories.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (categoriesQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (categoriesQuery.isError) {
    return <ErrorScreen error={categoriesQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Categories | Siddharth-Electricals</title>
      </Head>
      <main className="min-h-screen bg-bg-gray pb-14 pt-6 md:pt-4">
        <CategoryList categories={categoriesQuery.data} />
      </main>
    </>
  );
};

export default Categories;

Categories.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
