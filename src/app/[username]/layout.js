import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  try {
    const { username } = await params;
    
    // Fetch portfolio data to get person's name
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/portfolio/${username}`, {
      cache: 'no-store' // Ensure fresh data for metadata
    });
    
    if (!res.ok) {
      return {
        title: `Portume | ${username}`,
        description: `Portfolio of ${username}`,
        icons: { icon: "/favicon.svg" },
      };
    }
    
    const data = await res.json();
    if (data.success && data.portfolio?.portfolioData?.personal) {
      const personal = data.portfolio.portfolioData.personal;
      const fullName = personal.firstName && personal.lastName 
        ? `${personal.firstName} ${personal.lastName}` 
        : personal.title || username;
      
      return {
        title: `Portume | ${fullName}`,
        description: personal.bio || personal.summary || `Portfolio of ${fullName}`,
        icons: { icon: "/favicon.svg" },
        openGraph: {
          title: `Portume | ${fullName}`,
          description: personal.bio || personal.summary || `Portfolio of ${fullName}`,
          type: "profile",
          url: `/${username}`,
          siteName: "Portume",
        },
        twitter: {
          card: "summary",
          title: `Portume | ${fullName}`,
          description: personal.bio || personal.summary || `Portfolio of ${fullName}`,
        },
      };
    }
    
    return {
      title: `Portume | ${username}`,
      description: `Portfolio of ${username}`,
      icons: { icon: "/favicon.svg" },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `Portume | ${username}`,
      description: `Portfolio of ${username}`,
      icons: { icon: "/favicon.svg" },
    };
  }
}

export default function PortfolioLayout({ children }) {
  return (
    <div className="portfolio-page">
      {children}
    </div>
  );
} 