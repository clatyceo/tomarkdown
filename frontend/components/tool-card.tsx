import { Link } from "@/i18n/navigation";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export default function ToolCard({ title, description, href, icon, color }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
        style={{ backgroundColor: color + "15", color }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}
