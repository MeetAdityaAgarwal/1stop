import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/src/stores/cart";
import { trpc } from "@/src/utils/trpc";
import type { Product } from "@prisma/client";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { toast } from "react-hot-toast";
import type { NextPageWithLayout } from "../../_app";
import React from 'react';

// external imports
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import LoadingScreen from "@/src/components/screens/LoadingScreen";

const ShowProduct: NextPageWithLayout = () => {
  const productId = Router.query.productId as string;

  // get product query
  const productQuery = trpc.products.getOne.useQuery(productId);

  // cart store
  const cartStore = useCartStore((state) => ({
    addProduct: state.addProduct,
  }));

  if (productQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (productQuery.isError) {
    return <ErrorScreen error={productQuery.error} />;
  }

  const product = productQuery.data;

  return (
    <>
      <Head>
        <title>{product?.name ?? "Product"} | 1Stop4It</title>
      </Head>
      <main className="min-h-screen pb-14">
        <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image Section */}
            <div className="grid gap-4">
              <Image
                src={product?.image || "/placeholder.svg"}
                alt={product?.name || "Product Image"}
                width={800}
                height={800}
                className="w-full rounded-lg object-cover aspect-square"
              />
              <div className="grid grid-cols-4 gap-4">
                {Array(4)
                  .fill(null)
                  .map((_, i) => (
                    <button key={i} className="border rounded-lg overflow-hidden transition-colors hover:border-primary">
                      <Image
                        src={product?.image || "/placeholder.svg"}
                        alt="Product Thumbnail"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                        style={{ aspectRatio: "100/100", objectFit: "cover" }}
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="grid gap-4">
              <div>
                <h1 className="text-3xl font-bold">{product?.name}</h1>
                <p className="text-muted-foreground">{product?.description}</p>
              </div>

              <div className="grid gap-2">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <StarIcon key={index} className={`w-5 h-5 ${index < Math.round(product?.rating ?? 0) ? "fill-orange-300" : "fill-muted stroke-muted-foreground"}`} />
                  ))}
                  <span className="text-muted-foreground text-sm">({product?.rating ?? 0})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">${product?.price}</span>
                  {product?.price && (
                    <span className="text-muted-foreground text-sm line-through">${product?.price}</span>
                  )}
                </div>

                {/* Size Selection */}
                <div>
                  <Label htmlFor="size" className="text-base">Size</Label>
                  <RadioGroup id="size" defaultValue="m" className="flex items-center gap-2">
                    {["s", "m", "l", "xl"].map((size) => (
                      <Label
                        key={size}
                        htmlFor={`size-${size}`}
                        className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                      >
                        <RadioGroupItem id={`size-${size}`} value={size} />
                        {size.toUpperCase()}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>

                {/* Quantity Selection */}
                <div>
                  <Label htmlFor="quantity" className="text-base">Quantity</Label>
                  <Select defaultValue="1">
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((quantity) => (
                        <SelectItem key={quantity} value={`${quantity}`}>
                          {quantity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Add to Cart Button */}
                <Button
                  size="lg"
                  onClick={() => {
                    cartStore.addProduct(product as Product);
                    toast.success(`${product?.name} added to cart`);
                  }}
                  className="text-white"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ShowProduct;

ShowProduct.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}


