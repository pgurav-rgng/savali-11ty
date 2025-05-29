document.addEventListener("DOMContentLoaded", () => {
  const productListing = document.getElementById("product-listing");

  // Load products
  fetch("products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((products) => {
      if (!productListing) {
        console.error(
          "Error: HTML element with ID 'product-listing' not found."
        );
        return;
      }

      productListing.innerHTML = "";

      products.forEach((product) => {
        let potIncludedHtml = "";
        if (product && product["with-pot"]) {
          potIncludedHtml =
            '<p class="text-green-600 text-sm font-semibold mt-1">Pot included</p>';
        }

        const productCard = `
              <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex flex-col h-full min-h-[400px]">
                  <div class="h-48 overflow-hidden flex items-center justify-center bg-gray-100">
                  <img 
                      src="images/${product.image}" 
                      alt="${product.name}" 
                      class="max-h-full max-w-full object-cover safe-image" 
                      loading="lazy" 
                  >
                  </div>
                  <div class="p-4 flex flex-col flex-grow">
                      <h3 class="text-xl font-semibold text-gray-800 mb-2">${product.name}</h3>
                      ${potIncludedHtml} 
                      <p class="text-gray-600 text-sm flex-grow"> 
                          ${product.description}
                      </p>
                      <div class="flex justify-between items-center mt-auto">
                          <span class="text-lg font-bold text-primary-600">₹${product.price}</span>
                          <button class="add-to-cart bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm transition duration-300" data-id="${product.id}">
                          Add to Cart
                          </button>
                      </div>
                  </div>
              </div>
              `;
        productListing.innerHTML += productCard;
      });

      // Add event listeners to all "Add to Cart" buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(this.dataset.id);
          const product = products.find((p) => p.id === productId);
          if (product) {
            addToCart(product);
            showCartNotification("Product added to cart!");
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      if (productListing) {
        productListing.innerHTML =
          '<p class="text-center text-red-500">Failed to load products. Please try again later.</p>';
      }
    });

  // Load videos
  fetch("videos.json")
    .then((response) => response.json())
    .then((videos) => {
      const container = document.getElementById("video-container");
      if (container) {
        videos.forEach((video) => {
          const videoElement = `
                      <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          <div class="relative pb-[56.25%] h-0 overflow-hidden">
                              <video class="absolute top-0 left-0 w-full h-full" controls poster="${video.thumbnail}" loading="lazy">
                                  <source src="videos/${video.filename}" type="video/mp4">
                              </video>
                          </div>
                          <div class="p-4">
                              <h3 class="text-xl font-semibold text-gray-800 mb-2">${video.title}</h3>
                              <p class="text-gray-600">${video.description}</p>
                          </div>
                      </div>
                  `;
          container.innerHTML += videoElement;
        });
        document.querySelectorAll("video").forEach((vid) => vid.pause());
      }
    })
    .catch((error) => console.error("Error loading videos:", error));
});

// Cart functionality
function renderProduct(product) {
  const container = document.getElementById("product-list");
  const card = document.createElement("div");
  card.innerHTML = `
    <img src="images/${product.image}" alt="${product.name}" width="100">
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <p>₹${product.price}</p>
    <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
  `;
  container.appendChild(card);
}
function showCartNotification(message) {
  // You can implement a more complex notification (e.g., a fading pop-up)
  // For now, a simple console log or alert can be used.
  console.log(message);
  // Example of a basic notification (uncomment and style with CSS if needed)
  /*
  const notificationDiv = document.createElement('div');
  notificationDiv.className = 'fixed bottom-28 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg cart-notification';
  notificationDiv.textContent = message;
  document.body.appendChild(notificationDiv);
  setTimeout(() => {
      notificationDiv.classList.add('show');
  }, 10); // Small delay for animation
  setTimeout(() => {
      notificationDiv.classList.remove('show');
      notificationDiv.addEventListener('transitionend', () => notificationDiv.remove());
  }, 3000); // Hide after 3 seconds
  */
}

function addToCart(product) {
  // Check if product already exists in cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      ...product,
      qty: 1,
    });
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the cart icon count
  updateCartIconCount();
}
