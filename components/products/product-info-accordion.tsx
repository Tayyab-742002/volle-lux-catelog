import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductInfoAccordionProps {
  description?: string;
  specifications?: Record<string, string>;
  delivery?: string;
}

export function ProductInfoAccordion({
  description,
  specifications,
  delivery,
}: ProductInfoAccordionProps) {
  const hasContent = description || specifications || delivery;

  if (!hasContent) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-300">
      <Accordion type="multiple" className="w-full">
        {description && (
          <AccordionItem
            value="description"
            className="border-b border-gray-300"
          >
            <AccordionTrigger className="py-5 text-base font-semibold text-gray-900 hover:text-emerald-600 transition-colors [&[data-state=open]]:text-emerald-600">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                Description
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <p className="text-sm leading-relaxed text-gray-700 pl-5">
                {description}
              </p>
            </AccordionContent>
          </AccordionItem>
        )}

        {specifications && Object.keys(specifications).length > 0 && (
          <AccordionItem
            value="specifications"
            className="border-b-2 border-emerald-100"
          >
            <AccordionTrigger className="py-5 text-base font-semibold text-gray-900 hover:text-teal-600 transition-colors [&[data-state=open]]:text-teal-600">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                Specifications
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <dl className="space-y-4 pl-5">
                {Object.entries(specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:justify-between gap-2 pb-4 border-b border-emerald-100 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm font-semibold text-gray-700">
                      {key}
                    </dt>
                    <dd className="text-sm text-gray-900 sm:text-right">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        )}

        {delivery && (
          <AccordionItem
            value="delivery"
            className="border-b-2 border-emerald-100 last:border-0"
          >
            <AccordionTrigger className="py-5 text-base font-semibold text-gray-900 hover:text-cyan-600 transition-colors [&[data-state=open]]:text-cyan-600">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                Shipping & Delivery
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="pl-5 space-y-4">
                <p className="text-sm leading-relaxed text-gray-700">
                  {delivery}
                </p>
                {/* Additional Shipping Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-emerald-100">
                  <div className="flex items-start gap-3 p-3 bg-linear-to-br from-emerald-50 to-teal-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Free Shipping
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        On orders over £100
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-linear-to-br from-teal-50 to-cyan-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-teal-600 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Fast Delivery
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        2-3 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
