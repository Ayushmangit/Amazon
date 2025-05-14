export const cart = []


export function addToCart(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  const selectedQuantity = document.querySelector(`.js-select-value-${productId}`)
  const selectedValue = +selectedQuantity.value;
  if (matchingItem) {
    matchingItem.quantity += selectedValue;
  } else {
    cart.push({
      productId: productId,
      quantity: selectedValue,
    });
  }
}



