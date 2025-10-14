import Bounded from "../../components/Bounded";
import Heading from "../../components/Heading";
import ContentList from "./ContentList";
import { JSX } from "react";
import { SliceData } from "../../lib/data";
import { getBlogPostsData, getProjectsData } from "../../lib/data";
import React from "react";
/**
 * Props for `ContentIndex`.
 */
export type ContentIndexProps = {
  slice: SliceData;
};

/**
 * Component for "ContentIndex" Slices.
 */
const ContentIndex = async ({ slice }: ContentIndexProps): Promise<JSX.Element> => {
   const blogPosts = await getBlogPostsData();
   const projects = await getProjectsData();

   const contentType = slice.primary.content_type || "Blog"
   const items = contentType === "Blog" ? blogPosts : projects;


  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={contentType === "Blog" ? "blog" : "projects"}
    >
      <Heading  size="xl" className="mb-8">
        {slice.primary.heading}
      </Heading>
      {slice.primary.description && (
        <div className="mb-10 prose prose-xl prose-invert">
          <p>{slice.primary.description}</p>
        </div>
      )}

      <ContentList items={items} contentType={contentType} viewMoreText={slice.primary.view_more_text} fallbackItemImage={slice.primary.fallback_item_image} />
    </Bounded>
  );
};

export default ContentIndex;
