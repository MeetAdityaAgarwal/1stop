import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";
import CustomDropzone from "@/src/components/ui/FileInput"; // Ensure the correct path to your FileInput component
import { trpc } from "@/src/utils/trpc";
import { PRODUCT_CATEGORY } from "@prisma/client";

// Fixing the enum issue
const categoriesArray = Object.values(PRODUCT_CATEGORY) as [string, ...string[]];

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.enum(categoriesArray, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  description: z.string().min(3, "Description must be at least 3 characters long"),
  image: z.unknown().refine((v) => v instanceof File, {
    message: "Expected a file for the image",
  }),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
});

type Inputs = z.infer<typeof schema>;

export default function AddProduct() {
  const [preview, setPreview] = useState<string | undefined>();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const addProductMutation = trpc.admin.products.create.useMutation({
    onSuccess: () => {
      toast.success("Product added successfully!");
      reset();
      setPreview(undefined);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const reader = new FileReader();
    reader.readAsDataURL(data.image as File);
    reader.onload = async () => {
      const base64 = reader.result as string;
      await addProductMutation.mutateAsync({
        ...data,
        category: data.category as PRODUCT_CATEGORY, // Fixing the category type issue
        image: base64,
      });
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Add Product</h1>
        <Button onClick={handleSubmit(onSubmit)} size="lg">Save Product</Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
        <div className="grid gap-4">
          <div className="border rounded-lg overflow-hidden">
            {preview ? (
              <Image src={preview} alt="Product Image" width={800} height={800} className="w-full h-full object-cover" />
            ) : (
              <Image src="https://placeholder.pics/svg/400" alt="Product Image" width={400} height={400} className="w-full object-cover" />
            )}
            <div className="p-4">
              <CustomDropzone<Inputs>
                id="add-product-image"
                name="image"
                setValue={setValue}
                preview={preview}
                setPreview={setPreview}
              />
              {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <button key={i} className="border rounded-lg overflow-hidden transition-colors hover:border-primary">
                <Image
                  src={preview || ""}
                  alt="Product Thumbnail"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {/* Product Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="Enter product name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Product Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter product description" {...register("description")} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Price and Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" placeholder="Enter price" {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesArray.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0) + category.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
            </div>
          </div>

          {/* Rating */}
          <div className="grid gap-2">
            <Label htmlFor="rating">Rating</Label>
            <Input id="rating" type="number" step="0.1" placeholder="Enter rating (0-5)" {...register("rating", { valueAsNumber: true })} />
            {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
          </div>
        </div>
      </form>
    </div>
  );
}

