import { motion } from "framer-motion";
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function YourTemplateName({ data = EMPTY_PORTFOLIO }) {
	// Extract data from props
	const personal = data?.personal || {};
	const about = data?.about || {};
	const experience = data?.experience || {};
	const education = data?.education || {};
	const skills = data?.skills || {};
	const projects = data?.projects || {};
	const achievements = data?.achievements || {};
	const contact = data?.contact || {};

	// Helper functions
	const fullName = personal.firstName && personal.lastName
		? `${personal.firstName} ${personal.lastName}`
		: personal.title || "Your Name";
	
	const email = personal.email || contact.email || "";
	const phone = personal.phone || contact.phone || "";
	const location = personal.location?.city && personal.location?.state
		? `${personal.location.city}, ${personal.location.state}`
		: contact.location || "";

	return (
		<div className="min-h-screen text-gray-900 bg-white">
			{/* Your portfolio template content goes here */}
			<div className="container px-4 py-8 mx-auto">
				<h1 className="mb-4 text-4xl font-bold">{fullName}</h1>
				<p className="mb-8 text-xl text-gray-600">{personal.subtitle}</p>
				
				{/* Add your portfolio sections here */}
				{about.summary && (
					<section className="mb-8">
						<h2 className="mb-4 text-2xl font-semibold">About</h2>
						<p className="text-gray-700">{about.summary}</p>
					</section>
				)}
				
				{/* Experience */}
				{experience.jobs && experience.jobs.length > 0 && (
					<section className="mb-8">
						<h2 className="mb-4 text-2xl font-semibold">Experience</h2>
						{experience.jobs.map((job, index) => (
							<div key={index} className="mb-4">
								<h3 className="text-lg font-semibold">{job.title}</h3>
								<p className="text-gray-600">{job.company} • {job.duration}</p>
								<p className="text-gray-700">{job.description}</p>
							</div>
						))}
					</section>
				)}
				
				{/* Skills */}
				{skills.technical && skills.technical.length > 0 && (
					<section className="mb-8">
						<h2 className="mb-4 text-2xl font-semibold">Skills</h2>
						<div className="flex flex-wrap gap-2">
							{skills.technical.map((skill, index) => (
								<span key={index} className="px-3 py-1 text-blue-800 bg-blue-100 rounded-full">
									{skill}
								</span>
							))}
						</div>
					</section>
				)}
				
				{/* Contact */}
				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">Contact</h2>
					<div className="space-y-2">
						{email && <p>Email: {email}</p>}
						{phone && <p>Phone: {phone}</p>}
						{location && <p>Location: {location}</p>}
					</div>
				</section>
			</div>
		</div>
	);
}
