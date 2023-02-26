
import { z, defineCollection } from "astro:content";

const chapterCollection = defineCollection({
  schema: z.object({
    chapter: z.number(),
    title: z.string(),
  }),
});

export const collections = {
  "chapters": chapterCollection,
};
