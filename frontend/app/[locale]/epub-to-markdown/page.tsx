import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { tools } from "@/lib/tools";
import ToolPage from "@/components/tool-page";

const tool = tools.epub;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `tools.${tool.key}` });
  return {
    title: t("title"),
    description: t("seoDescription"),
    keywords: t("seoKeywords"),
  };
}

export default function EpubToMarkdown() {
  return <ToolPage tool={tool} />;
}
