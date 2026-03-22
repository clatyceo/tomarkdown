import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AllToMD",
};

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed text-sm">
        <p>Last updated: March 2026</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">Service</h2>
        <p>AllToMD provides free file-to-Markdown conversion. The service is provided &quot;as is&quot; without warranty.</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">Usage</h2>
        <p>You may use AllToMD for personal and commercial purposes. Do not upload illegal or copyrighted content without authorization.</p>
        <h2 className="text-lg font-semibold text-gray-900 pt-4">Limitations</h2>
        <p>We reserve the right to limit usage to prevent abuse. File size is limited to 10MB per conversion.</p>
      </div>
    </div>
  );
}
