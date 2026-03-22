import { Metadata } from "next";
import { tools } from "@/lib/tools";
import ToolPage from "@/components/tool-page";

const tool = tools.msg;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.seo.description,
  keywords: tool.seo.keywords,
};

export default function MsgToMarkdown() {
  return <ToolPage tool={tool} />;
}
