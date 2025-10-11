"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EwalletAccountDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	account?: {
		id: number;
		provider: string;
		accountNumber: string;
		accountHolderName: string;
		logo: string | null;
		qrCode: string | null;
		isActive: boolean;
		sortOrder: number;
	} | null;
	onSuccess: () => void;
}

const EWALLET_PROVIDERS = [
	{ value: "GoPay", label: "GoPay" },
	{ value: "OVO", label: "OVO" },
	{ value: "DANA", label: "DANA" },
	{ value: "LinkAja", label: "LinkAja" },
	{ value: "ShopeePay", label: "ShopeePay" },
];

export function EwalletAccountDialog({ open, onOpenChange, account, onSuccess }: EwalletAccountDialogProps) {
	const [loading, setLoading] = useState(false);
	const [provider, setProvider] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [accountHolderName, setAccountHolderName] = useState("");

	useEffect(() => {
		if (account) {
			setProvider(account.provider);
			setAccountNumber(account.accountNumber);
			setAccountHolderName(account.accountHolderName);
		} else {
			setProvider("");
			setAccountNumber("");
			setAccountHolderName("");
		}
	}, [account, open]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!provider || !accountNumber.trim() || !accountHolderName.trim()) {
			toast.error("Provider, account number, and account holder name are required");
			return;
		}

		setLoading(true);
		try {
			const payload = {
				provider,
				accountNumber: accountNumber.trim(),
				accountHolderName: accountHolderName.trim(),
				isActive: true,
				sortOrder: 0,
			};

			const url = account 
				? `/api/admin/ewallet-accounts/${account.id}`
				: `/api/admin/ewallet-accounts`;
			
			const method = account ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData?.error || "Failed to save e-wallet account");
			}

			toast.success(account ? "E-wallet account updated successfully" : "E-wallet account added successfully");
			onOpenChange(false);
			// Call onSuccess after dialog closes to ensure proper state update
			setTimeout(() => {
				onSuccess();
			}, 100);
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{account ? "Edit E-Wallet Account" : "Add E-Wallet Account"}</DialogTitle>
						<DialogDescription>
							{account ? "Update e-wallet account details" : "Add a new e-wallet account for manual payments"}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="provider">E-Wallet Provider *</Label>
							<Select value={provider} onValueChange={setProvider} required>
								<SelectTrigger id="provider">
									<SelectValue placeholder="Select provider" />
								</SelectTrigger>
								<SelectContent>
									{EWALLET_PROVIDERS.map((p) => (
										<SelectItem key={p.value} value={p.value}>
											{p.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="account-number">Phone Number / Account ID *</Label>
							<Input
								id="account-number"
								placeholder="e.g., 081234567890"
								value={accountNumber}
								onChange={(e) => setAccountNumber(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="account-holder">Account Holder Name *</Label>
							<Input
								id="account-holder"
								placeholder="e.g., John Doe"
								value={accountHolderName}
								onChange={(e) => setAccountHolderName(e.target.value)}
								required
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{loading ? "Saving..." : account ? "Update" : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
