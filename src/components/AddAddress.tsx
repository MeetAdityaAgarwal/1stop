

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/src/utils/trpc";
import { toast } from "react-hot-toast";

import Button from "@/src/components/ui/Button";
import LoadingScreen from "@/src/components/screens/LoadingScreen";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import type { NextPageWithLayout } from "@/src/pages/_app";




/////////////////////
// Address Details //
/////////////////////
const schema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  receiverName: z.string().optional(),
  addressNickname: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  isPrimary: z.boolean().default(false),
});
type AddressInputs = z.infer<typeof schema>;
const AddNewAddress: NextPageWithLayout = () => {
  const sessionQuery = trpc.users.getSession.useQuery();
  const addAddressMutation = trpc.users.addAddress.useMutation({
    onSuccess: () => {
      toast.success("Address added!");
    },
    onError: (e) => {
      console.error('Error adding address:', e);
      toast.error(e.message);
    },
  });

  const { register, handleSubmit, } = useForm<AddressInputs>({ resolver: zodResolver(schema) });


  const onSubmit: SubmitHandler<AddressInputs> = async (data) => {
    console.log('Submitting data:', data); // Debug statement
  };


  if (sessionQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (sessionQuery.isError) {
    return <ErrorScreen error={sessionQuery.error} />;
  }

  return (
    <>
      <div className="grid gap-4">
        <h1>Save New Address</h1>
        <form
          aria-label="add address form"
          className="grid gap-2.5 whitespace-nowrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid gap-2">
            <label htmlFor="receiverName" className="text-xs font-medium text-title md:text-sm">Receiver Name</label>
            <input
              type="text"
              id="receiverName"
              className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
              placeholder="Enter receiver's name"
              {...register("receiverName")}
            />
          </fieldset>
          <fieldset className="grid gap-2">
            <label htmlFor="addressNickname" className="text-xs font-medium text-title md:text-sm">Address Nickname</label>
            <input
              type="text"
              id="addressNickname"
              className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
              placeholder="Enter address nickname"
              {...register("addressNickname")}
            />
          </fieldset>
          <fieldset className="grid gap-2">
            <label htmlFor="city" className="text-xs font-medium text-title md:text-sm">City</label>
            <input
              type="text"
              id="city"
              className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
              placeholder="Enter city"
              {...register("city")}
            />
          </fieldset>
          <fieldset className="grid gap-2">
            <label htmlFor="state" className="text-xs font-medium text-title md:text-sm">
              State
            </label>
          </fieldset>
          <fieldset className="grid gap-2">
            <label htmlFor="country" className="text-xs font-medium text-title md:text-sm">Country</label>
            <input
              type="text"
              id="country"
              className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
              placeholder="Enter country"
              {...register("country")}
            />
          </fieldset>
          <fieldset className="grid gap-2">
            <label htmlFor="zipCode" className="text-xs font-medium text-title md:text-sm">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
              placeholder="Enter zip code"
              {...register("zipCode")}
            />
          </fieldset>
          <fieldset className="grid gap-2">
            <label htmlFor="isPrimary" className="text-xs font-medium text-title md:text-sm">Primary Address</label>
            <input
              type="checkbox"
              id="isPrimary"
              className="w-5 h-5"
              {...register("isPrimary")}
            />
          </fieldset>
          <Button
            aria-label="add address"
            className="w-full"
            disabled={addAddressMutation.isLoading}
          >
            {addAddressMutation.isLoading ? "Loading..." : "Add Address"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default AddNewAddress;
