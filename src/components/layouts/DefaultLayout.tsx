import DeactivatedScreen from "@/src/components/screens/DeactivatedScreen";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import { trpc } from "@/src/utils/trpc";
import { useSession } from "next-auth/react";
import { type ReactNode } from "react";
import React from 'react'

// external imports
import Footer from "./Footer";
import Navbar from "./Navbar";
import LoadingScreen from "../screens/LoadingScreen";
import Breadcrumb from '@/src/components/ui/breadcrumb'

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

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

  if (status === "authenticated" && !session?.user?.active) {
    return <DeactivatedScreen />;
  }

  return (
    <>
      <Navbar data={productsQuery.data} />
      <Breadcrumb />
      {children}
      <Footer />
    </>
  );
};

export default DefaultLayout;
