import { PRODUCT_CATEGORY } from "@prisma/client";
//import { z } from "zod";
import { prisma } from "./client";

//external imports
import { faker } from "@faker-js/faker"

/* const schema = z.object({
  name: z.string().min(3),
  price: z.number().min(0),
  category: z.nativeEnum(PRODUCT_CATEGORY),
  description: z.string().min(3),
  cloudinary_url: z.string(),
  rating: z.number().min(0).max(5),
  quantity: z.number().optional()
});
type Inputs = z.infer<typeof schema>;

*/

const NUM_PRODUCTS_PER_CATEGORY = 10;

// Function to generate random product data
const generateRandomProductData = (category: PRODUCT_CATEGORY) => {
  const imageUrls = {
    [PRODUCT_CATEGORY.ACCESSORIES]: "https://res.cloudinary.com/dgmz3svbn/image/upload/v1724528177/accessories_trimmer_qc8kmb.jpg",
    [PRODUCT_CATEGORY.PIPES]: "https://res.cloudinary.com/dgmz3svbn/image/upload/v1724528176/pipes_conduict_rvsqau.webp",
    [PRODUCT_CATEGORY.SWITCHES]: "https://res.cloudinary.com/dgmz3svbn/image/upload/v1724528177/switch_hie0lo.jpg",
    [PRODUCT_CATEGORY.WIRES]: "https://res.cloudinary.com/dgmz3svbn/image/upload/v1724150165/wire_yxl7iv.webp",
    [PRODUCT_CATEGORY.LIGHTING]: "https://res.cloudinary.com/dgmz3svbn/image/upload/v1724528177/bulb_h2qkkh.jpg",
  };
  return {
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })), // Random price between 10 and 1000
    category: category,
    description: faker.commerce.productDescription(),
    image: imageUrls[category] || "https://res.cloudinary.com/dgmz3svbn/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1724150165/wire_yxl7iv.webp",
    rating: faker.number.int({ min: 0, max: 5 }), // Random rating between 0 and 5
    quantity: faker.number.int({ min: 1, max: 100 }), // Random quantity between 1 and 100
  }
};

const seedProducts = async () => {
  try {
    // Loop through each category and create products
    let count = 0;
    for (const category of Object.values(PRODUCT_CATEGORY)) {
      for (let i = 0; i < NUM_PRODUCTS_PER_CATEGORY; i++) {
        const productData = generateRandomProductData(category);
        await prisma.product.create({
          data: productData,
        });
        count += 1
        console.log(`${count}Product added for category ${category}: ${productData.name}`);
      }
    }
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the seed function
seedProducts();












