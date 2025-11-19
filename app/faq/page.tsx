import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/common";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | Bubble Wrap Shop",
  description:
    "Find answers to common questions about our packaging supplies, shipping, returns, bulk orders, and more. Get help with your packaging needs at Bubble Wrap Shop.",
  openGraph: {
    title: "FAQ - Frequently Asked Questions | Bubble Wrap Shop",
    description:
      "Find answers to common questions about our packaging supplies, shipping, returns, bulk orders, and more.",
    url: `${siteUrl}/faq`,
  },
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
};

const faqData = [
  {
    category: "Ordering & Shipping",
    questions: [
      {
        question: "What are your shipping options?",
        answer:
          "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Orders over £100 qualify for free standard shipping. Express shipping is available for an additional fee.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we ship within the United States and Canada. International shipping options are being evaluated for future expansion.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order status in your account dashboard.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We accept returns within 30 days of purchase for unopened items in original packaging. Custom printed products are non-returnable. Please contact our support team to initiate a return.",
      },
    ],
  },
  {
    category: "Pricing & Discounts",
    questions: [
      {
        question: "How does bulk pricing work?",
        answer:
          "Our automatic bulk pricing applies discounts based on quantity ordered. As you increase quantity, the price per unit decreases. You can see pricing tiers on each product page, and the discount is automatically applied at checkout.",
      },
      {
        question: "Are there volume discounts for large orders?",
        answer:
          "Yes! For orders over 500 units, we offer additional volume discounts. Please contact our sales team for a custom quote on large orders.",
      },
      {
        question: "Do you offer business accounts?",
        answer:
          "We automatically handle both B2B and B2C pricing. Bulk discounts apply automatically based on quantity—no separate business account needed. Larger orders automatically receive better pricing.",
      },
    ],
  },
  {
    category: "Products & Quality",
    questions: [
      {
        question: "What materials do you use?",
        answer:
          "We use high-quality corrugated cardboard, eco-friendly bubble wrap, recycled materials, and FSC-certified products. All our packaging meets industry standards for protection and durability.",
      },
      {
        question: "Do you offer eco-friendly options?",
        answer:
          "Yes! We have a dedicated eco-friendly product line featuring recyclable materials, biodegradable options, and compostable packaging. Look for the eco-friendly badge on product pages.",
      },
      {
        question: "Can products be customized?",
        answer:
          "Yes, we offer custom printing on boxes and mailers. Custom orders typically take 2-3 weeks to produce. Contact our support team for custom quote requests.",
      },
      {
        question: "What sizes are available?",
        answer:
          "We offer a wide range of sizes across all product categories. Each product page shows available size variants. If you need a specific size not listed, please contact us.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        question: "Do I need to create an account to order?",
        answer:
          "No! You can check out as a guest. However, creating an account allows you to track orders, save addresses, and download invoices for easier reordering.",
      },
      {
        question: "How can I contact customer support?",
        answer:
          "You can reach us via email at support@volle.com, phone at 1-800-BUBBLE-WRAP, or through our contact form. Our support team is available Monday-Friday, 9 AM - 6 PM EST.",
      },
      {
        question: "Can I cancel or modify my order?",
        answer:
          "Orders can be modified or cancelled within 2 hours of placement. After that, orders enter the fulfillment process and cannot be changed. Please contact support immediately if you need to cancel.",
      },
      {
        question: "How do I download an invoice?",
        answer:
          "Registered users can download invoices from their account dashboard under Order History. Guest orders receive invoices via email.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs items={[{ label: "FAQ", href: "/faq" }]} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-8 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
              Back to Home
            </Button>
          </Link>

          {/* Page Header */}
          <div className="mb-16 md:mb-20 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
              Frequently Asked
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Questions
              </span>
            </h1>
            <p className="text-base text-gray-600 md:text-lg max-w-2xl mx-auto">
              Find answers to common questions about our products and services
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-12 md:space-y-16">
            {faqData.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300"
              >
                <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <AccordionTrigger className="py-5 text-left text-base font-semibold text-gray-900 hover:text-emerald-600 transition-colors data-[state=open]:text-emerald-600">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-1 rounded-full bg-emerald-500 shrink-0"></div>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 pt-2 pl-5">
                        <p className="text-sm md:text-base leading-relaxed text-gray-600">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          <section className="relative border-t bg-linear-to-br from-emerald-600  to-teal-600 py-20 md:py-28 lg:py-32 overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                {/* Heading */}
                <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Still have questions?
                  <span className="block mt-2 text-white">Contact Us</span>
                </h2>

                {/* Description */}
                <p className="mb-10 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed lg:mb-12">
                  Our support team is here to help
                </p>

                {/* CTA Button */}
                <Button asChild variant="ghost" className="w-fit group">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 mt-4 text-base font-semibold border border-white/20 text-white bg-white/20 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Contact Us
                    <ArrowRight
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      strokeWidth={2.5}
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
