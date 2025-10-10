import { Skeleton } from "@/components/ui/skeleton";

export function ProductFormSkeleton() {
	return (
		<div className="container fluid rounded-lg space-y-6">
			{/* Header */}
			<div className="flex gap-4">
				<Skeleton className="h-7 w-7" />
				<Skeleton className="h-8 w-32" />
			</div>

			{/* Basic Information */}
			<section className="bg-white p-6 rounded-lg shadow space-y-4">
				<Skeleton className="h-6 w-40" />
				<div className="flex flex-col md:flex-row gap-6">
					<Skeleton className="w-48 h-48" />
					<div className="flex-1 space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			</section>

			{/* Sales Information */}
			<section className="bg-white p-6 rounded-lg shadow space-y-4">
				<Skeleton className="h-6 w-48" />
				<div className="space-y-4">
					<Skeleton className="h-10 w-32" />
					<div className="grid grid-cols-2 gap-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			</section>

			{/* Shipping Information */}
			<section className="bg-white p-6 rounded-lg shadow space-y-4">
				<Skeleton className="h-6 w-52" />
				<div className="space-y-4">
					<Skeleton className="h-10 w-full" />
					<div className="flex gap-2">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
					</div>
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-6 w-40" />
				</div>
			</section>

			{/* Status */}
			<section className="bg-white p-6 rounded-lg shadow space-y-4">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-6 w-20" />
			</section>

			{/* Buttons */}
			<div className="flex justify-end space-x-4">
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-20" />
			</div>
		</div>
	);
}
