import { Breadcrumbs } from "@/components/common";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "Ordering & Shipping",
    questions: [
      {
        question: "What are your shipping options?",
        answer:
          "We offer standard shipping (3-5 business days) and express shipping (1-2 business days). Orders over $100 qualify for free standard shipping. Express shipping is available for an additional fee.",
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
          "You can reach us via email at support@volle.com, phone at 1-800-VOLLE-PKG, or through our contact form. Our support team is available Monday-Friday, 9 AM - 6 PM EST.",
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
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-400">
        <div className="container mx-auto px-6 py-6">
          <Breadcrumbs items={[{ label: "FAQ", href: "/faq" }]} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="mb-16 md:mb-20">
            <h1 className="mb-6 text-4xl font-light text-neutral-900 md:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-neutral-600 md:text-lg">
              Find answers to common questions about our products and services
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-16">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="mb-8 text-xl font-normal text-neutral-900 md:text-2xl">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border-b border-neutral-400"
                    >
                      <AccordionTrigger className="py-6 text-left text-sm font-normal text-neutral-900 hover:text-neutral-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-sm leading-relaxed text-neutral-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 border-t border-neutral-400 pt-16 text-center">
            <h2 className="mb-6 text-2xl font-light text-neutral-900 md:text-3xl">
              Still have questions?
            </h2>
            <p className="mb-10 text-base text-neutral-600">
              Our support team is here to help
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 border-b-2 border-neutral-900 pb-1 text-sm font-normal text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
            >
              Contact Us
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
