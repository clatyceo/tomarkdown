import { Metadata } from "next";
import { tools } from "@/lib/tools";
import ToolPage from "@/components/tool-page";

const tool = tools.csv;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.seo.description,
  keywords: tool.seo.keywords,
};

export default function CsvToMarkdown() {
  return <ToolPage tool={tool} />;
}
