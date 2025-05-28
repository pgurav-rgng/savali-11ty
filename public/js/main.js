document.addEventListener('DOMContentLoaded', () => {
  const productListing = document.getElementById("product-listing");
  // Load videos
  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => {
        const productCard = `
                  <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                      <div class="h-48 overflow-hidden">
                          <img src="images/${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                      </div>
                      <div class="p-4">
                          <h3 class="text-xl font-semibold text-gray-800 mb-2">${product.name}</h3>
                          <p class="text-gray-600 text-sm mb-4">${product.description}</p>
                          <div class="flex justify-between items-center">
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
      productListing.innerHTML =
        '<p class="text-center text-red-500">Failed to load products. Please try again later.</p>';
    });
});

// Load videos
fetch('videos.json')
    .then(response => response.json())
    .then(videos => {
        const container = document.getElementById('video-container');
        
        if (container) {
            videos.forEach(video => {
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
        }
    })
    .catch(error => console.error('Error loading videos:', error));