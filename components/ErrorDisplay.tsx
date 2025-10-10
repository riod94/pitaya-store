import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
	errors: Record<string, string>;
	onDismiss?: (key: string) => void;
}

export function ErrorDisplay({ errors, onDismiss }: ErrorDisplayProps) {
	if (Object.keys(errors).length === 0) {
		return null;
	}

	return (
		<div className="space-y-2 mb-4">
			{Object.entries(errors).map(([key, message]) => (
				<Alert key={key} variant="destructive" className="relative">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>
						{key === 'general' ? 'Error' : 'Validasi Error'}
					</AlertTitle>
					<AlertDescription>{message}</AlertDescription>
					{onDismiss && (
						<Button
							variant="ghost"
							size="sm"
							className="absolute top-2 right-2 h-6 w-6 p-0"
							onClick={() => onDismiss(key)}
						>
							<X className="h-3 w-3" />
						</Button>
					)}
				</Alert>
			))}
		</div>
	);
}
