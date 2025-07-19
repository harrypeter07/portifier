import { create } from "zustand";

export const useLayoutStore = create((set) => ({
	layout: {}, // e.g. { hero: "HeroA", about: "AboutA" }
	content: {}, // e.g. { hero: { title: "..." }, about: { ... } }
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
	reset: () => set({ layout: {}, content: {} }),
}));
