import { Metadata } from "next";
import CustomSliceZone from "@/components/CustomSliceZone";
import { getHomepageData } from "@/lib/data";

export default async function Page() {
  const page = await getHomepageData();

  return <CustomSliceZone slices={page.slices} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepageData();

  return {
    title: page.meta_title,
    description: page.meta_description,
  };
}