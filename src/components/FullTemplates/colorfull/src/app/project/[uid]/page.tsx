import { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomSliceZone from "../../../components/CustomSliceZone";
import { getProjectByUID, getProjectsData } from "../../../lib/data";

type Params = { uid: string };

export default async function Page({ params }: { params: Params }) {
  const { uid } = params;
  const page = await getProjectByUID(uid);
  
  if (!page) {
    notFound();
  }

  return <CustomSliceZone slices={page.slices} />;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { uid } = params;
  const page = await getProjectByUID(uid);
  
  if (!page) {
    notFound();
  }

  return {
    title: page.meta_title,
    description: page.meta_description,
  };
}

export async function generateStaticParams() {
  const pages = await getProjectsData();

  return pages.map((page) => {
    return { uid: page.uid };
  });
}