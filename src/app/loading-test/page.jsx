"use client";
import LottieLoading from "@/components/LottieLoading";

export default function LoadingTestPage() {
	return (
		<div className="flex justify-center items-center min-h-screen grainy-bg">
			<LottieLoading message="Verifying loader..." size="xlarge" showMessage={true} fullScreen={false} />
		</div>
	);
}



