import { Metadata } from "next";
import { tools } from "@/lib/tools";
import ToolPage from "@/components/tool-page";

const tool = tools.epub;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.seo.description,
  keywords: tool.seo.keywords,
};

export default function EpubToMarkdown() {
  return <ToolPage tool={tool} />;
}
