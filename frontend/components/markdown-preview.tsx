interface MarkdownPreviewProps {
  markdown: string;
  title: string;
}

export default function MarkdownPreview({ markdown, title }: MarkdownPreviewProps) {
  return (
    <div className="w-full animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <pre
        className="w-full max-h-96 overflow-auto p-4 rounded-xl bg-gray-900 text-gray-100 text-sm leading-relaxed"
        role="region"
        aria-label={`Markdown preview: ${title}`}
        tabIndex={0}
      >
        <code>{markdown}</code>
      </pre>
    </div>
  );
}
