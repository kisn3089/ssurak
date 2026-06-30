export const transCurrencyFormat = (price: number) =>
  new Intl.NumberFormat("ko-KR", {
    currency: "KRW",
    style: "currency",
  }).format(price);
