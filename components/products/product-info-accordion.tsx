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
    <div className="border-t border-neutral-400 pt-12">
      <Accordion type="multiple" className="w-full">
        {description && (
          <AccordionItem
            value="description"
            className="border-b border-neutral-400"
          >
            <AccordionTrigger className="py-6 text-sm font-normal text-neutral-900 hover:text-neutral-600">
              Description
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p className="text-sm leading-relaxed text-neutral-600">
                {description}
              </p>
            </AccordionContent>
          </AccordionItem>
        )}

        {specifications && Object.keys(specifications).length > 0 && (
          <AccordionItem
            value="specifications"
            className="border-b border-neutral-200"
          >
            <AccordionTrigger className="py-6 text-sm font-normal text-neutral-900 hover:text-neutral-600">
              Specifications
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <dl className="space-y-3">
                {Object.entries(specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:justify-between gap-2 border-b border-neutral-300 pb-3 last:border-0"
                  >
                    <dt className="text-sm text-neutral-500">{key}</dt>
                    <dd className="text-sm text-neutral-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        )}

        {delivery && (
          <AccordionItem
            value="delivery"
            className="border-b border-neutral-400"
          >
            <AccordionTrigger className="py-6 text-sm font-normal text-neutral-900 hover:text-neutral-600">
              Shipping & Delivery
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p className="text-sm leading-relaxed text-neutral-600">
                {delivery}
              </p>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
