import { cart, removeFromCart } from '../data/cart.js';
import { products } from '../data/products.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import { deliveryOptions } from '../data/deliveryOptions.js';


const quantityElm = document.querySelector('.js-return-to-home-link');
const orderSummary = document.querySelector('.js-order-summary');
let cartQuantity = 0;

// Recalculate cart quantity and update the DOM
function calculateCartQuantity() {
  cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  quantityElm.innerHTML = `${cartQuantity} items`;
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  calculateCartQuantity();
});

let cartSummarytHTML = "";
cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  const matchingProduct = products.find(product => product.id === productId);

  cartSummarytHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            "${matchingProduct.name}" 
          </div>
          <div class="product-price">
            ₹${matchingProduct.priceRupees}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id = "${matchingProduct.id}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
                  ${deliveryOptionsHTML(cartItem)}

               </div>
            </div>
      </div>
    </div>
  `;
});

orderSummary.innerHTML = cartSummarytHTML;

// Attach delete listeners
document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    // Remove from cart data
    removeFromCart(productId);

    // Remove from DOM
    const itemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
    if (itemContainer) {
      itemContainer.remove();
    }

    // Update quantity display
    calculateCartQuantity();
  });
});

document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    console.log(productId);
  })
})

function deliveryOptionsHTML(cartItem) {

  let html = ''
  deliveryOptions.forEach((deliveryOption) => {

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D')

    const priceString = deliveryOption.priceRupees === 0 ? 'Free Shipping' : `${deliveryOption.priceRupees}`;

    html += `

        
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input" name="delivery-option-1-${cartItem.productId}">
            <div>
              <div class="delivery-option-date">${dateString}</div>
              <div class="delivery-option-price">₹${priceString}</div>
            </div>
          </div>
`
  })
  return html
}
