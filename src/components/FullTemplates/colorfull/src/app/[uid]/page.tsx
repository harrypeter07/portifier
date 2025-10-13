import { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomSliceZone from "@/components/CustomSliceZone";
import { getPageByUID, getPagesData } from "@/lib/data";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const page = await getPageByUID(uid);
  
  if (!page) {
    notFound();
  }

  return <CustomSliceZone slices={page.slices} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const page = await getPageByUID(uid);
  
  if (!page) {
    notFound();
  }

  return {
    title: page.meta_title,
    description: page.meta_description,
  };
}

export async function generateStaticParams() {
  const pages = await getPagesData();

  return pages.map((page) => {
    return { uid: page.uid! };
  });
}