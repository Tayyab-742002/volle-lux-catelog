import { Cart } from "@/types/cart";

interface OrderSummaryProps {
  summary: Cart;
  showTitle?: boolean;
}

export function OrderSummary({ summary, showTitle = true }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      {showTitle && <h3 className="text-lg font-semibold">Order Summary</h3>}

      <div className="space-y-3 text-sm">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">£{summary.subtotal.toFixed(2)}</span>
        </div>

        {/* Discount */}
        {summary.discount > 0 && (
          <div className="flex justify-between text-primary">
            <span>Discount</span>
            <span>-£{summary.discount.toFixed(2)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {summary.shipping === 0 ? (
              <span className="text-primary">Free</span>
            ) : (
              `£${summary.shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t pt-3" />

        {/* Total */}
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>£{summary.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
