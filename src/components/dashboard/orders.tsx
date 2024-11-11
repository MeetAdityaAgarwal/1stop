
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import ErrorScreen from "@/src/components/screens/ErrorScreen";
import LoadingScreen from "@/src/components/screens/LoadingScreen"; // Assuming you have a type definition for Order
import OrderDetailsModal from "../OrderDetailsModal"
import type { OrderWithDetails } from "@/src/types/globals";
import { formatCurrency } from "@/src/utils/format"

import { trpc } from "@/src/utils/trpc";
import { useState } from "react"


function MyOrders() {

  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | undefined>(undefined);
  // Fetch orders when the page loads
  const ordersQuery = trpc.admin.orders.get.useQuery({
    sortBy: "createdAt",
    sortDesc: true,
  });
  // Handle loading states
  if (ordersQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (ordersQuery.isError) {
    return <ErrorScreen error={ordersQuery.error} />;
  }
  if (
    ordersQuery.data?.orders.length === 0
  ) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-xl font-semibold text-title md:text-3xl">
          You have no orders
        </div>
      </div>
    );
  }

  const orderValue = (order: OrderWithDetails) => {
    return order?.items?.reduce(
      (acc, item) => acc + (item.product?.price * item.quantity),
      0
    );


  }
  const closeModal = () => {
    setSelectedOrder(undefined)
  }


  const orders = ordersQuery.data.orders;


  return (
    <div>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="border shadow-sm rounded-lg p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order</TableHead>
                <TableHead className="min-w-[150px]">Customer</TableHead>
                <TableHead className="hidden md:table-cell">E-mail</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:cursor-pointer hover:bg-gray-50" onClick={() => setSelectedOrder(order)}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.createdAt.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{formatCurrency(orderValue(order), "INR")}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.status}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoveHorizontalIcon className="w-4 h-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View order</DropdownMenuItem>
                        <DropdownMenuItem>Customer details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      {selectedOrder && <OrderDetailsModal order={selectedOrder} _onClose={closeModal} />}
    </div>
  )
}

export default MyOrders
function MoveHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}


