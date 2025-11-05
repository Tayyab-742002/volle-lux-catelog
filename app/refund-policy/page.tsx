import { Breadcrumbs } from "@/components/common";

export default function RefundPolicyPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-400">
        <div className="container mx-auto px-6 py-6">
          <Breadcrumbs
            items={[{ label: "Refund Policy", href: "/refund-policy" }]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-light text-neutral-900 md:text-5xl lg:text-6xl">
              Refund Policy
            </h1>
            <p className="text-lg text-neutral-600 md:text-xl">
              Thousands of products in stock. All orders placed by 2pm are
              dispatched on the same day.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {/* Refund Policy Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-light text-neutral-900 md:text-3xl lg:text-4xl">
                Refund Policy
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
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
                    className="text-primary underline hover:text-primary/80"
                  >
                    sales@bubblewrapshop.co.uk
                  </a>
                  . Please note that returns will need to be sent to the
                  following address:{" "}
                  <strong>
                    Unit 3, GBL House, Cleaver Street, Blackburn, BB1 5DG
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
                    className="text-primary underline hover:text-primary/80"
                  >
                    sales@bubblewrapshop.co.uk
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Damages and Issues Section */}
            <section className="space-y-6 border-t border-neutral-400 pt-12">
              <h2 className="text-2xl font-light text-neutral-900 md:text-3xl lg:text-4xl">
                Damages and Issues
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
                <p>
                  Please inspect your order upon reception and contact us
                  immediately if the item is defective, damaged or if you
                  receive the wrong item, so that we can evaluate the issue and
                  make it right.
                </p>
              </div>
            </section>

            {/* Exceptions Section */}
            <section className="space-y-6 border-t border-neutral-400 pt-12">
              <h2 className="text-2xl font-light text-neutral-900 md:text-3xl lg:text-4xl">
                Exceptions / Non-returnable Items
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
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
            <section className="space-y-6 border-t border-neutral-400 pt-12">
              <h2 className="text-2xl font-light text-neutral-900 md:text-3xl lg:text-4xl">
                Exchanges
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
                <p>
                  The fastest way to ensure you get what you want is to return
                  the item you have, and once the return is accepted, make a
                  separate purchase for the new item.
                </p>
              </div>
            </section>

            {/* European Union Section */}
            <section className="space-y-6 border-t border-neutral-400 pt-12">
              <h2 className="text-2xl font-light text-neutral-900 md:text-3xl lg:text-4xl">
                European Union 14 Day Cooling Off Period
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
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
            <section className="space-y-6 border-t border-neutral-400 pt-12">
              <h2 className="text-2xl font-light text-neutral-900 md:text-3xl lg:text-4xl">
                Refunds
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-neutral-600 md:text-lg">
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
                    className="text-primary underline hover:text-primary/80"
                  >
                    sales@bubblewrapshop.co.uk
                  </a>
                  .
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
