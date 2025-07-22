export default function ContactFormA({ email = "", phone = "", location = "", linkedin = "" }) {
	return (
		<section className="py-12 px-6">
			<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Contact Information</h2>
			<div className="max-w-2xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{email && (
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-300 text-sm">✉</span>
							</div>
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
								<a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800">{email}</a>
							</div>
						</div>
					)}
					
					{phone && (
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
								<span className="text-green-600 dark:text-green-300 text-sm">📞</span>
							</div>
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
								<a href={`tel:${phone}`} className="text-gray-900 dark:text-white">{phone}</a>
							</div>
						</div>
					)}
					
					{location && (
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
								<span className="text-red-600 dark:text-red-300 text-sm">📍</span>
							</div>
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
								<p className="text-gray-900 dark:text-white">{location}</p>
							</div>
						</div>
					)}
					
					{linkedin && (
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<span className="text-blue-600 dark:text-blue-300 text-sm">💼</span>
							</div>
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400">LinkedIn</p>
								<a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
									{linkedin.replace('https://', '').replace('http://', '')}
								</a>
							</div>
						</div>
					)}
				</div>
				
				{(!email && !phone && !location && !linkedin) && (
					<div className="text-center py-8">
						<p className="text-gray-500">No contact information available.</p>
					</div>
				)}
			</div>
		</section>
	);
}
