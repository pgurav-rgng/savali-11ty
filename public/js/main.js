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
      const defaultCategory = "Flowering";
      createCategoryButtons(products, defaultCategory);
      renderCategory(defaultCategory, products);
      
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

const hardcodedCategories = [
  "Indoor",
  "Outdoor",
  "Flowering",
  "Succulents",
  "Air Purifying",
  "Palms",
  "Herbs & Spices",
  "Hanging Plants",
  "Fruit Plants",
  "Pots",
  "Gifts",
  "Landscaping",
  "Fertilizers"
];

function createCategoryButtons(products, selectedCategory = "Indoor") {
  const wrapper = document.getElementById("categories-wrapper");
  const container = document.getElementById("category-container");
  container.className = "flex flex-wrap justify-center gap-3 px-2";
  if (!wrapper || !container) return;

  wrapper.className = `mb-8 bg-green-100 rounded-lg border border-green-300 max-w-screen-xl mx-auto p-4 px-4 sm:px-4 lg:px-6`;
  container.innerHTML = "";

  hardcodedCategories.forEach((cat) => {
    const isSelected = cat.toLowerCase() === selectedCategory.toLowerCase();
    const btn = document.createElement("button");

    btn.className = `category-btn ${
      isSelected
        ? "bg-green-600 text-white shadow-md"
        : "bg-white border border-green-400 text-green-700 hover:bg-green-50"
    } px-4 py-2 rounded-full font-medium transition-colors duration-200`;

    btn.innerText = cat;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach((b) => {
        b.classList.remove("bg-green-600", "text-white", "shadow-md");
        b.classList.add(
          "bg-white",
          "border",
          "border-green-400",
          "text-green-700",
          "hover:bg-green-50"
        );
      });

      btn.classList.add("bg-green-600", "text-white", "shadow-md");
      btn.classList.remove(
        "bg-white",
        "border",
        "border-green-400",
        "text-green-700",
        "hover:bg-green-50"
      );

      renderCategory(cat, products);
    });

    container.appendChild(btn);
  });
}

function renderCategory(categoryName, products) {
  const productListing = document.getElementById("product-listing");
  if (!productListing) return;

  productListing.innerHTML = "";

  const filtered = products.filter((product) =>
    product.category.some(
      (cat) => cat.toLowerCase() === categoryName.toLowerCase()
    )
  );

  if (filtered.length === 0) {
    productListing.innerHTML = `<p class="text-center text-gray-500">No products found in "${categoryName}" category.</p>`;
    return;
  }

  filtered.forEach((product) => {
    let potIncludedHtml = "";
    if (product["with-pot"]) {
      potIncludedHtml =
        '<p class="text-green-600 text-sm font-semibold mt-1">Pot included</p>';
    }

    let productImage = product.image.trim();
    if (productImage.toLowerCase().endsWith(".webp")) {
      productImage = productImage.slice(0, -5) + ".jpg";
    }

    const width = product.width || "";
    const height = product.height || "";

    const productCard = `
      <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex flex-col h-full min-h-[400px]">
        <div class="h-48 overflow-hidden flex items-center justify-center bg-gray-100">
          <picture>
            <source srcset="jpgcompressed/${productImage}" type="image/jpeg">
            <img 
              src="images/${product.image}" 
              alt="${product.name}" 
              loading="lazy"
              width="${width}"
              height="${height}"
              class="object-contain max-h-48 mx-auto"
            >
          </picture>
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

  // Reattach cart event listeners for newly added buttons
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
}

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
  console.log(message);
}

function showToast(message = "Item added to cart!") {
  const toast = document.getElementById("cart-toast");
  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 1500);
}

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      "with-pot": product["with-pot"],
      width: product.width || "",
      height: product.height || "",
      qty: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIconCount();
  showToast("Item added to cart!");
}
