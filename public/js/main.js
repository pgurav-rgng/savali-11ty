console.log("main.js loaded!");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
});
// At the top of your script
const productListing = document.getElementById('product-listing');
const categoryButtons = document.querySelectorAll('.category-btn');
// Product Filtering System
document.addEventListener('DOMContentLoaded', () => {
  // 1. Get products from hidden div
  const productsRaw = document
    .getElementById("products-data")
    .textContent.trim();
  const productsData = JSON.parse(productsRaw);
  renderCategory("Flowering", productsData);
  createCategoryButtons(productsData, "Flowering");
  
  // 4. Connect category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Highlight button
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

const hardcodedCategories = [
  "Indoor",
  "Outdoor",
  "Flowering",
  "Succulents",
  "Air Purifying",
  "Palms",
  "Spices",
  "Hanging",
  "Fruit Plants",
  "Pots",
  "Gifts",
  "Landscaping",
  "Fertilizers",
];

function createCategoryButtons(products, selectedCategory = "Flowering") {
  console.log("createCategoryButtons called with", products.length, "products");
  const container = document.getElementById("category-container");
  if (!container) return;

  // Loop over already-rendered buttons
  const buttons = container.querySelectorAll("button.category-btn");
  buttons.forEach((btn) => {
    const cat = btn.innerText.trim();

    const isSelected = cat.toLowerCase() === selectedCategory.toLowerCase();
    if (isSelected) {
      btn.classList.add("bg-green-600", "text-white", "shadow-md");
      btn.classList.remove(
        "bg-white",
        "border",
        "border-green-400",
        "text-green-700",
        "hover:bg-green-50"
      );
    }

    btn.addEventListener("click", () => {
      console.log("Clicked category:", cat);
      buttons.forEach((b) => {
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
  });
}

// Update the renderCategory function to include proper grid structure
function renderCategory(categoryName, products) {
  const productListing = document.getElementById("product-listing");
  if (!productListing) return;

  // Clear existing content and recreate the grid structure
  productListing.innerHTML = `
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" id="product-grid">
      </div>
    </div>
  `;

  const productGrid = document.getElementById("product-grid");
  
  const filtered = products.filter((product) =>
    product.category.some(
      (cat) => cat.toLowerCase() === categoryName.toLowerCase()
    )
  );

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p class="text-center text-gray-500 col-span-full">No products found in "${categoryName}" category.</p>`;
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

    productGrid.innerHTML += productCard;
  });

  // Reattach cart event listeners
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function() {
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
