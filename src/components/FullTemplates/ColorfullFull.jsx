"use client";

import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import CustomSliceZone from "./colorfull/src/components/CustomSliceZone";
import HeaderClient from "./colorfull/src/components/HeaderClient";
import FooterClient from "./colorfull/src/components/FooterClient";
import { mapSchemaToSlices } from "./colorfull/src/lib/schemaMapper";
import { setRuntimeData } from "./colorfull/src/lib/runtimeStore";
// Scope colorfull styles when this template is used
import "./colorfull/src/app/globals.css";
import { Urbanist as UrbanistFont } from "next/font/google";

const urbanist = UrbanistFont({ weight: "300", subsets: ["latin"] });

export default function ColorfullFull({ data = EMPTY_PORTFOLIO }) {
	console.log("🎨 [COLORFULL] received data:", data?.personal, data?.theme);
	const slices = mapSchemaToSlices(data);
    console.log("🎨 [COLORFULL] mapped slices count:", slices.length);
    const noisePath = "/noisetexture.jpg";
    console.log("🎨 [COLORFULL] background noise path:", noisePath);
    console.log("🎨 [COLORFULL] gradient class present:", typeof window !== 'undefined' ? !!document.querySelector('.background-gradient') : 'ssr');
	// Provide runtime data objects expected by internal components
	setRuntimeData({
		homepage: { meta_title: '', meta_description: '', slices },
		settings: {
			name: `${data?.personal?.firstName || ''} ${data?.personal?.lastName || ''}`.trim() || 'Portfolio',
			nav_item: [
				{ link: { link_type: 'Web', url: '#about' }, label: 'About' },
				{ link: { link_type: 'Web', url: '#skills' }, label: 'Skills' },
				{ link: { link_type: 'Web', url: '#portfolio' }, label: 'Projects' },
				{ link: { link_type: 'Web', url: '#contact' }, label: 'Contact' },
			],
			cta_link: { link_type: 'Web', url: '#contact' },
			cta_label: 'Contact',
			github_link: { link_type: 'Web', url: data?.personal?.social?.github || '#' },
			twitter_link: { link_type: 'Web', url: data?.personal?.social?.twitter || '#' },
			linkdin_link: { link_type: 'Web', url: data?.personal?.social?.linkedin || '#' },
			intagram_link: { link_type: 'Web', url: data?.personal?.social?.instagram || '#' },
		},
	});

	// Recreate their layout wrappers so colors/contrast match the original
    return (
        <div className={`relative min-h-screen bg-slate-900 text-slate-100 ${urbanist.className}`}>
			{/* Template background */}
            <div className="absolute inset-0 max-h-screen -z-50 background-gradient" />
            <div className="absolute pointer-events-none inset-0 -z-40 h-full opacity-20 mix-blend-soft-light" style={{ backgroundImage: "url('/noisetexture.jpg')", backgroundRepeat: 'repeat' }} />
			{/* Template header (client) */}
			<HeaderClient />
			{/* Main content */}
			<CustomSliceZone slices={slices} />
			{/* Template footer (client) */}
			<FooterClient />
		</div>
	);
}


