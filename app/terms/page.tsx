import { Breadcrumbs } from "@/components/common";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsAndConditions() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs
            items={[{ label: "Terms & Conditions", href: "/terms-conditions" }]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-16 md:mb-20 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
              Terms &{" "}
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Conditions
              </span>
            </h1>
            <p className="text-lg text-gray-600 md:text-xl max-w-full mx-auto mb-4">
              Please read these terms carefully before using our services.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8 md:space-y-12">
            {/* Overview Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Overview
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  This website is operated by Bubble Wrap Shop. Throughout the
                  site, the terms &quot;we&quot;, &quot;us&quot; and
                  &quot;our&quot; refer to Bubble Wrap Shop. Bubble Wrap Shop
                  offers this website, including all information, tools and
                  Services available from this site to you, the user,
                  conditioned upon your acceptance of all terms, conditions,
                  policies and notices stated here.
                </p>
                <p>
                  By visiting our site and/or purchasing something from us, you
                  engage in our &quot;Service&quot; and agree to be bound by the
                  following terms and conditions (&quot;Terms of Service&quot;,
                  &quot;Terms&quot;), including those additional terms and
                  conditions and policies referenced herein and/or available by
                  hyperlink. These Terms of Service apply to all users of the
                  site, including without limitation users who are browsers,
                  vendors, customers, merchants, and/or contributors of content.
                </p>
                <p>
                  Please read these Terms of Service carefully before accessing
                  or using our website. By accessing or using any part of the
                  site, you agree to be bound by these Terms of Service. If you
                  do not agree to all the terms and conditions of this
                  agreement, then you may not access the website or use any
                  Services. If these Terms of Service are considered an offer,
                  acceptance is expressly limited to these Terms of Service.
                </p>
                <p>
                  Any new features or tools which are added to the current store
                  shall also be subject to the Terms of Service. You can review
                  the most current version of the Terms of Service at any time
                  on this page. We reserve the right to update, change or
                  replace any part of these Terms of Service by posting updates
                  and/or changes to our website. It is your responsibility to
                  check this page periodically for changes. Your continued use
                  of or access to the website following the posting of any
                  changes constitutes acceptance of those changes.
                </p>
              </div>
            </section>

            {/* Section 1 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 1 - Online Store Terms
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  By agreeing to these Terms of Service, you represent that you
                  are at least the age of majority in your state or province of
                  residence, or that you are the age of majority in your state
                  or province of residence and you have given us your consent to
                  allow any of your minor dependents to use this site.
                </p>
                <p>
                  You may not use our products for any illegal or unauthorized
                  purpose nor may you, in the use of the Service, violate any
                  laws in your jurisdiction (including but not limited to
                  copyright laws).
                </p>
                <p>
                  You must not transmit any worms or viruses or any code of a
                  destructive nature.
                </p>
                <p>
                  A breach or violation of any of the Terms will result in an
                  immediate termination of your Services.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 2 - General Conditions
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We reserve the right to refuse Service to anyone for any
                  reason at any time.
                </p>
                <p>
                  You understand that your content (not including credit card
                  information), may be transferred unencrypted and involve (a)
                  transmissions over various networks; and (b) changes to
                  conform and adapt to technical requirements of connecting
                  networks or devices. Credit card information is always
                  encrypted during transfer over networks.
                </p>
                <p>
                  You agree not to reproduce, duplicate, copy, sell, resell or
                  exploit any portion of the Service, use of the Service, or
                  access to the Service or any contact on the website through
                  which the Service is provided, without express written
                  permission by us.
                </p>
                <p>
                  The headings used in this agreement are included for
                  convenience only and will not limit or otherwise affect these
                  Terms.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 3 - Accuracy, Completeness and Timeliness of Information
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We are not responsible if information made available on this
                  site is not accurate, complete or current. The material on
                  this site is provided for general information only and should
                  not be relied upon or used as the sole basis for making
                  decisions without consulting primary, more accurate, more
                  complete or more timely sources of information. Any reliance
                  on the material on this site is at your own risk.
                </p>
                <p>
                  This site may contain certain historical information.
                  Historical information, necessarily, is not current and is
                  provided for your reference only. We reserve the right to
                  modify the contents of this site at any time, but we have no
                  obligation to update any information on our site. You agree
                  that it is your responsibility to monitor changes to our site.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 4 - Modifications to the Service and Prices
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Prices for our products are subject to change without notice.
                </p>
                <p>
                  We reserve the right at any time to modify or discontinue the
                  Service (or any part or content thereof) without notice at any
                  time.
                </p>
                <p>
                  We shall not be liable to you or to any third-party for any
                  modification, price change, suspension or discontinuance of
                  the Service.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 5 - Products or Services
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Certain products or Services may be available exclusively
                  online through the website. These products or Services may
                  have limited quantities and are subject to return or exchange
                  only according to our Refund Policy.
                </p>
                <p>
                  We have made every effort to display as accurately as possible
                  the colors and images of our products that appear at the
                  store. We cannot guarantee that your computer monitor&apos;s
                  display of any color will be accurate.
                </p>
                <p>
                  We reserve the right, but are not obligated, to limit the
                  sales of our products or Services to any person, geographic
                  region or jurisdiction. We may exercise this right on a
                  case-by-case basis. We reserve the right to limit the
                  quantities of any products or Services that we offer. All
                  descriptions of products or product pricing are subject to
                  change at anytime without notice, at the sole discretion of
                  us. We reserve the right to discontinue any product at any
                  time. Any offer for any product or Service made on this site
                  is void where prohibited.
                </p>
                <p>
                  We do not warrant that the quality of any products, Services,
                  information, or other material purchased or obtained by you
                  will meet your expectations, or that any errors in the Service
                  will be corrected.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 6 - Accuracy of Billing and Account Information
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We reserve the right to refuse any order you place with us. We
                  may, in our sole discretion, limit or cancel quantities
                  purchased per person, per household or per order. These
                  restrictions may include orders placed by or under the same
                  customer account, the same credit card, and/or orders that use
                  the same billing and/or shipping address. In the event that we
                  make a change to or cancel an order, we may attempt to notify
                  you by contacting the email and/or billing address/phone
                  number provided at the time the order was made. We reserve the
                  right to limit or prohibit orders that, in our sole judgment,
                  appear to be placed by dealers, resellers or distributors.
                </p>
                <p>
                  You agree to provide current, complete and accurate purchase
                  and account information for all purchases made at our store.
                  You agree to promptly update your account and other
                  information, including your email address and credit card
                  numbers and expiration dates, so that we can complete your
                  transactions and contact you as needed.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 7 - Optional Tools
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We may provide you with access to third-party tools over which
                  we neither monitor nor have any control nor input.
                </p>
                <p>
                  You acknowledge and agree that we provide access to such tools
                  &quot;as is&quot; and &quot;as available&quot; without any
                  warranties, representations or conditions of any kind and
                  without any endorsement. We shall have no liability whatsoever
                  arising from or relating to your use of optional third-party
                  tools.
                </p>
                <p>
                  Any use by you of the optional tools offered through the site
                  is entirely at your own risk and discretion and you should
                  ensure that you are familiar with and approve of the terms on
                  which tools are provided by the relevant third-party
                  provider(s).
                </p>
                <p>
                  We may also, in the future, offer new Services and/or features
                  through the website (including the release of new tools and
                  resources). Such new features and/or Services shall also be
                  subject to these Terms of Service.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 8 - Third-Party Links
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Certain content, products and Services available via our
                  Service may include materials from third-parties.
                </p>
                <p>
                  Third-party links on this site may direct you to third-party
                  websites that are not affiliated with us. We are not
                  responsible for examining or evaluating the content or
                  accuracy and we do not warrant and will not have any liability
                  or responsibility for any third-party materials or websites,
                  or for any other materials, products, or Services of
                  third-parties.
                </p>
                <p>
                  We are not liable for any harm or damages related to the
                  purchase or use of goods, Services, resources, content, or any
                  other transactions made in connection with any third-party
                  websites. Please review carefully the third-party&apos;s
                  policies and practices and make sure you understand them
                  before you engage in any transaction. Complaints, claims,
                  concerns, or questions regarding third-party products should
                  be directed to the third-party.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 9 - User Comments, Feedback and Other Submissions
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  If, at our request, you send certain specific submissions (for
                  example contest entries) or without a request from us, you
                  send creative ideas, suggestions, proposals, plans, or other
                  materials, whether online, by email, by postal mail, or
                  otherwise (collectively, &apos;comments&apos;), you agree that
                  we may, at any time, without restriction, edit, copy, publish,
                  distribute, translate and otherwise use in any medium any
                  comments that you forward to us. We are and shall be under no
                  obligation (1) to maintain any comments in confidence; (2) to
                  pay compensation for any comments; or (3) to respond to any
                  comments.
                </p>
                <p>
                  We may, but have no obligation to, monitor, edit or remove
                  content that we determine in our sole discretion to be
                  unlawful, offensive, threatening, libelous, defamatory,
                  pornographic, obscene or otherwise objectionable or violates
                  any party&apos;s intellectual property or these Terms of
                  Service.
                </p>
                <p>
                  You agree that your comments will not violate any right of any
                  third-party, including copyright, trademark, privacy,
                  personality or other personal or proprietary right. You
                  further agree that your comments will not contain libelous or
                  otherwise unlawful, abusive or obscene material, or contain
                  any computer virus or other malware that could in any way
                  affect the operation of the Service or any related website.
                  You may not use a false email address, pretend to be someone
                  other than yourself, or otherwise mislead us or third-parties
                  as to the origin of any comments. You are solely responsible
                  for any comments you make and their accuracy. We take no
                  responsibility and assume no liability for any comments posted
                  by you or any third-party.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 10 - Personal Information
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Your submission of personal information through the store is
                  governed by our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 11 - Errors, Inaccuracies and Omissions
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Occasionally there may be information on our site or in the
                  Service that contains typographical errors, inaccuracies or
                  omissions that may relate to product descriptions, pricing,
                  promotions, offers, product shipping charges, transit times
                  and availability. We reserve the right to correct any errors,
                  inaccuracies or omissions, and to change or update information
                  or cancel orders if any information in the Service or on any
                  related website is inaccurate at any time without prior notice
                  (including after you have submitted your order).
                </p>
                <p>
                  We undertake no obligation to update, amend or clarify
                  information in the Service or on any related website,
                  including without limitation, pricing information, except as
                  required by law. No specified update or refresh date applied
                  in the Service or on any related website, should be taken to
                  indicate that all information in the Service or on any related
                  website has been modified or updated.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 12 - Prohibited Uses
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  In addition to other prohibitions as set forth in the Terms of
                  Service, you are prohibited from using the site or its
                  content: (a) for any unlawful purpose; (b) to solicit others
                  to perform or participate in any unlawful acts; (c) to violate
                  any international, federal, provincial or state regulations,
                  rules, laws, or local ordinances; (d) to infringe upon or
                  violate our intellectual property rights or the intellectual
                  property rights of others; (e) to harass, abuse, insult, harm,
                  defame, slander, disparage, intimidate, or discriminate based
                  on gender, sexual orientation, religion, ethnicity, race, age,
                  national origin, or disability; (f) to submit false or
                  misleading information; (g) to upload or transmit viruses or
                  any other type of malicious code that will or may be used in
                  any way that will affect the functionality or operation of the
                  Service or of any related website, other websites, or the
                  Internet; (h) to collect or track the personal information of
                  others; (i) to spam, phish, pharm, pretext, spider, crawl, or
                  scrape; (j) for any obscene or immoral purpose; or (k) to
                  interfere with or circumvent the security features of the
                  Service or any related website, other websites, or the
                  Internet. We reserve the right to terminate your use of the
                  Service or any related website for violating any of the
                  prohibited uses.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 13 - Disclaimer of Warranties; Limitation of Liability
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We do not guarantee, represent or warrant that your use of our
                  Service will be uninterrupted, timely, secure or error-free.
                </p>
                <p>
                  We do not warrant that the results that may be obtained from
                  the use of the Service will be accurate or reliable.
                </p>
                <p>
                  You agree that from time to time we may remove the Service for
                  indefinite periods of time or cancel the Service at any time,
                  without notice to you.
                </p>
                <p>
                  You expressly agree that your use of, or inability to use, the
                  Service is at your sole risk. The Service and all products and
                  Services delivered to you through the Service are (except as
                  expressly stated by us) provided &apos;as is&apos; and
                  &apos;as available&apos; for your use, without any
                  representation, warranties or conditions of any kind, either
                  express or implied, including all implied warranties or
                  conditions of merchantability, merchantable quality, fitness
                  for a particular purpose, durability, title, and
                  non-infringement.
                </p>
                <p>
                  In no case shall Bubble Wrap Shop, our directors, officers,
                  employees, affiliates, agents, contractors, interns,
                  suppliers, Service providers or licensors be liable for any
                  injury, loss, claim, or any direct, indirect, incidental,
                  punitive, special, or consequential damages of any kind,
                  including, without limitation lost profits, lost revenue, lost
                  savings, loss of data, replacement costs, or any similar
                  damages, whether based in contract, tort (including
                  negligence), strict liability or otherwise, arising from your
                  use of any of the Service or any products procured using the
                  Service, or for any other claim related in any way to your use
                  of the Service or any product, including, but not limited to,
                  any errors or omissions in any content, or any loss or damage
                  of any kind incurred as a result of the use of the Service or
                  any content (or product) posted, transmitted, or otherwise
                  made available via the Service, even if advised of their
                  possibility. Because some states or jurisdictions do not allow
                  the exclusion or the limitation of liability for consequential
                  or incidental damages, in such states or jurisdictions, our
                  liability shall be limited to the maximum extent permitted by
                  law.
                </p>
              </div>
            </section>

            {/* Section 14 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 14 - Indemnification
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  You agree to indemnify, defend and hold harmless Bubble Wrap
                  Shop and our parent, subsidiaries, affiliates, partners,
                  officers, directors, agents, contractors, licensors, Service
                  providers, subcontractors, suppliers, interns and employees,
                  harmless from any claim or demand, including reasonable
                  attorneys&apos; fees, made by any third-party due to or
                  arising out of your breach of these Terms of Service or the
                  documents they incorporate by reference, or your violation of
                  any law or the rights of a third-party.
                </p>
              </div>
            </section>

            {/* Section 15 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 15 - Severability
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  In the event that any provision of these Terms of Service is
                  determined to be unlawful, void or unenforceable, such
                  provision shall nonetheless be enforceable to the fullest
                  extent permitted by applicable law, and the unenforceable
                  portion shall be deemed to be severed from these Terms of
                  Service, such determination shall not affect the validity and
                  enforceability of any other remaining provisions.
                </p>
              </div>
            </section>

            {/* Section 16 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 16 - Termination
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  The obligations and liabilities of the parties incurred prior
                  to the termination date shall survive the termination of this
                  agreement for all purposes.
                </p>
                <p>
                  These Terms of Service are effective unless and until
                  terminated by either you or us. You may terminate these Terms
                  of Service at any time by notifying us that you no longer wish
                  to use our Services, or when you cease using our site.
                </p>
                <p>
                  If in our sole judgment you fail, or we suspect that you have
                  failed, to comply with any term or provision of these Terms of
                  Service, we also may terminate this agreement at any time
                  without notice and you will remain liable for all amounts due
                  up to and including the date of termination; and/or
                  accordingly may deny you access to our Services (or any part
                  thereof).
                </p>
              </div>
            </section>

            {/* Section 17 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 17 - Entire Agreement
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  The failure of us to exercise or enforce any right or
                  provision of these Terms of Service shall not constitute a
                  waiver of such right or provision.
                </p>
                <p>
                  These Terms of Service and any policies or operating rules
                  posted by us on this site or in respect to the Service
                  constitutes the entire agreement and understanding between you
                  and us and governs your use of the Service, superseding any
                  prior or contemporaneous agreements, communications and
                  proposals, whether oral or written, between you and us
                  (including, but not limited to, any prior versions of the
                  Terms of Service).
                </p>
                <p>
                  Any ambiguities in the interpretation of these Terms of
                  Service shall not be construed against the drafting party.
                </p>
              </div>
            </section>

            {/* Section 18 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 18 - Governing Law
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  These Terms of Service and any separate agreements whereby we
                  provide you Services shall be governed by and construed in
                  accordance with the laws of the United Kingdom.
                </p>
              </div>
            </section>

            {/* Section 19 */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 19 - Changes to Terms of Service
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  You can review the most current version of the Terms of
                  Service at any time at this page.
                </p>
                <p>
                  We reserve the right, at our sole discretion, to update,
                  change or replace any part of these Terms of Service by
                  posting updates and changes to our website. It is your
                  responsibility to check our website periodically for changes.
                  Your continued use of or access to our website or the Service
                  following the posting of any changes to these Terms of Service
                  constitutes acceptance of those changes.
                </p>
              </div>
            </section>

            {/* Section 20 - Contact Information */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Section 20 - Contact Information
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Questions about the Terms of Service should be sent to us at{" "}
                  <a
                    href="mailto:sales@bubblewrapshop.co.uk"
                    className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                  >
                    sales@bubblewrapshop.co.uk
                  </a>
                  .
                </p>
                <p>Our contact information is posted below:</p>
                <div className="mt-4 space-y-2">
                  <p>
                    <strong className="text-gray-900">Company Name:</strong>{" "}
                    Bubble wrap shop (Blackburn) Limited
                  </p>
                  <p>
                    <strong className="text-gray-900">Email:</strong>{" "}
                    <a
                      href="mailto:sales@bubblewrapshop.co.uk"
                      className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                    >
                      sales@bubblewrapshop.co.uk
                    </a>
                  </p>
                  <p>
                    <strong className="text-gray-900">Phone:</strong>{" "}
                    <a
                      href="tel:01254916167"
                      className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                    >
                      01254 916167
                    </a>
                  </p>
                  <p>
                    <strong className="text-gray-900">Address:</strong> Bubble
                    Wrap Shop (NW) Ltd, Unit BR16 Blakewater Road, Blackburn,
                    England, BB1 5QF, United Kingdom
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <section className="relative mt-18 border-t bg-linear-to-br from-emerald-600 to-teal-600 py-20 md:py-28 lg:py-32 overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                {/* Heading */}
                <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Questions About Our
                  <span className="block mt-2 text-white">
                    Terms & Conditions?
                  </span>
                </h2>

                {/* Description */}
                <p className="mb-10 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed lg:mb-12">
                  Our team is here to help you understand our terms and answer
                  any questions you may have.
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
