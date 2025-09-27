import HeroA from "@/components/Hero/HeroA";
import AboutA from "@/components/About/AboutA";
import ExperienceA from "@/components/Experience/ExperienceA";
import EducationA from "@/components/Education/EducationA";
import SkillsA from "@/components/Skills/SkillsA";
import AchievementsA from "@/components/Achievements/AchievementsA";
import ShowcaseA from "@/components/Showcase/ShowcaseA";
import ContactFormA from "@/components/Contact/ContactFormA";

export default function Home() {
	return (
		<div className="min-h-screen bg-white dark:bg-black">
			<HeroA />
			<AboutA />
			<ExperienceA />
			<EducationA />
			<SkillsA />
			<AchievementsA />
			<ShowcaseA />
			<ContactFormA />
		</div>
	);
}
