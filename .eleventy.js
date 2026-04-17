const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  const md = markdownIt({ html: true, linkify: true, typographer: true }).use(markdownItAnchor);
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("dateDisplay", (date) =>
    new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
  );
  eleventyConfig.addFilter("dateISO", (date) => new Date(date).toISOString());
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("excerpt", (content) => {
    const text = content.replace(/<[^>]*>/g, "");
    return text.slice(0, 160) + (text.length > 160 ? "\u2026" : "");
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", layouts: "_layouts" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
