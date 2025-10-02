"use client";
import LottieLoading from "@/components/LottieLoading";

export default function LoadingTestPage() {
	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
			<LottieLoading message="Verifying loader..." size="xlarge" showMessage={true} fullScreen={false} />
		</div>
	);
}



