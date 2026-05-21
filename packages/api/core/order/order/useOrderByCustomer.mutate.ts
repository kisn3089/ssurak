import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateOrderRequest, httpOrder } from "./httpOrder";
import { useCartMutations } from "../../cart";
import { pathToQueryKey } from "../../../utils";

const ordersQueryKey = pathToQueryKey("/orders/v1/sessions/orders");

export default function useOrderByCustomer() {
  const queryClient = useQueryClient();
  const cartMutate = useCartMutations();

  const createOrderByCustomer = useMutation({
    mutationKey: ["owner", "order", "create"],
    mutationFn: (createOrderPayload: CreateOrderRequest) =>
      httpOrder.createOrderByCustomer(createOrderPayload),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ordersQueryKey });
      await cartMutate.clearCart.mutateAsync();
    },
  });

  return { createOrderByCustomer };
}
