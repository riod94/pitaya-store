"use client";
import { BarChart2 } from "lucide-react";

export default function AdminAnalyticsPage() {
	return (
		<div className="p-8">
			<div className="flex items-center gap-3 mb-6">
				<BarChart2 className="w-7 h-7 text-pink-500" />
				<h1 className="text-2xl font-bold">Analitik</h1>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="rounded-xl border p-6 bg-white shadow-sm">
					<h2 className="font-semibold mb-2">Total Penjualan</h2>
					<p className="text-3xl font-bold text-pink-500">Rp 123.456.789</p>
				</div>
				<div className="rounded-xl border p-6 bg-white shadow-sm">
					<h2 className="font-semibold mb-2">Pengunjung Bulan Ini</h2>
					<p className="text-3xl font-bold text-teal-500">8.900</p>
				</div>
				<div className="rounded-xl border p-6 bg-white shadow-sm">
					<h2 className="font-semibold mb-2">Produk Terjual</h2>
					<p className="text-3xl font-bold text-amber-500">1.234</p>
				</div>
			</div>
			<div className="mt-10">
				<div className="rounded-xl border p-6 bg-white shadow-sm">
					<h2 className="font-semibold mb-4">Grafik Dummy</h2>
					<div className="flex items-center justify-center h-40 text-gray-400">
						{/* Placeholder grafik */}
						<span>Grafik penjualan akan tampil di sini</span>
					</div>
				</div>
			</div>
		</div>
	);
}
