import Link from "next/link";

export default function NotFound() {
  return <main className="page-header page-container"><h1>404</h1><p><span className="lang-zh">没有找到这个页面。</span><span className="lang-en">Page not found.</span></p><Link className="primary-button" href="/catalog"><span className="lang-zh">返回项目库</span><span className="lang-en">Return to directory</span></Link></main>;
}
