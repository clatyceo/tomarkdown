"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toolsByCategory } from "@/lib/tools";

const categoryKeys: Record<string, string> = {
  Documents: "documents",
  Data: "data",
  Media: "media",
};

export default function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => {
      if (!prev) {
        setTimeout(() => {
          menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
        }, 0);
      } else {
        menuButtonRef.current?.focus();
      }
      return !prev;
    });
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openDropdown) {
          setOpenDropdown(null);
        } else if (mobileOpen) {
          setMobileOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [openDropdown, mobileOpen]);

  const handleDropdownKeyDown = useCallback(
    (e: React.KeyboardEvent, catName: string, itemCount: number) => {
      const panel = dropdownRefs.current[catName];
      if (!panel) return;

      const items = Array.from(panel.querySelectorAll<HTMLAnchorElement>("a"));
      const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (openDropdown !== catName) {
          setOpenDropdown(catName);
          setTimeout(() => {
            const el = dropdownRefs.current[catName];
            el?.querySelector<HTMLAnchorElement>("a")?.focus();
          }, 0);
        } else {
          const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[next]?.focus();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex > 0) {
          items[currentIndex - 1]?.focus();
        } else {
          // wrap to last item
          items[items.length - 1]?.focus();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpenDropdown(null);
        // Return focus to the trigger button
        const trigger = panel.closest(".relative")?.querySelector<HTMLButtonElement>("button");
        trigger?.focus();
      }
    },
    [openDropdown]
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-15 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900" aria-label="ToMarkdown Home">
          ToMarkdown
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {toolsByCategory.map((cat) => (
            <div key={cat.name} className="relative group">
              <button
                aria-haspopup="true"
                aria-expanded={openDropdown === cat.name}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setOpenDropdown(openDropdown === cat.name ? null : cat.name)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpenDropdown(cat.name);
                    setTimeout(() => {
                      dropdownRefs.current[cat.name]?.querySelector<HTMLAnchorElement>("a")?.focus();
                    }, 0);
                  }
                  if (e.key === "Escape") {
                    setOpenDropdown(null);
                  }
                }}
              >
                {t(categoryKeys[cat.name] || cat.name.toLowerCase())}
              </button>
              <div
                className={`absolute top-full left-0 pt-1 ${openDropdown === cat.name ? "block" : "hidden"} group-hover:block`}
                ref={(el) => { dropdownRefs.current[cat.name] = el; }}
                onKeyDown={(e) => handleDropdownKeyDown(e, cat.name, cat.tools.length)}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-48" role="menu">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      role="menuitem"
                      onClick={() => setOpenDropdown(null)}
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
          ref={menuButtonRef}
          className="md:hidden p-2 text-gray-600"
          onClick={toggleMobileMenu}
          aria-label={tCommon("toggleMenu")}
          aria-expanded={mobileOpen}
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
        <div ref={menuRef} className="md:hidden bg-white border-b border-gray-200 max-h-[80vh] overflow-y-auto">
          {toolsByCategory.map((cat) => (
            <div key={cat.name} className="border-t border-gray-100">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                {t(categoryKeys[cat.name] || cat.name.toLowerCase())}
              </p>
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
