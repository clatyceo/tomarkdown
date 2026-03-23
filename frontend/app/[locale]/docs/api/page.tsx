import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("api");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function ResponseBlock({ children }: { children: string }) {
  return (
    <pre className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

export default async function ApiDocs() {
  const t = await getTranslations("api");

  const BASE_URL = "https://api.tomdnow.com";

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">{t("h1")}</h1>
        <p className="mt-4 text-lg text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="space-y-12">
        {/* Authentication */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {t("authHeader")}
          </h2>
          <p className="text-gray-600 mb-4">{t("authHeaderDesc")}</p>
          <CodeBlock>{`X-Api-Key: tmd_your_api_key_here`}</CodeBlock>
        </section>

        {/* Get API Key */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {t("getKey")}
          </h2>
          <p className="text-gray-600 mb-4">{t("getKeyDesc")}</p>
          <CodeBlock>
            {`curl -X POST ${BASE_URL}/api/v1/keys \\
  -H "Email: you@example.com"`}
          </CodeBlock>
          <p className="mt-4 mb-2 text-sm font-medium text-gray-700">
            {t("response")}:
          </p>
          <ResponseBlock>
            {`{
  "api_key": "tmd_abc123...",
  "tier": "free",
  "daily_limit": 50
}`}
          </ResponseBlock>
        </section>

        {/* Convert a File */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {t("convert")}
          </h2>
          <p className="text-gray-600 mb-4">{t("convertDesc")}</p>
          <CodeBlock>
            {`curl -X POST ${BASE_URL}/api/v1/convert \\
  -H "X-Api-Key: tmd_your_api_key" \\
  -F "file=@document.pdf"`}
          </CodeBlock>
        </section>

        {/* Response Format */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {t("response")}
          </h2>
          <p className="text-gray-600 mb-4">{t("responseDesc")}</p>
          <ResponseBlock>
            {`{
  "markdown": "# Document Title\\n\\nConverted content...",
  "metadata": {
    "title": "document",
    "type": "pdf",
    "size": 102400
  },
  "api_usage": {
    "tier": "free",
    "daily_remaining": 47
  }
}`}
          </ResponseBlock>
        </section>

        {/* Rate Limits */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {t("rateLimits")}
          </h2>
          <p className="text-gray-600 mb-4">{t("rateLimitsDesc")}</p>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">
                    Tier
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">
                    Daily Limit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-gray-700">Free</td>
                  <td className="px-4 py-3 text-gray-700">
                    {t("freeTier")}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700">Pro</td>
                  <td className="px-4 py-3 text-gray-700">
                    {t("proTier")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Supported Formats */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {t("supportedFormats")}
          </h2>
          <p className="text-gray-600">{t("supportedFormatsDesc")}</p>
        </section>
      </div>
    </div>
  );
}
