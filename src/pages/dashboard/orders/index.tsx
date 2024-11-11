import type { NextPageWithLayout } from "@/src/pages/_app";
import DefaultLayout from "@/src/components/layouts/DefaultLayout";
import DashboardOrderscomponent from "@/src/components/DashboardOrders"

const Orders: NextPageWithLayout = () => {
  return (
    <main className="min-h-screen">
      <DashboardOrderscomponent />
    </main>
  )

};

export default Orders;

Orders.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;




