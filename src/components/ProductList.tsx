import { useCartStore } from "@/src/stores/cart";
import { formatCurrency, truncateText } from "@/src/utils/format";
import { renderStars } from "@/src/utils/render";
import type { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { toast } from "react-hot-toast";


// external imports
import Button from "./ui/Button";

const ProductList = ({ products }: { products: Product[] }) => {
  return (
    <section
      aria-label="product list"
      className="mx-auto w-full max-w-screen-2xl px-4 sm:w-[95vw]"
    >
      <h2 className="sr-only">Product list</h2>
      <div className="grid grid-flow-row-dense gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <SlicedProducts products={products} range={{ from: 0, to: 4 }} />
        <Image
          src={`/img/advertisement-one.webp`}
          alt="advertisement one"
          width={1500}
          height={300}
          className="col-span-full"
          loading="lazy"
        />
        <div className="md:col-span-2">
          <SlicedProducts products={products} range={{ from: 4, to: 5 }} />
        </div>
        <SlicedProducts
          products={products}
          range={{ from: 5, to: products.length }}
        />
      </div>
    </section>
  );
};

export default ProductList;

// SlicedProducts.tsx
type SlicedProductsProps = {
  products: Product[];
  range: {
    from: number;
    to: number;
  };
};

const SlicedProducts = ({ products, range }: SlicedProductsProps) => {
  // zustand
  const cartStore = useCartStore((state) => ({
    products: state.products,
    addProduct: state.addProduct,
  }));

  return (
    <Fragment>
      {products.slice(range.from, range.to).map((product) => {
        const wholesalePrice = product.price * 0.5;
        return (
          <div
            key={product.id}
            className="flex flex-col gap-3 rounded-lg bg-white p-5 shadow transition-opacity hover:bg-opacity-80 active:bg-opacity-100"
          >
            <Link
              href={`/app/products/${product.id}`}
              className="relative mx-auto h-48 w-48"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={192}
                height={192}
                className="absolute h-full w-full object-contain"
                loading="lazy"
              />
            </Link>
            <div className="flex items-center gap-1">
              {product.rating ? renderStars(product.rating) : "-"}
            </div>
            <Link href={`/app/products/${product.id}`}>
              <h2 className="text-sm font-medium text-title transition-colors line-clamp-1 hover:text-primary md:text-base">
                {product.name ?? "-"}
              </h2>
            </Link>
            <p className="text-xs font-medium text-text line-clamp-2 md:text-sm">
              {product.description ?? "-"}
            </p>
            <div className="flex justify-between items-center gap-2">
              {/* Show original price with strike-through */}
              {product.price ? (
                <p className="text-sm font-medium text-gray-400 line-through md:text-base">
                  {formatCurrency(product.price, "USD")}
                </p>
              ) : null}

              {/* Show wholesale price */}
              {wholesalePrice ? (
                <p className="text-sm font-medium text-title md:text-base">
                  {formatCurrency(wholesalePrice, "USD") + "   (wholesale)"}
                </p>
              ) : null}
            </div>
            <Button
              aria-label="add product to cart"
              className="w-full bg-orange-300 text-gray-200 transition-colors hover:bg-primary active:bg-orange-300"
              onClick={() => {
                cartStore.addProduct(product);
                toast.success(`${truncateText(product.name, 16)} added to cart`);
              }}
            >
              Add to Cart
            </Button>
          </div>
        )
      })}
    </Fragment>
  );
};
