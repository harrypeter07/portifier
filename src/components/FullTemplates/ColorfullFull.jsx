"use client";

import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import CustomSliceZone from "./colorfull/src/components/CustomSliceZone";
import { mapSchemaToSlices } from "./colorfull/src/lib/schemaMapper";
import { setRuntimeData } from "./colorfull/src/lib/runtimeStore";
// Scope colorfull styles when this template is used
import "./colorfull/src/app/globals.css";

export default function ColorfullFull({ data = EMPTY_PORTFOLIO }) {
	const slices = mapSchemaToSlices(data);
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
	return <CustomSliceZone slices={slices} />;
}


