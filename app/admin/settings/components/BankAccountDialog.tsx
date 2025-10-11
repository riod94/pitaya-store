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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BankAccountDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	account?: {
		id: number;
		bankName: string;
		accountNumber: string;
		accountHolderName: string;
		branch: string | null;
		swiftCode: string | null;
		logo: string | null;
		isActive: boolean;
		sortOrder: number;
	} | null;
	onSuccess: () => void;
}

export function BankAccountDialog({ open, onOpenChange, account, onSuccess }: BankAccountDialogProps) {
	const [loading, setLoading] = useState(false);
	const [bankName, setBankName] = useState("");
	const [accountNumber, setAccountNumber] = useState("");
	const [accountHolderName, setAccountHolderName] = useState("");
	const [branch, setBranch] = useState("");
	const [swiftCode, setSwiftCode] = useState("");

	useEffect(() => {
		if (account) {
			setBankName(account.bankName);
			setAccountNumber(account.accountNumber);
			setAccountHolderName(account.accountHolderName);
			setBranch(account.branch || "");
			setSwiftCode(account.swiftCode || "");
		} else {
			setBankName("");
			setAccountNumber("");
			setAccountHolderName("");
			setBranch("");
			setSwiftCode("");
		}
	}, [account, open]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!bankName.trim() || !accountNumber.trim() || !accountHolderName.trim()) {
			toast.error("Bank name, account number, and account holder name are required");
			return;
		}

		setLoading(true);
		try {
			const payload = {
				bankName: bankName.trim(),
				accountNumber: accountNumber.trim(),
				accountHolderName: accountHolderName.trim(),
				branch: branch.trim() || null,
				swiftCode: swiftCode.trim() || null,
				isActive: true,
				sortOrder: 0,
			};

			const url = account 
				? `/api/admin/bank-accounts/${account.id}`
				: `/api/admin/bank-accounts`;
			
			const method = account ? "PUT" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData?.error || "Failed to save bank account");
			}

			toast.success(account ? "Bank account updated successfully" : "Bank account added successfully");
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
						<DialogTitle>{account ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle>
						<DialogDescription>
							{account ? "Update bank account details" : "Add a new bank account for manual transfer payments"}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="bank-name">Bank Name *</Label>
							<Input
								id="bank-name"
								placeholder="e.g., BCA, Mandiri, BNI"
								value={bankName}
								onChange={(e) => setBankName(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="account-number">Account Number *</Label>
							<Input
								id="account-number"
								placeholder="e.g., 1234567890"
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
						<div className="space-y-2">
							<Label htmlFor="branch">Branch (Optional)</Label>
							<Input
								id="branch"
								placeholder="e.g., Jakarta Pusat"
								value={branch}
								onChange={(e) => setBranch(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="swift-code">SWIFT Code (Optional)</Label>
							<Input
								id="swift-code"
								placeholder="For international transfers"
								value={swiftCode}
								onChange={(e) => setSwiftCode(e.target.value)}
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
