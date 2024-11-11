import { formatEnum } from "@/src/utils/format";
import type { PRODUCT_CATEGORY } from "@prisma/client";
import Link from "next/link";

const CategoryList = ({ categories }: { categories: PRODUCT_CATEGORY[] }) => {
  return (
    <section
      aria-label="category list"
      className="mx-auto max-w-screen-2xl px-4 sm:w-[95vw]"
    >
      <h2 className="sr-only">Category list</h2>
      <div className="flex flex-wrap gap-4 justify-start">
        {categories.map((category) => (
          <Link key={category} href={`/app/categories/${category}`}>
            <div className="flex items-center justify-center w-24 h-10 bg-red text-sm font-sans text-center text-title shadow rounded-full transition-opacity hover:bg-opacity-60 active:bg-opacity-90">
              {formatEnum(category)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;


