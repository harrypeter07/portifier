// Map our portfolio schema to the slice-based data structure the colorfull template expects
import type { SliceData, PageData } from "../lib/data";

export function mapSchemaToSlices(schema: any): SliceData[] {
	const slices: SliceData[] = [];

	// Hero
	slices.push({
		slice_type: "hero",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			first_name: schema?.personal?.firstName || "",
			last_name: schema?.personal?.lastName || "",
			tag_line: schema?.personal?.tagline || schema?.personal?.subtitle || "",
		},
		items: [],
	});

	// Biography / About
	if (schema?.about?.summary || schema?.personal?.location) {
		slices.push({
			slice_type: "biography",
			slice_label: null,
			variation: "default",
			version: "initial",
			primary: {
				heading: "About Me",
				body: [
					{ type: "paragraph", content: { text: schema?.about?.summary || "" } },
					...(schema?.about?.bio ? [{ type: "paragraph", content: { text: schema.about.bio } }] : []),
				],
				button_text: "View My Work",
				button_link: { link_type: "Web", url: "#portfolio" },
				avatar: schema?.personal?.avatar ? { url: schema.personal.avatar, width: 800, height: 800 } : null,
			},
			items: [],
		});
	}

	// Tech list (use skills.technical categories)
	if (Array.isArray(schema?.skills?.technical) && schema.skills.technical.length > 0) {
		slices.push({
			slice_type: "tech_list",
			slice_label: null,
			variation: "default",
			version: "initial",
			primary: { heading: "Technologies I Work With" },
			items: schema.skills.technical.flatMap((cat: any) =>
				(cat?.skills || []).map((s: any) => ({ tech_name: s?.name || "", tech_category: cat?.category || "" }))
			),
		});
	}

    // Education summary (map to text_block)
    if (Array.isArray(schema?.education?.degrees) && schema.education.degrees.length > 0) {
        const first = schema.education.degrees[0];
        const eduText = `${first?.degree || ''} ${first?.field ? 'in ' + first.field : ''} • ${first?.institution || ''}`.trim();
        slices.push({
            slice_type: "text_block",
            slice_label: null,
            variation: "default",
            version: "initial",
            primary: {
                heading: "Education",
                body: [ { type: "paragraph", content: { text: eduText } } ],
            },
            items: [],
        });
    }

    // Experience summary (map to content_index with description)
    if (Array.isArray(schema?.experience?.jobs) && schema.experience.jobs.length > 0) {
        const firstJob = schema.experience.jobs[0];
        const jobLine = `${firstJob?.position || ''} • ${firstJob?.company || ''}`.trim();
        slices.push({
            slice_type: "content_index",
            slice_label: null,
            variation: "default",
            version: "initial",
            primary: {
                heading: "Experience",
                content_type: "Blog",
                view_more_text: "View",
                description: jobLine,
            },
            items: [],
        });
    }

	// Projects index
	if (Array.isArray(schema?.projects?.items) && schema.projects.items.length > 0) {
		slices.push({
			slice_type: "content_index",
			slice_label: null,
			variation: "default",
			version: "initial",
			primary: {
				heading: "Featured Projects",
				content_type: "Project",
				view_more_text: "View Project",
				description: "Here are some of my recent projects that showcase my skills and experience.",
			},
			items: [],
		});
	}

	// Text block as contact note
	slices.push({
		slice_type: "text_block",
		slice_label: null,
		variation: "default",
		version: "initial",
		primary: {
			heading: "Get In Touch",
			body: [
				{ type: "paragraph", content: { text: "I'm always interested in new opportunities and collaborations." } },
			],
		},
		items: [],
	});

	return slices;
}


