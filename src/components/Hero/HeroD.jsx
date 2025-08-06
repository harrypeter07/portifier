import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import { motion } from "framer-motion";

export default function HeroD({ data = EMPTY_PORTFOLIO, ...personalData }) {
	// Handle both data structures: new schema format and direct personal data
	const personal = data?.personal || personalData || {};
	
	// Handle legacy structure where data might be direct personal data
	const actualPersonal = personal.firstName ? personal : data;

	const fullName =
		actualPersonal.firstName || actualPersonal.lastName
			? `${actualPersonal.firstName || ""} ${actualPersonal.lastName || ""}`.trim()
			: actualPersonal.title || "Your Name";
	const subtitle = actualPersonal.subtitle || "";
	const tagline = actualPersonal.tagline;

	return (
		<section className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
				<motion.div
					className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.6, 0.3],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.6, 0.3, 0.6],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 2,
					}}
				/>
			</div>
			
			<div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
				{/* Main Content */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{/* Name with animated gradient */}
					<motion.h1 
						className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
						animate={{
							backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: "linear",
						}}
						style={{
							backgroundSize: "200% 200%",
						}}
					>
						{fullName}
					</motion.h1>
					
					{/* Subtitle */}
					{subtitle && (
						<motion.h2 
							className="text-2xl md:text-3xl text-gray-300 mb-8 font-light"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.8 }}
						>
							{subtitle}
						</motion.h2>
					)}
					
					{/* Tagline */}
					{tagline && (
						<motion.p 
							className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.8 }}
						>
							{tagline}
						</motion.p>
					)}
					
					{/* Animated CTA Button */}
					<motion.div
						className="mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9, duration: 0.8 }}
					>
						<motion.button
							className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							View My Work
						</motion.button>
					</motion.div>
				</motion.div>
				
				{/* Floating Elements */}
				<motion.div
					className="absolute top-1/4 right-1/4 text-4xl opacity-20"
					animate={{ rotate: 360 }}
					transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
				>
					⚡
				</motion.div>
				<motion.div
					className="absolute bottom-1/4 left-1/4 text-4xl opacity-20"
					animate={{ rotate: -360 }}
					transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
				>
					🚀
				</motion.div>
			</div>
		</section>
	);
} 