module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addWatchTarget("./css/");

  return {
    dir: {
      input: "src",       
      includes: "_includes",
      data: "_data",
      output: "public"
    },

    templateFormats: ["html", "md", "njk"],

    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};