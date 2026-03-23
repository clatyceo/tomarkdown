import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("security");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function Security() {
  const t = await getTranslations("security");
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">{t("h1")}</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* In-Memory Processing */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg aria-hidden="true" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t("memoryProcessingTitle")}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t("memoryProcessingDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Instant Deletion */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <svg aria-hidden="true" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t("instantDeletionTitle")}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t("instantDeletionDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* TLS Encryption */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <svg aria-hidden="true" className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t("tlsEncryptionTitle")}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t("tlsEncryptionDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* No Account Required */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <svg aria-hidden="true" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t("noAccountTitle")}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t("noAccountDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Open Source - spans full width on md+ */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <svg aria-hidden="true" className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t("openSourceTitle")}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t("openSourceDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {t("comparisonTitle")}
        </h2>
        <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
          {t("comparisonDesc")}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-4 font-semibold text-gray-900"></th>
              <th className="text-left px-6 py-4 font-semibold text-gray-900">
                {t("comparisonUs")}
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-500">
                {t("comparisonOthers")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">
                {t("comparisonStorage")}
              </td>
              <td className="px-6 py-4 text-green-700">
                {t("comparisonStorageUs")}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {t("comparisonStorageOthers")}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">
                {t("comparisonDeletion")}
              </td>
              <td className="px-6 py-4 text-green-700">
                {t("comparisonDeletionUs")}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {t("comparisonDeletionOthers")}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-gray-900">
                {t("comparisonAccount")}
              </td>
              <td className="px-6 py-4 text-green-700">
                {t("comparisonAccountUs")}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {t("comparisonAccountOthers")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
