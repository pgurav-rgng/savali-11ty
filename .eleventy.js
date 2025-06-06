const fs = require("fs");
const path = require("path");
const safeStringify = require("json-stringify-safe"); 
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("public/js");
  eleventyConfig.addPassthroughCopy("public/jpgcompressed");
  eleventyConfig.addPassthroughCopy("public/images");
  eleventyConfig.addPassthroughCopy("public/videos");
  eleventyConfig.addPassthroughCopy("public/_data/videos.json");
  eleventyConfig.addPassthroughCopy("public/_data/products.json");
  eleventyConfig.addPassthroughCopy("public/output.css");
  eleventyConfig.addPassthroughCopy("public/cart.html");
  eleventyConfig.addPassthroughCopy("public/chatbot.html");
  eleventyConfig.addPassthroughCopy("public/thank-you.html");
  eleventyConfig.addPassthroughCopy("public/googlef9dfaabb7d15595c.html");
  eleventyConfig.addFilter("currency", function (value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);
  });
  eleventyConfig.addDataExtension("json", (contents) => JSON.parse(contents));
  eleventyConfig.addNunjucksFilter("json", function (value) {
    return safeStringify(value);
  });
  return {
    dir: {
      input: "public",
      output: "dist"
    },
    passthroughFileCopy: true,
  };
};
