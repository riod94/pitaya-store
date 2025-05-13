import Link from "next/link";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	{
		question: "What makes PITAYA nuts and seeds special?",
		answer:
			"PITAYA nuts and seeds are sourced from premium suppliers, carefully selected for quality, and processed to maintain maximum freshness and nutritional value. We ensure all our products are free from additives and preservatives.",
	},
	{
		question: "How should I store my nuts and seeds?",
		answer:
			"For optimal freshness, store your nuts and seeds in an airtight container in a cool, dry place away from direct sunlight. For longer storage (over 3 months), we recommend keeping them in the refrigerator or freezer.",
	},
	{
		question: "Are your products suitable for vegans and vegetarians?",
		answer:
			"Yes, all our nuts and seeds are 100% plant-based and suitable for both vegans and vegetarians. They're a great source of protein and essential nutrients for plant-based diets.",
	},
	{
		question: "Do you offer international shipping?",
		answer:
			"Currently, we ship throughout Indonesia. For international orders, please contact our customer service team at halo.pitaya@gmail.com to discuss shipping options and rates.",
	},
	{
		question: "What payment methods do you accept?",
		answer:
			"We accept various payment methods including credit/debit cards, bank transfers, and e-wallets such as GoPay, OVO, DANA, and LinkAja for your convenience.",
	},
	{
		question: "How long will my order take to arrive?",
		answer:
			"Delivery times vary depending on your location. For Jakarta and surrounding areas, delivery typically takes 1-2 business days. For other regions in Indonesia, it may take 2-5 business days.",
	},
];

export default function FAQSection() {
	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<div className="max-w-3xl mx-auto text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
						Frequently Asked Questions
					</h2>
					<p className="text-gray-600">
						Find answers to common questions about our products, ordering,
						and shipping.
					</p>
				</div>

				<div className="max-w-3xl mx-auto">
					<Accordion type="single" collapsible className="space-y-4">
						{faqs.map((faq, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className="bg-white rounded-lg shadow-sm border border-gray-100"
							>
								<AccordionTrigger className="px-6 py-4 text-left font-medium hover:text-pink-500">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-4 text-gray-600">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>

				<div className="text-center mt-8">
					<p className="text-gray-600 mb-4">
						Still have questions? We're here to help.
					</p>
					<div className="inline-flex gap-4">
						<Link
							href="https://wa.me/6282277563627?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20produk%20Pitaya%20Store."
							target="_blank"
							rel="noopener noreferrer"
							className="bg-gradient-to-r from-pink-500 to-teal-500 hover:from-pink-600 hover:to-teal-600 text-white px-6 py-3 rounded-full inline-block font-medium"
						>
							Chat on WhatsApp
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
