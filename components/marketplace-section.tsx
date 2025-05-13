import Image from "next/image";
import Link from "next/link";

const marketplaces = [
	{
		name: "Shopee",
		logo: "/logo-shopee.png",
		color: "bg-orange-200",
		url: "https://shopee.co.id/store.pitaya",
		active: true,
	},
	{
		name: "Tokopedia",
		logo: "/logo-tokopedia.png",
		color: "bg-green-200",
		url: "https://www.tokopedia.com/pitayastore",
		active: true,
	},
	{
		name: "TikTok Shop",
		logo: "/logo-tiktok.png",
		color: "bg-slate-200",
		url: "",
		active: false,
	},
	{
		name: "Blibli",
		logo: "/logo-blibli.png",
		color: "bg-blue-200",
		url: "",
		active: false,
	},
	{
		name: "Lazada",
		logo: "/logo-lazada.png",
		color: "bg-indigo-200",
		url: "",
		active: false,
	},
];

export default function MarketplaceSection() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
						Shop on Your Favorite Platform
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto">
						Find our products on these popular e-commerce platforms for a
						convenient shopping experience.
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-4xl mx-auto">
					{marketplaces.map((marketplace) => (
						<Link
							key={marketplace.name}
							href={marketplace.url}
							className={`flex flex-col items-center p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 ${
								marketplace.active
									? "bg-white"
									: "bg-gray-300 cursor-not-allowed pointer-events-none"
							}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<div
								className={`w-12 h-12 rounded-full ${marketplace.color} flex items-center justify-center mb-3 p-2`}
							>
								<Image
									src={marketplace.logo || "/placeholder.svg"}
									alt={`${marketplace.name} logo`}
									width={30}
									height={30}
									className="object-contain"
								/>
							</div>
							<span className="text-sm font-medium text-gray-700">
								{marketplace.name}
							</span>
						</Link>
					))}
				</div>

				{/* <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Prefer to shop on our official store?</p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full">
            Visit Our Official Store
          </Button>
        </div> */}
			</div>
		</section>
	);
}
