import { Breadcrumbs } from "@/components/common";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs
            items={[{ label: "Privacy Policy", href: "/privacy" }]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16 md:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-16 md:mb-20 text-center">
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
              Privacy
              <span className="block bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Policy
              </span>
            </h1>
            <p className="text-lg text-gray-600 md:text-xl max-w-full mx-auto mb-4">
              Your privacy matters to us. Learn how we collect, use, and protect
              your personal information.
            </p>
            <p className="text-sm text-gray-500">Last updated: 16/02/2023</p>
          </div>

          {/* Main Content */}
          <div className="space-y-8 md:space-y-12">
            {/* Introduction */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  This Privacy Policy describes how Bubble Wrap Shop (the
                  &quot;Site&quot;, &quot;we&quot;, &quot;us&quot;, or
                  &quot;our&quot;) collects, uses, and discloses your personal
                  information when you visit, use our services, or make a
                  purchase from 5ecedf-2.myshopify.com (the &quot;Site&quot;) or
                  otherwise communicate with us (collectively, the
                  &quot;Services&quot;). For purposes of this Privacy Policy,
                  &quot;you&quot; and &quot;your&quot; means you as the user of
                  the Services, whether you are a customer, website visitor, or
                  another individual whose information we have collected
                  pursuant to this Privacy Policy.
                </p>
                <p>
                  Please read this Privacy Policy carefully. By using and
                  accessing any of the Services, you agree to the collection,
                  use, and disclosure of your information as described in this
                  Privacy Policy. If you do not agree to this Privacy Policy,
                  please do not use or access any of the Services.
                </p>
              </div>
            </section>

            {/* Changes to This Privacy Policy */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Changes to This Privacy Policy
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We may update this Privacy Policy from time to time, including
                  to reflect changes to our practices or for other operational,
                  legal, or regulatory reasons. We will post the revised Privacy
                  Policy on the Site, update the &quot;Last updated&quot; date
                  and take any other steps required by applicable law.
                </p>
              </div>
            </section>

            {/* How We Collect and Use Your Personal Information */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                How We Collect and Use Your Personal Information
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  To provide the Services, we collect and have collected over
                  the past 12 months personal information about you from a
                  variety of sources, as set out below. The information that we
                  collect and use varies depending on how you interact with us.
                </p>
                <p>
                  In addition to the specific uses set out below, we may use
                  information we collect about you to communicate with you,
                  provide the Services, comply with any applicable legal
                  obligations, enforce any applicable terms of service, and to
                  protect or defend the Services, our rights, and the rights of
                  our users or others.
                </p>
              </div>
            </section>

            {/* What Personal Information We Collect */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                What Personal Information We Collect
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  The types of personal information we obtain about you depends
                  on how you interact with our Site and use our Services. When
                  we use the term &quot;personal information&quot;, we are
                  referring to information that identifies, relates to,
                  describes or can be associated with you. The following
                  sections describe the categories and specific types of
                  personal information we collect.
                </p>
              </div>
            </section>

            {/* Information We Collect Directly from You */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h3 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-6 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Information We Collect Directly from You
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Information that you directly submit to us through our
                  Services may include:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-gray-600">
                  <li>
                    Basic contact details including your name, address, phone
                    number, email.
                  </li>
                  <li>
                    Order information including your name, billing address,
                    shipping address, payment confirmation, email address, phone
                    number.
                  </li>
                  <li>
                    Account information including your username, password,
                    security questions.
                  </li>
                  <li>
                    Shopping information including the items you view, put in
                    your cart or add to your wishlist.
                  </li>
                  <li>
                    Customer support information including the information you
                    choose to include in communications with us, for example,
                    when sending a message through the Services.
                  </li>
                </ul>
                <p>
                  Some features of the Services may require you to directly
                  provide us with certain information about yourself. You may
                  elect not to provide this information, but doing so may
                  prevent you from using or accessing these features.
                </p>
              </div>
            </section>

            {/* Information We Collect through Cookies */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h3 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-6 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Information We Collect through Cookies
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  We also automatically collect certain information about your
                  interaction with the Services (&quot;Usage Data&quot;). To do
                  this, we may use cookies, pixels and similar technologies
                  (&quot;Cookies&quot;). Usage Data may include information
                  about how you access and use our Site and your account,
                  including device information, browser information, information
                  about your network connection, your IP address and other
                  information regarding your interaction with the Services.
                </p>
              </div>
            </section>

            {/* Information We Obtain from Third Parties */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h3 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-6 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Information We Obtain from Third Parties
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Finally, we may obtain information about you from third
                  parties, including from vendors and service providers who may
                  collect information on our behalf, such as:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-gray-600">
                  <li>
                    Companies who support our Site and Services, such as
                    Shopify.
                  </li>
                  <li>
                    Our payment processors, who collect payment information
                    (e.g., bank account, credit or debit card information,
                    billing address) to process your payment in order to fulfill
                    your orders and provide you with products or services you
                    have requested, in order to perform our contract with you.
                  </li>
                  <li>
                    When you visit our Site, open or click on emails we send
                    you, or interact with our Services or advertisements, we, or
                    third parties we work with, may automatically collect
                    certain information using online tracking technologies such
                    as pixels, web beacons, software developer kits, third-party
                    libraries, and cookies.
                  </li>
                </ul>
                <p>
                  Any information we obtain from third parties will be treated
                  in accordance with this Privacy Policy. We are not responsible
                  or liable for the accuracy of the information provided to us
                  by third parties and are not responsible for any third
                  party&apos;s policies or practices. For more information, see
                  the section below, Third Party Websites and Links.
                </p>
              </div>
            </section>

            {/* How We Use Your Personal Information */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                How We Use Your Personal Information
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  <strong className="text-gray-900">
                    Providing Products and Services.
                  </strong>{" "}
                  We use your personal information to provide you with the
                  Services in order to perform our contract with you, including
                  to process your payments, fulfil your orders, to send
                  notifications to you related to you account, purchases,
                  returns, exchanges or other transactions, to create, maintain
                  and otherwise manage your account, to arrange for shipping,
                  facilitate any returns and exchanges and to enable you to post
                  reviews.
                </p>
                <p>
                  <strong className="text-gray-900">
                    Marketing and Advertising.
                  </strong>{" "}
                  We use your personal information for marketing and promotional
                  purposes, such as to send marketing, advertising and
                  promotional communications by email, text message or postal
                  mail, and to show you advertisements for products or services.
                  This may include using your personal information to better
                  tailor the Services and advertising on our Site and other
                  websites.
                </p>
                <p>
                  <strong className="text-gray-900">
                    Security and Fraud Prevention.
                  </strong>{" "}
                  We use your personal information to detect, investigate or
                  take action regarding possible fraudulent, illegal or
                  malicious activity. If you choose to use the Services and
                  register an account, you are responsible for keeping your
                  account credentials safe. We highly recommend that you do not
                  share your username, password, or other access details with
                  anyone else. If you believe your account has been compromised,
                  please contact us immediately.
                </p>
                <p>
                  <strong className="text-gray-900">
                    Communicating with you.
                  </strong>{" "}
                  We use your personal information to provide you with customer
                  support and improve our Services. This is in our legitimate
                  interests in order to be responsive to you, to provide
                  effective services to you, and to maintain our business
                  relationship with you.
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Cookies
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Like many websites, we use Cookies on our Site. For specific
                  information about the Cookies that we use related to powering
                  our store with Shopify, see{" "}
                  <a
                    href="https://www.shopify.com/legal/cookies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                  >
                    https://www.shopify.com/legal/cookies
                  </a>
                  . We use Cookies to power and improve our Site and our
                  Services (including to remember your actions and preferences),
                  to run analytics and better understand user interaction with
                  the Services (in our legitimate interests to administer,
                  improve and optimize the Services). We may also permit third
                  parties and services providers to use Cookies on our Site to
                  better tailor the services, products and advertising on our
                  Site and other websites.
                </p>
                <p>
                  Most browsers automatically accept Cookies by default, but you
                  can choose to set your browser to remove or reject Cookies
                  through your browser controls. Please keep in mind that
                  removing or blocking Cookies can negatively impact your user
                  experience and may cause some of the Services, including
                  certain features and general functionality, to work
                  incorrectly or no longer be available. Additionally, blocking
                  Cookies may not completely prevent how we share information
                  with third parties such as our advertising partners.
                </p>
              </div>
            </section>

            {/* How We Disclose Personal Information */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                How We Disclose Personal Information
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  In certain circumstances, we may disclose your personal
                  information to third parties for legitimate purposes subject
                  to this Privacy Policy. Such circumstances may include:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-gray-600">
                  <li>
                    With vendors or other third parties who perform services on
                    our behalf (e.g., IT management, payment processing, data
                    analytics, customer support, cloud storage, fulfillment and
                    shipping).
                  </li>
                  <li>
                    With business and marketing partners, including Shopify, to
                    provide services and advertise to you. Our business and
                    marketing partners will use your information in accordance
                    with their own privacy notices.
                  </li>
                  <li>
                    When you direct, request us or otherwise consent to our
                    disclosure of certain information to third parties, such as
                    to ship you products or through your use of social media
                    widgets or login integrations, with your consent.
                  </li>
                  <li>
                    With our affiliates or otherwise within our corporate group,
                    in our legitimate interests to run a successful business.
                  </li>
                  <li>
                    In connection with a business transaction such as a merger
                    or bankruptcy, to comply with any applicable legal
                    obligations (including to respond to subpoenas, search
                    warrants and similar requests), to enforce any applicable
                    terms of service, and to protect or defend the Services, our
                    rights, and the rights of our users or others.
                  </li>
                </ul>
                <p className="mt-6">
                  We have, in the past 12 months disclosed the following
                  categories of personal information and sensitive personal
                  information (denoted by *) about users for the purposes set
                  out above in &quot;How we Collect and Use your Personal
                  Information&quot; and &quot;How we Disclose Personal
                  Information&quot;:
                </p>
                <div className="mt-4 overflow-x-auto rounded-lg border border-emerald-200">
                  <table className="min-w-full">
                    <thead className="bg-linear-to-r from-emerald-50 to-teal-50">
                      <tr>
                        <th className="border-b border-emerald-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-700">
                          Category
                        </th>
                        <th className="border-b border-emerald-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-emerald-700">
                          Categories of Recipients
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Identifiers such as basic contact details and certain
                          order and account information
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Vendors and third parties who perform services on our
                          behalf (such as Internet service providers, payment
                          processors, fulfillment partners, customer support
                          partners and data analytics providers)
                        </td>
                      </tr>
                      <tr className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Commercial information such as order information,
                          shopping information and customer support information
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Business and marketing partners
                        </td>
                      </tr>
                      <tr className="hover:bg-emerald-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Internet or other similar network activity, such as
                          Usage Data
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Affiliates
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  We do not use or disclose sensitive personal information for
                  the purposes of inferring characteristics about you.
                </p>
              </div>
            </section>

            {/* User Generated Content */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                User Generated Content
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  The Services may enable you to post product reviews and other
                  user-generated content. If you choose to submit user generated
                  content to any public area of the Services, this content will
                  be public and accessible by anyone.
                </p>
                <p>
                  We do not control who will have access to the information that
                  you choose to make available to others, and cannot ensure that
                  parties who have access to such information will respect your
                  privacy or keep it secure. We are not responsible for the
                  privacy or security of any information that you make publicly
                  available, or for the accuracy, use or misuse of any
                  information that you disclose or receive from third parties.
                </p>
              </div>
            </section>

            {/* Third Party Websites and Links */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Third Party Websites and Links
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Our Site may provide links to websites or other online
                  platforms operated by third parties. If you follow links to
                  sites not affiliated or controlled by us, you should review
                  their privacy and security policies and other terms and
                  conditions. We do not guarantee and are not responsible for
                  the privacy or security of such sites, including the accuracy,
                  completeness, or reliability of information found on these
                  sites. Information you provide on public or semi-public
                  venues, including information you share on third-party social
                  networking platforms may also be viewable by other users of
                  the Services and/or users of those third-party platforms
                  without limitation as to its use by us or by a third party.
                  Our inclusion of such links does not, by itself, imply any
                  endorsement of the content on such platforms or of their
                  owners or operators, except as disclosed on the Services.
                </p>
              </div>
            </section>

            {/* Children's Data */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Children&apos;s Data
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  The Services are not intended to be used by children, and we
                  do not knowingly collect any personal information about
                  children. If you are the parent or guardian of a child who has
                  provided us with their personal information, you may contact
                  us using the contact details set out below to request that it
                  be deleted.
                </p>
                <p>
                  As of the Effective Date of this Privacy Policy, we do not
                  have actual knowledge that we &quot;share&quot; or
                  &quot;sell&quot; (as those terms are defined in applicable
                  law) personal information of individuals under 16 years of
                  age.
                </p>
              </div>
            </section>

            {/* Security and Retention of Your Information */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Security and Retention of Your Information
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Please be aware that no security measures are perfect or
                  impenetrable, and we cannot guarantee &quot;perfect
                  security.&quot; In addition, any information you send to us
                  may not be secure while in transit. We recommend that you do
                  not use unsecure channels to communicate sensitive or
                  confidential information to us.
                </p>
                <p>
                  How long we retain your personal information depends on
                  different factors, such as whether we need the information to
                  maintain your account, to provide the Services, comply with
                  legal obligations, resolve disputes or enforce other
                  applicable contracts and policies.
                </p>
              </div>
            </section>

            {/* Your Rights and Choices */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Your Rights and Choices
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Depending on where you live, you may have some or all of the
                  rights listed below in relation to your personal information.
                  However, these rights are not absolute, may apply only in
                  certain circumstances and, in certain cases, we may decline
                  your request as permitted by law.
                </p>
                <ul className="ml-6 list-disc space-y-2 text-gray-600">
                  <li>
                    <strong className="text-gray-900">
                      Right to Access / Know.
                    </strong>{" "}
                    You may have a right to request access to personal
                    information that we hold about you, including details
                    relating to the ways in which we use and share your
                    information.
                  </li>
                  <li>
                    <strong className="text-gray-900">Right to Delete.</strong>{" "}
                    You may have a right to request that we delete personal
                    information we maintain about you.
                  </li>
                  <li>
                    <strong className="text-gray-900">Right to Correct.</strong>{" "}
                    You may have a right to request that we correct inaccurate
                    personal information we maintain about you.
                  </li>
                  <li>
                    <strong className="text-gray-900">
                      Right of Portability.
                    </strong>{" "}
                    You may have a right to receive a copy of the personal
                    information we hold about you and to request that we
                    transfer it to a third party, in certain circumstances and
                    with certain exceptions.
                  </li>
                  <li>
                    <strong className="text-gray-900">
                      Withdrawal of Consent:
                    </strong>{" "}
                    Where we rely on consent to process your personal
                    information, you may have the right to withdraw this
                    consent.
                  </li>
                  <li>
                    <strong className="text-gray-900">Appeal:</strong> You may
                    have a right to appeal our decision if we decline to process
                    your request. You can do so by replying directly to our
                    denial.
                  </li>
                  <li>
                    <strong className="text-gray-900">
                      Managing Communication Preferences:
                    </strong>{" "}
                    We may send you promotional emails, and you may opt out of
                    receiving these at any time by using the unsubscribe option
                    displayed in our emails to you. If you opt out, we may still
                    send you non-promotional emails, such as those about your
                    account or orders that you have made.
                  </li>
                </ul>
                <p>
                  You may exercise any of these rights where indicated on our
                  Site or by contacting us using the contact details provided
                  below.
                </p>
                <p>
                  We will not discriminate against you for exercising any of
                  these rights. We may need to collect information from you to
                  verify your identity, such as your email address or account
                  information, before providing a substantive response to the
                  request. In accordance with applicable laws, You may designate
                  an authorized agent to make requests on your behalf to
                  exercise your rights. Before accepting such a request from an
                  agent, we will require that the agent provide proof you have
                  authorized them to act on your behalf, and we may need you to
                  verify your identity directly with us. We will respond to your
                  request in a timely manner as required under applicable law.
                </p>
              </div>
            </section>

            {/* Complaints */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Complaints
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  If you have complaints about how we process your personal
                  information, please contact us using the contact details
                  provided below. If you are not satisfied with our response to
                  your complaint, depending on where you live you may have the
                  right to appeal our decision by contacting us using the
                  contact details set out below, or lodge your complaint with
                  your local data protection authority.
                </p>
              </div>
            </section>

            {/* International Users */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                International Users
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Please note that we may transfer, store and process your
                  personal information outside the country you live in,
                  including the United States. Your personal information is also
                  processed by staff and third party service providers and
                  partners in these countries.
                </p>
                <p>
                  If we transfer your personal information out of Europe, we
                  will rely on recognized transfer mechanisms like the European
                  Commission&apos;s Standard Contractual Clauses, or any
                  equivalent contracts issued by the relevant competent
                  authority of the UK, as relevant, unless the data transfer is
                  to a country that has been determined to provide an adequate
                  level of protection.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-300">
              <h2 className="mb-6 text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="h-1 w-8 bg-linear-to-r from-emerald-600 to-teal-600 rounded-full"></div>
                Contact
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                <p>
                  Should you have any questions about our privacy practices or
                  this Privacy Policy, or if you would like to exercise any of
                  the rights available to you, please call{" "}
                  <a
                    href="tel:01254916167"
                    className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                  >
                    01254 916167
                  </a>{" "}
                  or email us at{" "}
                  <a
                    href="mailto:sales@bubblewrapshop.co.uk"
                    className="text-emerald-600 underline hover:text-emerald-700 font-medium"
                  >
                    sales@bubblewrapshop.co.uk
                  </a>{" "}
                  or contact us at Bubble wrap shop (Blackburn) Limited, Unit BR16
                  Blakewater Road, Blackburn, England, BB1 5QF, United Kingdom.
                </p>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <section className="relative mt-20 border-t bg-linear-to-br from-emerald-600 to-teal-600 py-20 md:py-28 lg:py-32 overflow-hidden">
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px]">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Questions About Your
                  <span className="block mt-2 text-white">Privacy Rights?</span>
                </h2>
                <p className="mb-10 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed lg:mb-12">
                  Our team is here to help you understand and exercise your
                  privacy rights.
                </p>
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
