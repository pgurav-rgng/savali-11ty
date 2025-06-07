const cartContainer = document.getElementById("cart-items");
const totalDisplay = document.getElementById("total-price");
const cartItemCountDisplay = document.getElementById("cart-item-count");
const checkoutBtn = document.getElementById("checkout-btn");
const desktopCartIcon = document.querySelector(".desktop-cart-icon"); // Add this if you have one
const customerDetailsSection = document.getElementById("customer-details");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartIconCount();

function updateCartDisplay() {
  if (!cartContainer) return;
  cartContainer.innerHTML = "";
  let overallTotal = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML =
      '<p class="text-center text-gray-600 py-8">Your cart is empty.</p>';
    totalDisplay.textContent = "0.00";
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIconCount();
    return;
  }

  cart.forEach((item, index) => {
    const itemPrice = parseFloat(item.price.toString().replace(/[^\d.]/g, ""));
    const itemQty = parseInt(item.qty) || 1;
    const itemSubtotal = itemPrice * itemQty;
    overallTotal += itemSubtotal;

    const width = item.width || "";
    const height = item.height || "";

    const itemDiv = document.createElement("div");
    itemDiv.className =
      "flex flex-col sm:flex-row items-center bg-white p-4 rounded-xl shadow-lg mb-6 transition-all duration-300 ease-in-out hover:shadow-xl relative";

    itemDiv.innerHTML = `
      <div class="flex flex-col items-center sm:items-start w-full sm:w-auto mr-0 sm:mr-6 mb-4 sm:mb-0">
        <div class="text-2xl sm:text-3xl font-extrabold text-primary-800 mb-2 text-center">${
          item.name
        }</div>
        <div class="w-48 h-48 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
          <img 
            src="images/${item.image}" 
            alt="${item.name}" 
            width="${width}" 
            height="${height}" 
            class="max-w-full max-h-full object-contain"
          >
        </div>
        <p class="text-primary-700 text-lg font-bold mt-3 text-center">₹<span class="product-unit-price">${itemPrice.toFixed(
          2
        )}</span> ${item["with-pot"] ? "(With Pot)" : "(Without Pot)"}</p>
      </div>
      <div class="flex flex-col items-center sm:items-end justify-center sm:justify-end mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto">
        <div class="flex items-center space-x-2 mb-3">
          <button class="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full font-bold text-lg hover:bg-primary-200 transition-colors duration-200" onclick="changeQty(${index}, -1)">−</button>
          <span class="min-w-[2rem] text-center font-medium text-gray-700 text-lg">${itemQty}</span>
          <button class="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full font-bold text-lg hover:bg-primary-200 transition-colors duration-200" onclick="changeQty(${index}, 1)">+</button>
        </div>
        <div class="product-subtotal">₹<span class="subtotal-amount">${itemSubtotal.toFixed(
          2
        )}</span></div>
        <button class="text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer p-1 rounded-full hover:bg-red-100 mt-2 sm:mt-0" onclick="removeItem(${index})" title="Remove Item">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `;
    cartContainer.appendChild(itemDiv);
  });

  totalDisplay.textContent = isNaN(overallTotal)
    ? "0.00"
    : overallTotal.toFixed(2);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIconCount();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    removeItem(index);
  } else {
    updateCartDisplay();
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function updateCartIconCount() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalItems = cart.reduce(
    (sum, item) => sum + (parseInt(item.qty) || 1),
    0
  );

  document
    .querySelectorAll("#cart-item-count, #mobile-cart-item-count")
    .forEach((counter) => {
      if (totalItems > 0) {
        counter.textContent = totalItems;
        counter.classList.remove("hidden");
      } else {
        counter.classList.add("hidden");
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartDisplay();
});

let isPlacingOrder = false;
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async function () {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!isPlacingOrder) {
      customerDetailsSection.classList.remove("hidden");
      document.getElementById("mobile-cart-icon")?.classList.add("hidden");
      checkoutBtn.textContent = "Place Order";
      isPlacingOrder = true;
    } else {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = "Placing Order...";
      await processCheckout();
    }
  });
}

// Ensure processCheckout() validates inputs
async function processCheckout() {
  const name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();

  phone = phone.replace(/[^\d]/g, "");
  if (phone.startsWith("0")) phone = phone.slice(1);

  if (phone.length === 10) {
    phone = "+91" + phone;
  } else if (phone.length === 12 && phone.startsWith("91")) {
    phone = "+" + phone;
  }

  if (!name || !/^\+91\d{10}$/.test(phone)) {
    showToast("Please enter a valid 10-digit mobile number");

    // Reset button state
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Place Order";
    isPlacingOrder = true; // Stay in order mode
    return;
  }

  // In cart.js, modify the orderData object in the processCheckout function (around line 180)
  const orderData = {
    customer: { name, phone, address, formattedPhone: phone }, // Add formattedPhone here
    items: cart.map((item) => ({
      name: item.name,
      id: item.id,
      quantity: parseInt(item.qty) || 1,
      price: parseFloat(item.price.toString().replace(/[^\d.]/g, "")),
    })),
    total: cart
      .reduce((total, item) => {
        const price = parseFloat(item.price.toString().replace(/[^\d.]/g, ""));
        return total + price * (parseInt(item.qty) || 1);
      }, 0)
      .toFixed(2),
  };

  try {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    const functionUrl = isLocalhost
      ? `${window.location.protocol}//${window.location.hostname}:8888/.netlify/functions/process-order`
      : "/.netlify/functions/process-order";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorDetails = await response
        .clone()
        .json()
        .catch(() => response.text());
      throw new Error(`Server error: ${JSON.stringify(errorDetails)}`);
    }

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    window.location.href = "thank-you.html";
    // In cart.js, replace the catch block in processCheckout (around line 220) with:
  } catch (error) {
    console.error("Checkout error:", error);

    try {
      const errorData = JSON.parse(error.message.replace("Server error: ", ""));
      if (errorData.partial_success) {
        // Partial success - messages might still be delivered
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
        window.location.href = "thank-you.html";
        return;
      }
    } catch (e) {
      // Not a partial success error
    }

    showToast("Order failed. Please try again.");

    // Reset button state
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = "Place Order";
    isPlacingOrder = true;
  }
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className =
    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl text-lg z-50";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
