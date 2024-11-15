import type { NextPageWithLayout } from "@/src/pages/_app";
import { formatCurrency, formatEnum } from "@/src/utils/format";
import { trpc } from "@/src/utils/trpc";
import type { Product, PRODUCT_CATEGORY } from "@prisma/client";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useMemo, useState } from "react";
import React from 'react'

// external imports
import Button from "@/src/components/ui/Button";
import CustomTable from "@/src/components/ui/Table";
import DefaultLayout from "@/src/components/layouts/DefaultLayout";

type TextField = string | undefined;
type NumberField = number | undefined;
type CategoryField = PRODUCT_CATEGORY | undefined;

const Products: NextPageWithLayout = () => {
  // tanstack/react-table
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const columns = useMemo<ColumnDef<Product, any>[]>(
    () => [
      {
        accessorKey: "id",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ cell }) =>
          cell.getValue() ? formatCurrency(cell.getValue(), "USD") : "-",
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ cell }) =>
          cell.getValue() ? formatEnum(cell.getValue()) : "-",
      },
      {
        accessorKey: "rating",
        header: "Rating",
      },
      {
        accessorKey: "createdAt",
        header: "Created at",
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell: ({ cell }) =>
          cell.getValue()
            ? dayjs(cell.getValue()).format("DD/MM/YYYY, hh:mm a")
            : "-",
      },
    ],
    []
  );

  // get products query
  const { data, isLoading, isError, isRefetching } =
    trpc.admin.products.get.useQuery(
      {
        page: pagination.pageIndex,
        perPage: pagination.pageSize,
        name: columnFilters.find((f) => f.id === "name")?.value as TextField,
        price: columnFilters.find((f) => f.id === "price")
          ?.value as NumberField,
        category: columnFilters.find((f) => f.id === "category")
          ?.value as CategoryField,
        rating: columnFilters.find((f) => f.id === "rating")
          ?.value as NumberField,
        sortBy: sorting[0]?.id as
          | "name"
          | "category"
          | "quantity"
          | "price"
          | "rating"
          | "createdAt"
          | undefined,
        sortDesc: sorting[0]?.desc,
      },
      { refetchOnWindowFocus: false }
    );

  return (
    <>
      <Head>
        <title>Products | 1Stop4It</title>
      </Head>
      <main className="min-h-screen bg-bg-gray ">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:w-[95vw]">
          <CustomTable<Product>
            tableTitle={
              <>
                {`Products (${data?.count ?? 0} entries)`}
                <Link href={"/dashboard/products/add"} className="ml-4">
                  <Button className="bg-primary-700">Add product</Button>
                </Link>
              </>
            }
            columns={columns}
            data={data?.products ?? []}
            state={{
              sorting,
              pagination,
              columnVisibility,
              columnFilters,
            }}
            setSorting={setSorting}
            setColumnFilters={setColumnFilters}
            setColumnVisibility={setColumnVisibility}
            setPagination={setPagination}
            itemsCount={data?.count}
            isLoading={isLoading}
            isRefetching={isRefetching}
            isError={isError}
            manualFiltering
            manualPagination
            manualSorting
            rowHoverEffect
            disableGlobalFilter
            bodyRowProps={(row) => ({
              onClick: () => {
                const productId = row.getValue("id") as string;
                Router.push(`/dashboard/products/${productId}`);
              },
            })}
          />
        </div>
      </main>
    </>
  );
};

export default Products;

Products.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
