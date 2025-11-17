import { Breadcrumbs } from "@/components/common";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RefundPolicyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs
            items={[{ label: "Refund Policy", href: "/refund-policy" }]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-16 md:mb-20 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
              Refund
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Policy
              </span>
            </h1>
            <p className="text-lg text-center! text-gray-600 md:text-xl max-w-full mx-auto">
              Our commitment to your satisfaction. Clear, fair, and transparent
              return policy.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8 md:space-y-12">
            {/* Refund Policy Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Refund Policy
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We have a 14-day return policy, which means you have 30 days
                  after receiving your item to request a return.
                </p>
                <p>
                  To be eligible for a return, your item must be in the same
                  condition that you received it, unworn or unused, with tags,
                  and in its original packaging. You&apos;ll also need the
                  receipt or proof of purchase.
                </p>
                <p>
                  To start a return, you can contact us at{" "}
                  <a
                    href="mailto:sales@bubblewrapshop.co.uk"
                    className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                  >
                    sales@bubblewrapshop.co.uk
                  </a>
                  . Please note that returns will need to be sent to the
                  following address:{" "}
                  <strong className="text-gray-900">
                    Unit BR16 Blakewater Road, Blackburn, England, BB1 5QF
                  </strong>
                </p>
                <p>
                  If your return is accepted, we&apos;ll send you a return
                  shipping label, as well as instructions on how and where to
                  send your package. Items sent back to us without first
                  requesting a return will not be accepted.
                </p>
                <p>
                  You can always contact us for any return question at{" "}
                  <a
                    href="mailto:sales@bubblewrapshop.co.uk"
                    className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                  >
                    sales@bubblewrapshop.co.uk
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Damages and Issues Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Damages and Issues
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Please inspect your order upon reception and contact us
                  immediately if the item is defective, damaged or if you
                  receive the wrong item, so that we can evaluate the issue and
                  make it right.
                </p>
              </div>
            </section>

            {/* Exceptions Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Exceptions / Non-returnable Items
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Certain types of items cannot be returned, like perishable
                  goods (such as food, flowers, or plants), custom products
                  (such as special orders or personalized items), and personal
                  care goods (such as beauty products). We also do not accept
                  returns for hazardous materials, flammable liquids, or gases.
                  Please get in touch if you have questions or concerns about
                  your specific item.
                </p>
                <p>
                  Unfortunately, we cannot accept returns on sale items or gift
                  cards.
                </p>
              </div>
            </section>

            {/* Exchanges Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Exchanges
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  The fastest way to ensure you get what you want is to return
                  the item you have, and once the return is accepted, make a
                  separate purchase for the new item.
                </p>
              </div>
            </section>

            {/* European Union Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                European Union 14 Day Cooling Off Period
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Notwithstanding the above, if the merchandise is being shipped
                  into the European Union, you have the right to cancel or
                  return your order within 14 days, for any reason and without a
                  justification. As above, your item must be in the same
                  condition that you received it, unworn or unused, with tags,
                  and in its original packaging. You&apos;ll also need the
                  receipt or proof of purchase.
                </p>
              </div>
            </section>

            {/* Refunds Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Refunds
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We will notify you once we&apos;ve received and inspected your
                  return, and let you know if the refund was approved or not. If
                  approved, you&apos;ll be automatically refunded on your
                  original payment method within 10 business days. Please
                  remember it can take some time for your bank or credit card
                  company to process and post the refund too.
                </p>
                <p>
                  If more than 15 business days have passed since we&apos;ve
                  approved your return, please contact us at{" "}
                  <a
                    href="mailto:sales@bubblewrapshop.co.uk"
                    className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                  >
                    sales@bubblewrapshop.co.uk
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>

          <section className="relative mt-18 border-t bg-linear-to-br from-emerald-600  to-teal-600 py-20 md:py-28 lg:py-32 overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                {/* Heading */}
                <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Need Help with a
                  <span className="block mt-2 text-white">
                    Return or Refund?
                  </span>
                </h2>

                {/* Description */}
                <p className="mb-10 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed lg:mb-12">
                  Our support team is ready to assist you with any questions
                  about returns, refunds, or exchanges.
                </p>

                {/* CTA Button */}
                <Button asChild variant="ghost" className="w-fit group">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-8 py-4 mt-4 text-base font-semibold border border-white/20 text-white bg-white/20 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Contact Support
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
