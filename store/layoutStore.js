import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useLayoutStore = create(
	persist(
		(set, get) => ({
			// Layout configuration
			layout: {}, // e.g. { hero: "HeroA", about: "AboutA" }
			
			// Content data
			content: {}, // e.g. { hero: { title: "..." }, about: { ... } }
			
			// Parsed resume data backup
			parsedData: null,
			
			// Current template selection
			currentTemplate: null,
			
			// Actions
			setLayout: (section, component) =>
				set((state) => ({
					layout: { ...state.layout, [section]: component },
				})),
				
			setContent: (section, values) =>
				set((state) => ({
					content: {
						...state.content,
						[section]: { ...state.content[section], ...values },
					},
				})),
				
			// Set entire content object (for parsed resume data)
			setAllContent: (contentData) =>
				set(() => ({
					content: contentData,
				})),
				
			// Set entire layout object (for templates)
			setAllLayout: (layoutData) =>
				set(() => ({
					layout: layoutData,
				})),
				
			// Store parsed resume data as backup
			setParsedData: (data) =>
				set(() => ({
					parsedData: data,
				})),
				
			// Set current template
			setCurrentTemplate: (template) =>
				set(() => ({
					currentTemplate: template,
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
				}));
			},
			
			// Restore from parsed data if content is empty
			restoreFromParsed: () => {
				const state = get();
				if (state.parsedData && Object.keys(state.content).length === 0) {
					set(() => ({
						content: state.parsedData,
					}));
				}
			},
			
			// Clear only layout but keep content
			clearLayout: () => set((state) => ({ layout: {} })),
			
			// Clear only content but keep layout
			clearContent: () => set((state) => ({ content: {} })),
			
			// Full reset
			reset: () => set({ layout: {}, content: {}, parsedData: null, currentTemplate: null }),
			
			// Soft reset (keep parsed data)
			softReset: () => set((state) => ({ layout: {}, content: state.parsedData || {}, currentTemplate: null })),
		}),
		{
			name: "portfolio-store", // Storage key
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				layout: state.layout,
				content: state.content,
				parsedData: state.parsedData,
				currentTemplate: state.currentTemplate,
			}),
		}
	)
);
