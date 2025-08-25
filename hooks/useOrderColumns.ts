import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useUpdateOrderMutation } from "@/store/orders";
import { getOrderColumns } from "@/components/dashboard/OrderColumns";

export function useOrderColumns() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [updateOrder] = useUpdateOrderMutation();

  const columns = useMemo(
    () =>
      getOrderColumns({ session, router, updateOrder, currentPath: pathname }),
    [session, router, updateOrder, pathname],
  );

  return { columns, session, router, updateOrder };
}
