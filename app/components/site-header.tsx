"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "./language-toggle";

const links = [
  { href: "/programs", zh: "竞赛与项目", en: "Competitions & programs", sections: ["/programs", "/competitions", "/modeling", "/research", "/summer"] },
  { href: "/courses-tests", zh: "课程与考试", en: "Courses & tests", sections: ["/courses-tests", "/courses", "/assessments"] },
  { href: "/destinations", zh: "留学地区", en: "Study destinations", sections: ["/destinations"] },
  { href: "/calendar", zh: "日历", en: "Calendar", sections: ["/calendar", "/competition-calendar", "/course-calendar", "/assessment-calendar"] },
  { href: "/resources", zh: "资料中心", en: "Resources", sections: ["/resources", "/syllabi", "/past-papers", "/archive", "/competition-results", "/course-scores", "/assessment-scores", "/official-sites", "/sources"] },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="site-brand" href="/" onClick={() => setOpen(false)}>
          <span className="lang-zh">国际升学数学资料库</span>
          <span className="lang-en">International Math Library</span>
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
          {links.map(({ href, zh, en, sections }) => (
            <Link
              key={href}
              className={sections.some((section) => pathname === section || pathname.startsWith(`${section}/`)) ? "active" : ""}
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
