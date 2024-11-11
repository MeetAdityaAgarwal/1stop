import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { NextPageWithLayout } from "./_app";
import React from 'react'

// external imports
import DefaultLayout from "@/src/components/layouts/DefaultLayout";

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/app");
  }, [router]);

  return (
    <>
      <Head>
        <title>Siddharth-Electricals</title>
        <meta name="description" content="a complete nutriton store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-7 px-4">
        <div className="flex flex-col w-full items-center justify-center gap-5 md:gap-5">
          <Link href={"/app"}>
            <Image
              src={"/logo/png/logo-no-background.png"}
              alt="amzn logo"
              width={80}
              height={35}
              className="h-auto min-w-[155px] rounded-sm ring-white  transition hover:ring-1"
              priority
            />
          </Link>
        </div>

        <h1 className="text-center text-xs font-light md:text-3xl">
          Redirecting to the app page
        </h1>
        <Link
          aria-label="navigate to app page"
          href="/app"
          className="bg-primary px-4 py-1.5 text-center text-xs font-semibold text-white transition-opacity hover:bg-opacity-80 active:bg-opacity-90 sm:text-sm"
        >
          Go to app
        </Link>
      </main>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
