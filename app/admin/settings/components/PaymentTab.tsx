"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
	Save,
	Plus,
	Pencil,
	Trash2,
	CreditCard,
	Wallet,
	Banknote,
	Truck,
	Loader2,
	QrCode,
} from "lucide-react";
import { BankAccountDialog } from "./BankAccountDialog";
import { EwalletAccountDialog } from "./EwalletAccountDialog";
import { QRISDialog } from "./QRISDialog";
import { toast } from "sonner";
import Image from "next/image";

interface PaymentTabProps {
	settings: any;
	togglePaymentMethod: (code: string) => void;
	handleSaveChanges: () => void;
	loading: boolean;
}

export function PaymentTab({
	settings,
	togglePaymentMethod,
	handleSaveChanges,
	loading,
}: PaymentTabProps) {
	const [bankAccounts, setBankAccounts] = useState<any[]>([]);
	const [ewalletAccounts, setEwalletAccounts] = useState<any[]>([]);

	const [bankDialogOpen, setBankDialogOpen] = useState(false);
	const [ewalletDialogOpen, setEwalletDialogOpen] = useState(false);
	const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);
	const [selectedEwalletAccount, setSelectedEwalletAccount] =
		useState<any>(null);

	const [qrisDialogOpen, setQrisDialogOpen] = useState(false);
	const [selectedQrisSetting, setSelectedQrisSetting] = useState<any>(null);
	const [qrisSettings, setQrisSettings] = useState<any[]>([]);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<{
		type: "bank" | "ewallet";
		id: number;
	} | null>(null);
	const [deleting, setDeleting] = useState(false);

	// Calculate payment method states early
	const paymentMethodsArray = settings.paymentMethods || [];
	const bankTransferMethod = paymentMethodsArray.find(
		(pm: any) => pm.code === "bank_transfer"
	);
	const ewalletMethod = paymentMethodsArray.find(
		(pm: any) => pm.code === "ewallet"
	);
	const codMethod = paymentMethodsArray.find((pm: any) => pm.code === "cod");

	const qrisMethod = paymentMethodsArray.find((pm: any) => pm.code === "qris");

	const isBankTransferActive = bankTransferMethod?.isActive || false;
	const isEwalletActive = ewalletMethod?.isActive || false;
	const isCodActive = codMethod?.isActive || false;
	const isQrisActive = qrisMethod?.isActive || false;

	// Load bank accounts and e-wallet accounts on mount
	useEffect(() => {
		console.log("🔄 Initial load of accounts...");
		loadBankAccounts();
		loadEwalletAccounts();
		loadQrisSettings();
	}, []);

	// Reload when QRIS is activated
	useEffect(() => {
		if (isQrisActive) {
			console.log("✅ QRIS is active, ensuring settings are loaded...");
			loadQrisSettings();
		}
	}, [isQrisActive]);

	const loadBankAccounts = async () => {
		try {
			console.log("🔄 Loading bank accounts...");
			const res = await fetch("/api/admin/bank-accounts");
			console.log("📡 Response status:", res.status, res.ok);

			if (res.ok) {
				const data = await res.json();
				console.log("✅ Bank accounts loaded:", data);
				console.log("📊 Is array?:", Array.isArray(data));
				console.log("📏 Array length:", data?.length);
				console.log("🔍 First account:", data?.[0]);

				// API returns array directly, not wrapped in { data: [...] }
				const accounts = Array.isArray(data) ? data : [];
				console.log("🏦 Setting bank accounts to state:", accounts);
				setBankAccounts(accounts);

				// Verify state update immediately
				console.log("⏱️ State should update now...");
			} else {
				console.error(
					"❌ Failed to load bank accounts:",
					res.status,
					res.statusText
				);
			}
		} catch (error) {
			console.error("💥 Error loading bank accounts:", error);
		}
	};

	const loadEwalletAccounts = async () => {
		try {
			const res = await fetch("/api/admin/ewallet-accounts");
			if (res.ok) {
				const data = await res.json();
				// API returns array directly, not wrapped in { data: [...] }
				const accounts = Array.isArray(data) ? data : [];
				setEwalletAccounts(accounts);
			}
		} catch (error) {
			console.error("Error loading e-wallet accounts:", error);
		}
	};

	const loadQrisSettings = async () => {
		try {
			console.log("🔄 Loading QRIS settings...");
			const res = await fetch("/api/admin/qris-settings");
			console.log("📡 Response status:", res.status, res.ok);

			if (res.ok) {
				const data = await res.json();
				console.log("✅ QRIS settings loaded:", data);
				setQrisSettings(Array.isArray(data) ? [data] : data ? [data] : []);
			} else {
				console.error(
					"❌ Failed to load QRIS settings:",
					res.status,
					res.statusText
				);
			}
		} catch (error) {
			console.error("💥 Error loading QRIS settings:", error);
		}
	};

	const handleAddBankAccount = () => {
		setSelectedBankAccount(null);
		setBankDialogOpen(true);
	};

	const handleEditBankAccount = (account: any) => {
		setSelectedBankAccount(account);
		setBankDialogOpen(true);
	};

	const handleAddEwalletAccount = () => {
		setSelectedEwalletAccount(null);
		setEwalletDialogOpen(true);
	};

	const handleEditEwalletAccount = (account: any) => {
		setSelectedEwalletAccount(account);
		setEwalletDialogOpen(true);
	};

	const handleAddQrisSetting = () => {
		setSelectedQrisSetting(null);
		setQrisDialogOpen(true);
	};

	const handleEditQrisSetting = (setting: any) => {
		setSelectedQrisSetting(setting);
		setQrisDialogOpen(true);
	};

	const confirmDelete = (type: "bank" | "ewallet", id: number) => {
		setItemToDelete({ type, id });
		setDeleteDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!itemToDelete) return;

		setDeleting(true);
		try {
			const url =
				itemToDelete.type === "bank"
					? `/api/admin/bank-accounts/${itemToDelete.id}`
					: `/api/admin/ewallet-accounts/${itemToDelete.id}`;

			const res = await fetch(url, { method: "DELETE" });

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				throw new Error(errData?.error || "Failed to delete account");
			}

			toast.success(
				`${
					itemToDelete.type === "bank" ? "Bank" : "E-wallet"
				} account deleted successfully`
			);

			if (itemToDelete.type === "bank") {
				loadBankAccounts();
			} else {
				loadEwalletAccounts();
			}
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "An error occurred");
		} finally {
			setDeleting(false);
			setDeleteDialogOpen(false);
			setItemToDelete(null);
		}
	};

	// Debug logging
	console.log("🎨 PaymentTab Render:", {
		paymentMethodsArray,
		bankTransferMethod,
		ewalletMethod,
		codMethod,
		isBankTransferActive,
		isEwalletActive,
		isCodActive,
		bankAccountsCount: bankAccounts.length,
		bankAccounts,
		"Will show bank section?": isBankTransferActive,
		"Will show list?": isBankTransferActive && bankAccounts.length > 0,
		"Will show empty state?":
			isBankTransferActive && bankAccounts.length === 0,
	});

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Payment Settings</CardTitle>
					<CardDescription>
						Configure manual payment methods for your store.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Bank Transfer Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/50">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
									<Banknote className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<h4 className="font-medium">Bank Transfer</h4>
									<p className="text-sm text-muted-foreground">
										Manual bank transfer verification
									</p>
								</div>
							</div>
							<Switch
								id="bank-transfer"
								checked={isBankTransferActive}
								onCheckedChange={() =>
									togglePaymentMethod("bank_transfer")
								}
							/>
						</div>

						{isBankTransferActive && (
							<div className="ml-14 space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-sm font-medium">
										Bank Accounts
									</Label>
									<Button
										onClick={handleAddBankAccount}
										size="sm"
										variant="outline"
									>
										<Plus className="mr-2 h-4 w-4" /> Add Bank Account
									</Button>
								</div>

								{bankAccounts.length === 0 ? (
									<div className="text-center py-6 text-sm text-muted-foreground border rounded-lg">
										No bank accounts yet. Add one to accept bank
										transfers.
									</div>
								) : (
									<div className="space-y-2">
										{bankAccounts.map((account) => (
											<div
												key={account.id}
												className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
											>
												<div>
													<p className="font-medium">
														{account.bankName}
													</p>
													<p className="text-sm text-muted-foreground">
														{account.accountNumber} -{" "}
														{account.accountHolderName}
													</p>
													{account.branch && (
														<p className="text-xs text-muted-foreground">
															Branch: {account.branch}
														</p>
													)}
												</div>
												<div className="flex gap-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															handleEditBankAccount(account)
														}
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															confirmDelete("bank", account.id)
														}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>

					<Separator />

					{/* E-Wallet Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
									<Wallet className="h-6 w-6 text-green-600" />
								</div>
								<div>
									<h4 className="font-medium">E-Wallet</h4>
									<p className="text-sm text-muted-foreground">
										GoPay, OVO, DANA, LinkAja, ShopeePay
									</p>
								</div>
							</div>
							<Switch
								id="e-wallet"
								checked={isEwalletActive}
								onCheckedChange={() => togglePaymentMethod("ewallet")}
							/>
						</div>

						{isEwalletActive && (
							<div className="ml-14 space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-sm font-medium">
										E-Wallet Accounts
									</Label>
									<Button
										onClick={handleAddEwalletAccount}
										size="sm"
										variant="outline"
									>
										<Plus className="mr-2 h-4 w-4" /> Add E-Wallet
										Account
									</Button>
								</div>

								{ewalletAccounts.length === 0 ? (
									<div className="text-center py-6 text-sm text-muted-foreground border rounded-lg">
										No e-wallet accounts yet. Add one to accept
										e-wallet payments.
									</div>
								) : (
									<div className="space-y-2">
										{ewalletAccounts.map((account) => (
											<div
												key={account.id}
												className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
											>
												<div>
													<p className="font-medium">
														{account.provider}
													</p>
													<p className="text-sm text-muted-foreground">
														{account.accountNumber} -{" "}
														{account.accountHolderName}
													</p>
												</div>
												<div className="flex gap-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															handleEditEwalletAccount(account)
														}
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															confirmDelete(
																"ewallet",
																account.id
															)
														}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>

					<Separator />

					{/* QRIS Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 border rounded-lg bg-purple-50/50">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center">
									<QrCode className="h-6 w-6 text-purple-600" />
								</div>
								<div>
									<h4 className="font-medium">QRIS</h4>
									<p className="text-sm text-muted-foreground">
										Scan QRIS code untuk pembayaran instant
									</p>
								</div>
							</div>
							<Switch
								id="qris"
								checked={isQrisActive}
								onCheckedChange={() => togglePaymentMethod("qris")}
							/>
						</div>

						{isQrisActive && (
							<div className="ml-14 space-y-3">
								<div className="flex items-center justify-between">
									<Label className="text-sm font-medium">
										QRIS Settings
									</Label>
									<Button
										onClick={handleAddQrisSetting}
										size="sm"
										variant="outline"
									>
										<Plus className="mr-2 h-4 w-4" /> Setup QRIS
									</Button>
								</div>

								{qrisSettings.length === 0 ? (
									<div className="text-center py-6 text-sm text-muted-foreground border rounded-lg">
										No QRIS settings yet. Setup QRIS to accept QRIS
										payments.
									</div>
								) : (
									<div className="space-y-2">
										{qrisSettings.map((setting) => (
											<div
												key={setting.id}
												className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
											>
												<div className="flex items-center gap-3">
													{setting.qrCodeImage && (
														<div className="w-12 h-12 border rounded-md overflow-hidden">
															<Image
																src={setting.qrCodeImage}
																alt="QRIS QR Code"
																width={48}
																height={48}
																className="w-full h-full object-cover"
															/>
														</div>
													)}
													<div>
														<p className="font-medium">
															{setting.merchantName}
														</p>
														<p className="text-sm text-muted-foreground">
															QRIS payment method
														</p>
													</div>
												</div>
												<div className="flex gap-2">
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															handleEditQrisSetting(setting)
														}
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() =>
															confirmDelete(
																"ewallet",
																setting.id
															)
														}
													>
														<Trash2 className="h-4 w-4 text-destructive" />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>

					<Separator />

					{/* COD Section */}
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50/50">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-yellow-100 rounded-md flex items-center justify-center">
									<Truck className="h-6 w-6 text-yellow-600" />
								</div>
								<div>
									<h4 className="font-medium">
										Cash on Delivery (COD)
									</h4>
									<p className="text-sm text-muted-foreground">
										Pay when you receive (limited to shipping zones)
									</p>
								</div>
							</div>
							<Switch
								id="cod"
								checked={isCodActive}
								onCheckedChange={() => togglePaymentMethod("cod")}
							/>
						</div>

						{isCodActive && (
							<div className="ml-14 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
								<p className="text-sm text-yellow-800">
									<strong>Note:</strong> COD is only available for
									orders within configured shipping zones. Customers
									outside these zones won't see this payment option.
								</p>
							</div>
						)}
					</div>

					<Separator />
					<div className="space-y-4 opacity-50">
						<div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
									<CreditCard className="h-6 w-6 text-gray-600" />
								</div>
								<div>
									<h4 className="font-medium">Credit/Debit Card</h4>
									<p className="text-sm text-muted-foreground">
										Visa, Mastercard, JCB (Coming Soon)
									</p>
								</div>
							</div>
							<Switch id="card" checked={false} disabled={true} />
						</div>
						<div className="ml-14 p-3 bg-gray-50 border border-gray-200 rounded-lg">
							<p className="text-sm text-gray-600">
								Payment gateway integration coming soon. This feature is
								currently disabled.
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						className="bg-pink-500 hover:bg-pink-600"
						onClick={handleSaveChanges}
						disabled={loading}
					>
						{loading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<Save className="mr-2 h-4 w-4" />
						)}
						{loading ? "Menyimpan..." : "Save Changes"}
					</Button>
				</CardFooter>
			</Card>

			<BankAccountDialog
				open={bankDialogOpen}
				onOpenChange={setBankDialogOpen}
				account={selectedBankAccount}
				onSuccess={loadBankAccounts}
			/>

			<EwalletAccountDialog
				open={ewalletDialogOpen}
				onOpenChange={setEwalletDialogOpen}
				account={selectedEwalletAccount}
				onSuccess={loadEwalletAccounts}
			/>

			<QRISDialog
				open={qrisDialogOpen}
				onOpenChange={setQrisDialogOpen}
				setting={selectedQrisSetting}
				onSuccess={loadQrisSettings}
			/>

			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete
							the {itemToDelete?.type === "bank" ? "bank" : "e-wallet"}{" "}
							account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={deleting}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={deleting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{deleting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{deleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
