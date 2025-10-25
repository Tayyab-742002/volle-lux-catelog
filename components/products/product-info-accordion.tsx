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
    <Accordion type="multiple" className="w-full">
      {description && (
        <AccordionItem value="description">
          <AccordionTrigger className="label-luxury">
            Description
          </AccordionTrigger>
          <AccordionContent>
            <p className="leading-relaxed text-muted-foreground">
              {description}
            </p>
          </AccordionContent>
        </AccordionItem>
      )}

      {specifications && Object.keys(specifications).length > 0 && (
        <AccordionItem value="specifications">
          <AccordionTrigger className="label-luxury">
            Specifications
          </AccordionTrigger>
          <AccordionContent>
            <dl className="space-y-2">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-2">
                  <dt className="font-medium text-muted-foreground">{key}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      )}

      {delivery && (
        <AccordionItem value="delivery">
          <AccordionTrigger className="label-luxury">Delivery</AccordionTrigger>
          <AccordionContent>
            <p className="leading-relaxed text-muted-foreground">{delivery}</p>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
