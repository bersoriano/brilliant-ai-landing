import { notFound } from "next/navigation";
import { buildMetadata, buildPostMetadata } from "@/lib/seo";
import { routeInfo, staticPaths, type RouteProps } from "@/lib/routes.server";
import { getPost } from "@/lib/posts.server";
import Home from "@/views/page";
import Finance from "@/views/finance-automation/page";
import Healthcare from "@/views/healthcare-automation/page";
import Services from "@/views/services/page";
import Workflows from "@/views/workflows/page";
import Agents from "@/views/agents/page";
import Crm from "@/views/custom-crm/page";
import Erp from "@/views/custom-erp/page";
import Software from "@/views/custom-software/page";
import Security from "@/views/security/page";
import About from "@/views/about/page";
import Privacy from "@/views/privacy/page";
import Blog from "@/views/blog/page";
import BlogPost from "@/views/blog/[slug]/page";

export const dynamicParams = false;
export async function generateStaticParams() {
  return (await staticPaths()).map(path => ({ path: path === "/" ? [] : path.slice(1).split("/") }));
}
export async function generateMetadata({ params }: RouteProps) {
  const { locale, path, clean } = routeInfo(await params);
  const slug = clean.match(/^\/blog\/([^/]+)$/)?.[1];
  if (slug) {
    const post = await getPost(slug, locale);
    if (!post) notFound();
    return buildPostMetadata(post);
  }
  return buildMetadata(locale, path);
}
export default async function Page({ params }: RouteProps) {
  const { locale, clean } = routeInfo(await params);
  switch (clean) {
    case "/": return <Home locale={locale} />;
    case "/finance-automation": return <Finance />;
    case "/healthcare-automation": return <Healthcare />;
    case "/services": return <Services />;
    case "/workflows": return <Workflows />;
    case "/agents": return <Agents />;
    case "/custom-crm": return <Crm />;
    case "/custom-erp": return <Erp />;
    case "/custom-software": return <Software />;
    case "/security": return <Security />;
    case "/about": return <About />;
    case "/privacy": return <Privacy />;
    case "/blog": return <Blog locale={locale} />;
  }
  const slug = clean.match(/^\/blog\/([^/]+)$/)?.[1];
  if (slug) return <BlogPost slug={slug} locale={locale} />;
  notFound();
}
