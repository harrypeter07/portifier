import { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomSliceZone from "@/components/CustomSliceZone";
import { getBlogPostByUID, getBlogPostsData, formatDate } from "@/lib/data";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const page = await getBlogPostByUID(uid);
  
  if (!page) {
    notFound();
  }

  const formattedDate = formatDate(page.date);
  
  return (
    <Bounded as="article">
      <div className="rounded-2xl border-2 border-slate-900 bg-slate-900 px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1">
          {page.title}
        </Heading>
        <div className="flex gap-4 text-yellow-400 text-xl font-bold">
          {page.tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-8 border-b border-slate-600 text-xl font-medium text-slate-300">
          {formattedDate}
        </p>

        <div className="prose prose-lg prose-invert mt-12 w-full max-w-none md:mt-20">
          <CustomSliceZone slices={page.slices} />
        </div>
      </div>
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
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