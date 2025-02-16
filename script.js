const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const productBox = event.target.closest(".product-box");
    addToCart(productBox);
  });
});

const cartContent = document.querySelector(".cart-content");
const promoInput = document.querySelector("#promo-code");
const applyPromoButton = document.querySelector("#apply-promo");
const discountAmountElement = document.querySelector(".discount-amount");
const totalPriceElement = document.querySelector(".total-price");
const subtotalElement = document.querySelector(".subtotal-price");
const promoMessage = document.querySelector(".promo-message");

let appliedPromoCode = null;

const addToCart = (productBox) => {
  const productImgSrc = productBox.querySelector("img").src;
  const productTitle = productBox.querySelector(".product-title").textContent;
  const productPrice = productBox.querySelector(".price").textContent;

  const cartItems = cartContent.querySelectorAll(".cart-product-title");

  for (let item of cartItems) {
    if (item.textContent === productTitle) {
      alert("This item is already in the cart");
      return;
    }
  }

  const cartBox = document.createElement("div");
  cartBox.classList.add("cart-box");
  cartBox.innerHTML = `
     <img src="${productImgSrc}" alt="" class="cart-img">
     <div class="cart-detail"> 
        <h2 class="cart-product-title">${productTitle}</h2>
        <span class="cart-price">${productPrice}</span>
        <div class="cart-quantity">
            <button class="decrement">-</button>
            <span class="number">1</span>
            <button class="increment">+</button>
        </div>
     </div>
     <i class="ri-delete-bin-line cart-remove"></i>
  `;
  cartContent.appendChild(cartBox);

  cartBox.querySelector(".cart-remove").addEventListener("click", () => {
    cartBox.remove();
    updateCartCount(-1);
    updateTotalPrice();
  });

  cartBox.querySelector(".cart-quantity").addEventListener("click", (event) => {
    const numberElement = cartBox.querySelector(".number");
    const decrementButton = cartBox.querySelector(".decrement");
    let quantity = parseInt(numberElement.textContent);

    if (event.target.classList.contains("decrement") && quantity > 1) {
      quantity--;
    } else if (event.target.classList.contains("increment")) {
      quantity++;
    }

    numberElement.textContent = quantity;
    decrementButton.style.color = quantity === 1 ? "#999" : "#333";

    updateTotalPrice();
  });

  updateCartCount(1);
  updateTotalPrice();
};

const updateTotalPrice = () => {
  let subtotal = 0;

  document.querySelectorAll(".cart-box").forEach((cartBox) => {
    const priceElement = cartBox.querySelector(".cart-price");
    const quantityElement = cartBox.querySelector(".number");

    const price = parseFloat(priceElement.textContent.replace("$", ""));
    const quantity = parseInt(quantityElement.textContent);

    subtotal += price * quantity;
  });

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

  let discount = 0;

  if (appliedPromoCode === "ostad10") {
    discount = subtotal * 0.10;
  } else if (appliedPromoCode === "ostad5") {
    discount = subtotal * 0.05;
  }

  discountAmountElement.textContent = `-$${discount.toFixed(2)}`;
  totalPriceElement.textContent = `$${(subtotal - discount).toFixed(2)}`;
};

applyPromoButton.addEventListener("click", () => {
  const enteredCode = promoInput.value.trim().toLowerCase();

  if (!enteredCode) {
    promoMessage.textContent = "Please enter a promo code.";
    promoMessage.style.color = "red";
    return;
  }

  if (appliedPromoCode) {
    promoMessage.textContent = "A promo code has already been applied.";
    promoMessage.style.color = "red";
    return;
  }

  if (enteredCode === "ostad10" || enteredCode === "ostad5") {
    appliedPromoCode = enteredCode;
    promoMessage.textContent = `Promo code applied: ${enteredCode.toUpperCase()}`;
    promoMessage.style.color = "green";
    updateTotalPrice();
  } else {
    promoMessage.textContent = "Invalid promo code.";
    promoMessage.style.color = "red";
  }
});

let cartItemCount = 0;

const updateCartCount = () => {
  const cartItemCountBadge = document.querySelector(".cart-item-count");
  const cartBoxes = document.querySelectorAll(".cart-box");
  let cartItemCount = cartBoxes.length; // Count items dynamically

  if (cartItemCount > 0) {
    cartItemCountBadge.style.visibility = "visible";
    cartItemCountBadge.textContent = cartItemCount;
  } else {
    cartItemCountBadge.style.visibility = "hidden";
    cartItemCountBadge.textContent = "";
  }
};


const buyNowButton = document.querySelector(".btn-buy");
buyNowButton.addEventListener("click", () => {
  if (cartContent.children.length === 0) {
    alert("Your cart is empty. Please add items to your cart before buying.");
    return;
  }

  while (cartContent.firstChild) {
    cartContent.firstChild.remove();
  }

  cartItemCount = 0;
  appliedPromoCode = null;
  promoMessage.textContent = "";
  promoInput.value = "";
  updateCartCount(0);
  updateTotalPrice();

  alert("Thank you for your purchase!");
});
