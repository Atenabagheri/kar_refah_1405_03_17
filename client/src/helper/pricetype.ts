export function priceType(price: number) {
  return new Intl.NumberFormat().format(price);
}
