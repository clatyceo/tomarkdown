"use client";

import Link from "next/link";
import { useState } from "react";
import { toolsByCategory } from "@/lib/tools";

const categories = toolsByCategory;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-15 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          ToMarkdown
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {categories.map((cat) => (
            <div key={cat.name} className="relative group">
              <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {cat.name}
              </button>
              <div className="absolute top-full left-0 pt-1 hidden group-hover:block">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-48">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      {tool.displayName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 max-h-[80vh] overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.name} className="border-t border-gray-100">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">{cat.name}</p>
              {cat.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {tool.displayName}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
