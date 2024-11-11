
import type { GetServerSideProps } from "next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/src/utils/trpc";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Head from "next/head";
import { useRouter } from 'next/router';
import Button from "@/src/components/ui/Button";
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import LoadingScreen from "@/src/components/screens/LoadingScreen";
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import { getServerAuthSession } from "@/src/server/common/get-server-auth-session";
import type { NextPageWithLayout } from "../../_app";
import MapWithMarker from "@/src/components/Map";
import type { SavedAddress } from "@prisma/client"
import RazorpayCheckout from "@/src/components/razorpayModal";
import { signIn, useSession } from "next-auth/react";
import { useCartStore } from "@/src/stores/cart";
import React from 'react'

const schema = z.object({
  receiverName: z.string().optional(),
  addressNickname: z.string().min(1, "Nick-Name is required"),
  isPrimary: z.boolean().default(false),
  receiverPhone: z.string().regex(/^[a-zA-Z0-9\s]*$/, "No special characters allowed").refine((data: string) => data?.length === 10 && /^[1-9]/.test(data), {
    message: `Number must be 10 digits long and no "0" in start`,
  }),
});
type AddressInputs = z.infer<typeof schema>;
const AddAddress: NextPageWithLayout = () => {
  const { status } = useSession();
  const router = useRouter()

  const [showForm, setShowForm] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const defaultLocation = { lat: 30.322187, lng: 78.017813 };
  const [markerLocation, setMarkerLocation] = useState<google.maps.LatLngLiteral | null>(defaultLocation);


  const sessionQuery = trpc.users.getSession.useQuery();
  const savedAddressesQuery = trpc.users.getAddresses.useQuery(sessionQuery.data?.user?.id as string);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<SavedAddress | undefined>(undefined);

  const cartStore = useCartStore((state) => ({
    removeProducts: state.removeProducts,
    products: state.products,
  }));




  const addAddressMutation = trpc.users.addAddress.useMutation({
    onSuccess: () => {
      toast.success("Address added!");
      refetchAddresses();
    },
    onError: (e) => {
      console.error('Error adding address:', e);
      toast.error(e.message);
    },
  });

  const deleteAddressMutation = trpc.users.deleteAddress.useMutation({
    onSuccess: () => {
      toast.success("Address Deleted!");
      refetchAddresses();
    },
    onError: (e) => {
      console.error('Error deleting address:', e);
      toast.error(e.message);
    },
  });
  const MarkAddressPrimaryMutatiion = trpc.users.markPrimary.useMutation({
    onSuccess: () => {
      toast.success("Marked Primary!");
      refetchAddresses();
    },
    onError: (e) => {
      console.error('Error Making address Primary:', e);
      toast.error(e.message);
    },
  })
  // add order mutation
  const addOrderMutation = trpc.orders.create.useMutation({
    onSuccess: async () => {
      cartStore.removeProducts(cartStore.products.map((product) => product.id));
      toast.success("Products added to your order!");
      router.push("/app")
    },
    onError: async (err) => {
      toast.error(err.message);
    },
  });



  useEffect(() => {
    if (savedAddressesQuery.data && savedAddressesQuery.data.length === 0) {
      setShowMapModal(true);

    } if (savedAddressesQuery.data) {
      const primaryAddress = savedAddressesQuery.data.find(address => address.isPrimary);
      setSelectedDeliveryAddress(primaryAddress);
    }
  }, [savedAddressesQuery.data]);

  const refetchAddresses = async () => {
    const { data } = await savedAddressesQuery.refetch();
    if (data && data.length === 0) {
      setShowForm(false);
      setShowMapModal(true);
    }
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressInputs>({ resolver: zodResolver(schema) });

  const sessionUser = sessionQuery.data?.user
  const onSubmit: SubmitHandler<AddressInputs> = async (data) => {
    console.log("FORM SUBMITED WITH: ", markerLocation?.lat,)
    const { receiverPhone = sessionUser?.phone ?? "", ...restOfData } = data
    toast.success("submitting form")
    try {
      await addAddressMutation.mutateAsync({
        userId: sessionQuery.data?.user?.id as string,
        latitude: markerLocation?.lat,
        longitude: markerLocation?.lng,
        receiverPhone,
        ...restOfData,
      });
      setShowForm(false);
      setShowMapModal(false);
      reset(); // Reset form after submission
    } catch (error) {
      console.error('Error during mutation:', error);
      toast.error('Error adding address');
    }
  };

  const handleLocationSubmit = () => {
    if (markerLocation) {
      setShowForm(true);
      setShowMapModal(false);
      reset({ receiverPhone: sessionUser?.phone ?? "" }); // Reset default phone if necessary
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddressMutation.mutateAsync(addressId);
    } catch (error) {
      console.error('Error during mutation:', error);
      toast.error('Error deleting address');
    }
  };
  const handleMarkAddressPrimary = async (addressId: string) => {
    try {
      await MarkAddressPrimaryMutatiion.mutateAsync({
        userId: sessionQuery.data?.user?.id as string
        , selectedAddressId: addressId
      });
    } catch (error) {
      console.error('Error during mutation:', error);
      toast.error('Error deleting address');
    }

  }

  if (sessionQuery.isLoading || savedAddressesQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (sessionQuery.isError) {
    return <ErrorScreen error={sessionQuery.error} />;
  }
  if (savedAddressesQuery.isError) {
    return <ErrorScreen error={savedAddressesQuery.error} />;
  }


  const savedAddresses = savedAddressesQuery.data || [];

  return (
    <>
      <Head>
        <title>Add New Address</title>
      </Head>
      <main className="mx-auto min-h-screen w-full max-w-screen-sm px-4 pb-14 sm:w-[95vw] md:pt-30">
        <div className="mt-8 py-4">
          {!showMapModal && !showForm && savedAddresses.length > 0 ? (
            <>
              <h1 className="text-2xl text-center text-gray-500">Select Addresses</h1>
              <ul className="grid gap-4">
                {savedAddresses.sort((_, b) => (b.isPrimary ? 1 : -1)).map((address) => (
                  <li key={address.id} className={`border p-4 ${address.id == selectedDeliveryAddress?.id ? 'border-orange-500' : 'border-gray-300'}`}>
                    <h2 className="text-2xl">{address.addressNickname || "-"}</h2>
                    <p>{address.receiverName || "-:-"}</p>
                    <p className="text-gray-500">{address.city}, {address.state}, {address.country}, {address.zipCode}</p>
                    {address.isPrimary && <p className="text-sm text-green-600">Primary</p>}
                    {address.receiverPhone && <p className="text-xl text-green-600">{address.receiverPhone}</p>}
                    {address.id === selectedDeliveryAddress?.id ?
                      <Button className="mr-4 my-2 bg-red-400" onClick={() => { setSelectedDeliveryAddress(undefined) }}>Selected</Button>
                      :
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white mr-4 my-2" onClick={() => setSelectedDeliveryAddress(address)}>Deliver here</Button>
                    }
                    <Button className="bg-orange-400 mx-3" disabled={deleteAddressMutation.isLoading} onClick={() => handleDeleteAddress(address.id)}>{deleteAddressMutation.isLoading ? "...Updating" : "Delete"}</Button>
                    {!address.isPrimary && <Button className="bg-green-100 border border-green-700 text-green-900" onClick={() => handleMarkAddressPrimary(address.id)}>Mark Primary</Button>}
                  </li>
                ))}
              </ul>
              <RazorpayCheckout currency="INR" userId="User_123" orderId="Order_123" />
              <Button
                aria-label="Add to order"
                className="m-4 bg-success"
                onClick={() => {
                  status === "unauthenticated"
                    ? signIn()
                    :
                    selectedDeliveryAddress ?
                      cartStore.products && addOrderMutation.mutateAsync({
                        products: cartStore.products.map((product) => ({
                          productId: product.id,
                          productQuantity: product.quantity,
                        })),
                        shippingAddressId: selectedDeliveryAddress.id,
                      })
                      : toast.error("Please Select an address for Delivery");
                }}
                disabled={addOrderMutation.isLoading}
              >
                {addOrderMutation.isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="mr-3 inline aspect-square w-4 animate-spin text-primary"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#f4f4f4"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  `Pay COD (Cash)`
                )}
              </Button>
              <Button className="m-2 bg-success" onClick={() => setShowMapModal(true)}>Add New Address</Button>
              <p className="text-danger">*Online payment not available from the website at the moment</p>
              <p className="text-danger">please contact                 <a
                href="tel:+18171111217" // Replace with your phone number
                className="text-lg"
              >
                8171111217
              </a> for google pay/scanner</p>
            </>
          ) : showMapModal ? (
            <div className=" flex flex-col items-center justify-center">
              <h1 className="text-2xl text-center text-gray-500 py-4">
                Select Delivery Location
              </h1>
              <MapWithMarker
                defaultLocation={defaultLocation}
                markerLocation={markerLocation}
                setMarkerLocation={setMarkerLocation}
              />
              <div className="w-full flex justify-between mt-4">
                <Button className="px-6 py-3 bg-red-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  onClick={() => setShowMapModal(false)}>Cancel</Button>


                <Button
                  onClick={handleLocationSubmit}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  Confirm Location
                </Button>
              </div>
            </div>
          ) : showForm ? (
            <div className="grid gap-4 py-4">

              <h1 className="text-2xl text-center text-gray-500 py-4">Save New Address</h1>
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
                    placeholder="Sidd"
                    {...register("receiverName")}
                  />
                  {errors.receiverName && <p className="text-red-500 text-sm">{errors.receiverName.message}</p>}
                </fieldset>
                <fieldset className="grid gap-2">
                  <label htmlFor="addressNickname" className="text-xs font-medium text-title md:text-sm">Nickname for Address</label>
                  <input
                    type="text"
                    id="addressNickname"
                    className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
                    placeholder="Farm-House (Unique)"
                    {...register("addressNickname")}
                  />
                  {errors.addressNickname && <p className="text-red-500 text-sm">{errors.addressNickname.message}</p>}
                </fieldset>
                <fieldset className="grid gap-2">
                  <label htmlFor="receiverPhone" className="text-xs font-medium text-title md:text-sm">Receiver Phone</label>
                  <input
                    type="text"
                    id="receiverPhone"
                    className="w-full px-4 py-2.5 text-xs font-medium text-title md:text-sm"
                    defaultValue={sessionUser?.phone}
                    placeholder="Enter 10-digit phone number"
                    {...register("receiverPhone")}
                  />
                  {errors.receiverPhone && <p className="text-red-500 text-xs italic">{errors.receiverPhone.message}</p>}
                </fieldset>
                <fieldset className="grid gap-2">
                  <label htmlFor="isPrimary" className="text-xs font-medium text-title md:text-sm">Primary Address</label>
                  <input
                    type="checkbox"
                    id="isPrimary"
                    className="w-5 h-5"
                    {...register("isPrimary")}
                  />
                  {errors.isPrimary && <p>{errors.isPrimary.message}</p>}
                </fieldset>
                <Button
                  aria-label="add address"
                  className="w-full"
                  disabled={addAddressMutation.isLoading}
                >
                  {addAddressMutation.isLoading ? "Loading..." : "Add Address"}
                </Button>
              </form>
              <Button className="px-6 py-3 bg-red-400 text-white font-semibold rounded-lg shadow-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                onClick={() => { setShowForm(false); setShowMapModal(true) }}>Back</Button>


            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default AddAddress;

AddAddress.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession({
    req: ctx.req,
    res: ctx.res,
  });

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
