import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — AllToMD",
  description: "Learn about AllToMD, a free tool to convert any file to Markdown.",
};

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">About AllToMD</h1>
      <div className="mt-6 space-y-4 text-gray-600 leading-relaxed">
        <p>
          AllToMD is a free online tool that converts various file formats into clean, readable Markdown.
        </p>
        <p>
          Whether you need to convert a PDF report, a Word document, or a YouTube video transcript,
          AllToMD makes it simple — no sign-up required.
        </p>
        <p>
          Powered by Microsoft&apos;s open-source MarkItDown engine, AllToMD delivers accurate
          conversions that preserve your document structure.
        </p>
      </div>
    </div>
  );
}
