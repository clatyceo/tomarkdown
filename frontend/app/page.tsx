import ToolCard from "@/components/tool-card";
import { toolsByCategory } from "@/lib/tools";

const categories = toolsByCategory;

const features = [
  { title: "100% Free", desc: "No sign-up, no limits, no hidden fees." },
  { title: "Fast Conversion", desc: "Convert files in seconds, not minutes." },
  { title: "Instant Download", desc: "Download or copy your Markdown right away." },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <section className="text-center py-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Convert Any File to{" "}
          <span className="font-serif italic text-blue-600">Markdown</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          PDF, Word, Excel, PowerPoint, YouTube and more — converted to clean Markdown files for free.
        </p>
      </section>

      {categories.map((cat) => (
        <section key={cat.name} className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.h1.replace("Convert ", "")}
                description={tool.subtitle}
                href={`/${tool.slug}`}
                icon={tool.icon}
                color={tool.color}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {features.map((f) => (
            <div key={f.title}>
              <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "ToMarkdown",
            description: "Free online tool to convert any file to Markdown",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </div>
  );
}
