import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AllToMD",
};

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed text-sm">
        <p>Last updated: March 2026</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">Data Collection</h2>
        <p>AllToMD does not collect personal data. We do not require sign-up or login.</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">File Processing</h2>
        <p>Uploaded files are processed in memory and immediately deleted. We do not store your files.</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">Analytics</h2>
        <p>We may use anonymous analytics to improve the service. No personally identifiable information is collected.</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">Contact</h2>
        <p>For questions, please reach out via our GitHub repository.</p>
      </div>
    </div>
  );
}
