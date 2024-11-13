import { formatEnum } from "@/src/utils/format";
import type { PRODUCT_CATEGORY } from "@prisma/client";
import Link from "next/link";

const categoryImages: Record<PRODUCT_CATEGORY, string> = {
  ACCESSORIES: "/img/categories/download.png",
  PIPES: "/img/categories/download (2).png",
  SWITCHES: "/img/categories/download (3).png",
  WIRES: "/img/categories/download (4).png",
  LIGHTING: "/img/categories/download (5).png"

  // Add more categories and corresponding images
};


const CategoryList = ({ categories }: { categories: PRODUCT_CATEGORY[] }) => {
  return (
    <section
      aria-label="category list"
      className="mx-auto max-w-screen-2xl px-4 sm:w-[95vw]"
    >
      <h2 className="sr-only">Category list</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <Link key={category} href={`/app/categories/${category}`} passHref>
            <div className="flex  bg-white border rounded-full flex-col items-center gap-2 w-auto cursor-pointer transition-opacity hover:bg-opacity-60 active:bg-opacity-90">
              {/* Rounded image based on category */}
              <img
                src={categoryImages[category] || "/images/default.jpg"} // Default fallback image
                alt={category}
                width={150}
                height={150}
                className="w-[30vw] h-[30vw] sm:w-[25vw] sm:h-[25vw] md:w-[20vw] md:h-[20vw] lg:w-[15vw] lg:h-[15vw] rounded-full object-cover"
              />
              {/* Category text */}
              <span className="text-sm font-sans text-center text-title">
                {formatEnum(category)}
              </span>
            </div>          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;


