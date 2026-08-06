import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <strong><span className="lang-zh">国际升学数学资料库</span><span className="lang-en">International Math Library</span></strong>
        <nav aria-label="Footer">
          <Link href="/sources"><span className="lang-zh">来源</span><span className="lang-en">Sources</span></Link>
          <Link href="/official-sites"><span className="lang-zh">官方入口</span><span className="lang-en">Official sites</span></Link>
          <Link href="/resources#copyright"><span className="lang-zh">版权与使用</span><span className="lang-en">Copyright & use</span></Link>
        </nav>
        <p>
          <span className="lang-zh">本站只索引公开来源，不托管试题文件；版权归原权利人。报名前请核对官网。</span>
          <span className="lang-en">Public-source links only; test files are not hosted here and rights remain with their owners. Check the official site before registering.</span>
        </p>
      </div>
    </footer>
  );
}
