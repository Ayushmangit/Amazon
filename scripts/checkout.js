import { cart, removeFromCart, updateCartQuantity, updateDeliveryOption } from '../data/cart.js';
import { products } from '../data/products.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js'
import { deliveryOptions } from '../data/deliveryOptions.js';


document.addEventListener('DOMContentLoaded', () => {
  calculateCartQuantity();
});





const quantityElm = document.querySelector('.js-return-to-home-link');
const orderSummary = document.querySelector('.js-order-summary');
let cartQuantity = 0;


function calculateCartQuantity() {
  cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  quantityElm.innerHTML = `${cartQuantity} items`;
}
function renderOrderSummary() {

  let cartSummarytHTML = "";
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = products.find(product => product.id === productId);
    const deliveryOptionID = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionID) {
        deliveryOption = option;
      }
    });
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D')

    cartSummarytHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date:${dateString} 
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
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id = "${matchingProduct.id}">
              Update
            </span>

              <input  min="1"  class="quantity-input js-quantity-input-${matchingProduct.id}" value="${cartItem.quantity}">
              <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id = "${matchingProduct.id}">Save</span>
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

  document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      calculateCartQuantity();
    });
  });

  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const currentProductElm = document.querySelector(`.js-cart-item-container-${productId}`);
      currentProductElm.classList.add("is-editing-quantity")
    })
  })

  document.querySelectorAll(".js-save-quantity-link").forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const currentProductElm = document.querySelector(`.js-cart-item-container-${productId}`);
      currentProductElm.classList.remove("is-editing-quantity")
      const newQuantity = +document.querySelector(`.js-quantity-input-${productId}`).value;

      if (newQuantity <= 0) {
        removeFromCart(productId)
      }
      cart.forEach((item) => {
        if (item.productId === productId) {
          item.quantity = newQuantity;
        }
      })

      if (newQuantity >= 1) {
        document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
      }

      calculateCartQuantity();
    })
  })

  function deliveryOptionsHTML(cartItem) {
    let html = ''
    deliveryOptions.forEach((deliveryOption) => {

      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D')

      const priceString = deliveryOption.priceRupees === 0 ? 'Free Shipping' : `${deliveryOption.priceRupees}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `

        
          <div class="delivery-option js-delivery-option"
                data-product-id="${cartItem.productId}" 
                data-delivery-option-id="${deliveryOption.id}">
            <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${cartItem.productId}">
            <div>
              <div class="delivery-option-date">${dateString}</div>
              <div class="delivery-option-price">₹${priceString}-Shipping</div>
            </div>
          </div>
`
    })
    return html
  }


  document.querySelectorAll('.js-delivery-option').forEach((element) => {

    element.addEventListener('click', () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();

    })
  })


}

renderOrderSummary();
