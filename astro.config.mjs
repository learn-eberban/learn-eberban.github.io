import { defineConfig } from "astro/config";
import autolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), react(), tailwind({applyBaseStyles: false})],
  markdown: {
    rehypePlugins: [
      // rehypeSlug must be present, else autolinkHeadings sees no heading ids.
      rehypeSlug, 
      [autolinkHeadings, { behavior: "wrap", content: {
        type: 'element',
        tagName: 'span',
      }}]
    ]
  },
  site: "https://learn-eberban.github.io",
});
