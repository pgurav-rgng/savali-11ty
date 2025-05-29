document.addEventListener("DOMContentLoaded", () => {
    const productListing = document.getElementById("product-listing");
    // Load images
    fetch("products.json")
      .then((response) => {
        // Check if the network request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((products) => {
        // CHANGE THIS LINE: Use 'product-listing' instead of 'products-container'
        const productListing = document.getElementById("product-listing");

        if (!productListing) {
          console.error(
            "Error: HTML element with ID 'product-listing' not found."
          );
          return;
        }

        productListing.innerHTML = ""; // Clear previous content if any, before adding new products

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
                      <button class="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm transition duration-300">
                      Add to Cart
                      </button>
                  </div>
              </div>
          </div>
      `;
          productListing.innerHTML += productCard;
        });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        // CHANGE THIS LINE: Use 'product-listing' instead of 'products-container'
        const productListing = document.getElementById("product-listing");
        if (productListing) {
          productListing.innerHTML =
            '<p class="text-center text-red-500">Failed to load products. Please try again later.</p>';
        } else {
          document.body.innerHTML +=
            '<p class="text-center text-red-500">Failed to load products and display area not found. Please check console for errors.</p>';
        }
      });
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
                            <video class="absolute top-0 left-0 w-full h-full" controls poster="${video.thumbnail}">
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
            // Pause all videos after they are added to the page
            document.querySelectorAll("video").forEach((vid) => vid.pause());
        }
    })
    .catch((error) => console.error("Error loading videos:", error));
