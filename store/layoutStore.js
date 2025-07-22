import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import {
	transformParsedResumeToSchema,
	transformLegacyDataToSchema,
	transformSchemaToComponentProps,
	validatePortfolioData,
} from "@/utils/dataTransformers";

export const useLayoutStore = create(
	persist(
		(set, get) => ({
			// Layout configuration
			layout: {}, // e.g. { hero: "HeroA", about: "AboutA" }

			// Portfolio data in new schema format
			portfolioData: JSON.parse(JSON.stringify(EMPTY_PORTFOLIO)),

			// Legacy content data (for backwards compatibility)
			content: {}, // e.g. { hero: { title: "..." }, about: { ... } }

			// Parsed resume data backup
			parsedData: null,

			// Current template selection
			currentTemplate: null,

			// Portfolio type (developer, designer, marketing, etc.)
			portfolioType: "developer",

			// Actions for layout management
			setLayout: (section, component) =>
				set((state) => ({
					layout: { ...state.layout, [section]: component },
				})),

			// Update portfolio data using new schema
			updatePortfolioData: (sectionPath, value) => {
				set((state) => {
					const newData = { ...state.portfolioData };
					const keys = sectionPath.split(".");
					let current = newData;

					// Navigate to the correct nested object
					for (let i = 0; i < keys.length - 1; i++) {
						if (!current[keys[i]]) current[keys[i]] = {};
						current = current[keys[i]];
					}

					// Set the value
					current[keys[keys.length - 1]] = value;

					return { portfolioData: newData };
				});
			},

			// Set entire portfolio data
			setPortfolioData: (data) => {
				set(() => ({ portfolioData: data }));
			},

			// Legacy content methods (for backwards compatibility)
			setContent: (section, values) =>
				set((state) => ({
					content: {
						...state.content,
						[section]: { ...state.content[section], ...values },
					},
				})),

			// Set entire content object (for parsed resume data)
			setAllContent: (contentData) => {
				// Transform to new schema format
				const transformedData = transformParsedResumeToSchema(
					contentData,
					get().portfolioType
				);
				set(() => ({
					content: contentData, // Keep legacy format
					portfolioData: transformedData, // Set new schema format
				}));
			},

			// Set entire layout object (for templates)
			setAllLayout: (layoutData) =>
				set(() => ({
					layout: layoutData,
				})),

			// Store parsed resume data as backup and transform to new schema
			setParsedData: (data) => {
				const transformedData = transformParsedResumeToSchema(
					data,
					get().portfolioType
				);
				set(() => ({
					parsedData: data,
					portfolioData: transformedData,
				}));
			},

			// Set current template
			setCurrentTemplate: (template) =>
				set(() => ({
					currentTemplate: template,
				})),

			// Set portfolio type
			setPortfolioType: (type) =>
				set(() => ({
					portfolioType: type,
				})),

			// Apply template while preserving content
			applyTemplate: (template) => {
				const state = get();
				set(() => ({
					layout: template.layout,
					currentTemplate: template,
					// Merge template content with existing content, prioritizing existing
					content: {
						...template.content,
						...state.content, // Existing content takes priority
					},
					// Keep existing portfolio data if available
					portfolioData: state.portfolioData.personal.firstName
						? state.portfolioData
						: JSON.parse(JSON.stringify(EMPTY_PORTFOLIO)),
				}));
			},

			// Restore from parsed data if content is empty
			restoreFromParsed: () => {
				const state = get();
				if (state.parsedData && Object.keys(state.content).length === 0) {
					const transformedData = transformParsedResumeToSchema(
						state.parsedData,
						state.portfolioType
					);
					set(() => ({
						content: state.parsedData,
						portfolioData: transformedData,
					}));
				}
			},

			// Get component props for a specific section (backwards compatibility)
			getComponentProps: (section) => {
				const state = get();
				return transformSchemaToComponentProps(state.portfolioData, section);
			},

			// Validate current portfolio data
			validateData: () => {
				const state = get();
				return validatePortfolioData(state.portfolioData);
			},

			// Clear only layout but keep content
			clearLayout: () => set((state) => ({ layout: {} })),

			// Clear only content but keep layout
			clearContent: () =>
				set((state) => ({
					content: {},
					portfolioData: JSON.parse(JSON.stringify(EMPTY_PORTFOLIO)),
				})),

			// Full reset
			reset: () =>
				set({
					layout: {},
					content: {},
					portfolioData: JSON.parse(JSON.stringify(EMPTY_PORTFOLIO)),
					parsedData: null,
					currentTemplate: null,
					portfolioType: "developer",
				}),

			// Soft reset (keep parsed data)
			softReset: () => {
				const state = get();
				const transformedData = state.parsedData
					? transformParsedResumeToSchema(state.parsedData, state.portfolioType)
					: JSON.parse(JSON.stringify(EMPTY_PORTFOLIO));
				set(() => ({
					layout: {},
					content: state.parsedData || {},
					portfolioData: transformedData,
					currentTemplate: null,
				}));
			},
		}),
		{
			name: "portfolio-store", // Storage key
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				layout: state.layout,
				content: state.content,
				portfolioData: state.portfolioData,
				parsedData: state.parsedData,
				currentTemplate: state.currentTemplate,
				portfolioType: state.portfolioType,
			}),
		}
	)
);
