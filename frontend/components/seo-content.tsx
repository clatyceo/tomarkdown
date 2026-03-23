import { getTranslations } from "next-intl/server";
import { ToolConfig } from "@/lib/tools";

export default async function SeoContent({ tool }: { tool: ToolConfig }) {
  const t = await getTranslations("seo");
  const tTool = await getTranslations(`tools.${tool.key}`);

  const h1 = tTool("h1");

  const howToSteps = tool.howTo.map((_, i) => ({
    step: tTool(`howTo${i + 1}Step`),
    desc: tTool(`howTo${i + 1}Desc`),
  }));

  const whyReasons = tool.whyConvert.map((_, i) => tTool(`why${i + 1}`));

  const faqItems = tool.faq.map((_, i) => ({
    q: tTool(`faq${i + 1}Q`),
    a: tTool(`faq${i + 1}A`),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-gray-900">{t("howToTitle", { action: h1 })}</h2>
        <ol className="mt-4 space-y-3">
          {howToSteps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">{i + 1}</span>
              <div>
                <p className="font-medium text-gray-900">{step.step}</p>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">{t("whyTitle", { action: h1 })}</h2>
        <ul className="mt-4 space-y-2">
          {whyReasons.map((reason, i) => (
            <li key={i} className="flex gap-2 text-gray-600">
              <span className="text-blue-500">-</span> {reason}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900">{t("faqTitle")}</h2>
        <dl className="mt-4 space-y-4">
          {faqItems.map((item, i) => (
            <div key={i}>
              <dt className="font-medium text-gray-900">{item.q}</dt>
              <dd className="mt-1 text-sm text-gray-500">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: h1,
              step: howToSteps.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.step,
                text: s.desc,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]),
        }}
      />
    </div>
  );
}
