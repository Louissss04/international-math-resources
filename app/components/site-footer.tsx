import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <strong>MathPath</strong>
        <nav aria-label="Footer">
          <Link href="/sources"><span className="lang-zh">来源</span><span className="lang-en">Sources</span></Link>
          <Link href="/universities"><span className="lang-zh">院校政策</span><span className="lang-en">University policies</span></Link>
          <Link href="/compare"><span className="lang-zh">项目比较</span><span className="lang-en">Compare</span></Link>
        </nav>
        <p>
          <span className="lang-zh">日期、资格、费用和评奖以所列官方来源为准。</span>
          <span className="lang-en">Dates, eligibility, fees and awards are tied to the listed official sources.</span>
        </p>
      </div>
    </footer>
  );
}

