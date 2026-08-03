"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "./language-toggle";

const links = [
  ["/catalog", "项目库", "Directory"],
  ["/competitions", "竞赛", "Competitions"],
  ["/modeling", "建模", "Modeling"],
  ["/research", "科研", "Research"],
  ["/summer", "夏校", "Summer"],
  ["/assessments", "考试", "Tests"],
  ["/archive", "分数档案", "Archive"],
  ["/calendar", "日历", "Calendar"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="site-brand" href="/" onClick={() => setOpen(false)}>
          MathPath
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="lang-zh">目录</span>
          <span className="lang-en">Menu</span>
        </button>
        <nav id="main-navigation" className={open ? "main-nav open" : "main-nav"} aria-label="Primary">
          {links.map(([href, zh, en]) => (
            <Link
              key={href}
              className={pathname === href || pathname.startsWith(`${href}/`) ? "active" : ""}
              href={href}
              onClick={() => setOpen(false)}
            >
              <span className="lang-zh">{zh}</span>
              <span className="lang-en">{en}</span>
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageToggle />
          <Link className="planner-link" href="/planner">
            <span className="lang-zh">规划器</span>
            <span className="lang-en">Planner</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

