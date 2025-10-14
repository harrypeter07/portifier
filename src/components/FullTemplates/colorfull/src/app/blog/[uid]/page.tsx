import { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomSliceZone from "../../../components/CustomSliceZone";
import { getBlogPostByUID, getBlogPostsData, formatDate } from "../../../lib/data";
import Bounded from "../../../components/Bounded";
import Heading from "../../../components/Heading";
import React from "react";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const { uid } = params;
  const page = await getBlogPostByUID(uid);
  
  if (!page) {
    notFound();
  }

  const formattedDate = formatDate(page.date);
  
  return (
    <Bounded as="article">
      <div className="px-4 py-10 rounded-2xl border-2 border-slate-900 bg-slate-900 md:px-8 md:py-20">
        <Heading as="h1">
          {page.title}
        </Heading>
        <div className="flex gap-4 text-xl font-bold text-yellow-400">
          {page.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-8 text-xl font-medium border-b border-slate-600 text-slate-300">
          {formattedDate}
        </p>

        <div className="mt-12 w-full max-w-none prose prose-lg prose-invert md:mt-20">
          <CustomSliceZone slices={page.slices} />
        </div>
      </div>
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { uid } = params;
  const page = await getBlogPostByUID(uid);
  
  if (!page) {
    notFound();
  }

  return {
    title: page.meta_title,
    description: page.meta_description,
  };
}

export async function generateStaticParams() {
  const pages = await getBlogPostsData();

  return pages.map((page) => {
    return { uid: page.uid };
  });
}