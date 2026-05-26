import { notFound } from "next/navigation";
import { COLLEGES } from "@/lib/data";
import { CollegeDetailClient } from "./CollegeDetailClient";
import type { Metadata } from "next";

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return COLLEGES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const college = COLLEGES.find((c) => c.id === params.id);
  if (!college) return { title: "College Not Found" };
  return {
    title: college.name,
    description: college.description.slice(0, 155),
  };
}

export default function CollegeDetailPage({ params }: PageProps) {
  const college = COLLEGES.find((c) => c.id === params.id);
  if (!college) notFound();

  return <CollegeDetailClient college={college} />;
}
