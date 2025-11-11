/**
 * Generate PDF Receipt for Order
 * Creates a downloadable PDF receipt for completed orders
 */

import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";
import { getOrderById } from "@/services/orders/order.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch order using service role client
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create PDF document
    const doc = new jsPDF();

    // Set font size and add title
    doc.setFontSize(24);
    doc.text("Receipt", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Order #${order.orderNumber}`, 105, 40, { align: "center" });
    doc.text(
      `Date: ${order.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      105,
      48,
      { align: "center" }
    );

    let yPos = 65;

    // Billing Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Billing Information", 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (order.billingAddress) {
      const billing = order.billingAddress;
      doc.text(billing.fullName || "N/A", 20, yPos);
      yPos += 6;
      doc.text(billing.address || "N/A", 20, yPos);
      yPos += 6;
      if (billing.address2) {
        doc.text(billing.address2, 20, yPos);
        yPos += 6;
      }
      doc.text(
        `${billing.city || ""}, ${billing.state || ""} ${billing.zipCode || ""}`,
        20,
        yPos
      );
      yPos += 6;
      doc.text(billing.country || "N/A", 20, yPos);
      yPos += 6;
      if (billing.phone) {
        doc.text(`Phone: ${billing.phone}`, 20, yPos);
        yPos += 6;
      }
    } else {
      doc.text("N/A", 20, yPos);
      yPos += 6;
    }

    yPos += 10;

    // Shipping Information
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Shipping Address", 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (order.shippingAddress) {
      const shipping = order.shippingAddress;
      doc.text(shipping.fullName || "N/A", 20, yPos);
      yPos += 6;
      doc.text(shipping.address || "N/A", 20, yPos);
      yPos += 6;
      if (shipping.address2) {
        doc.text(shipping.address2, 20, yPos);
        yPos += 6;
      }
      doc.text(
        `${shipping.city || ""}, ${shipping.state || ""} ${shipping.zipCode || ""}`,
        20,
        yPos
      );
      yPos += 6;
      doc.text(shipping.country || "N/A", 20, yPos);
      yPos += 6;
      if (shipping.phone) {
        doc.text(`Phone: ${shipping.phone}`, 20, yPos);
        yPos += 6;
      }
    } else {
      doc.text("N/A", 20, yPos);
      yPos += 6;
    }

    yPos += 15;

    // Order Items Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Order Items", 20, yPos);
    yPos += 10;

    // Table header
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Item", 20, yPos);
    doc.text("Qty", 120, yPos);
    doc.text("Price", 150, yPos, { align: "right" });
    doc.text("Total", 190, yPos, { align: "right" });

    // Draw line under header
    yPos += 4;
    doc.line(20, yPos, 190, yPos);

    yPos += 10;
    doc.setFont("helvetica", "normal");

    // Table rows
    order.items.forEach((item) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const productName = item.product?.name || "Product";
      const variantName = item.variant?.name ? ` - ${item.variant.name}` : "";
      const itemName =
        productName + variantName;
      const quantity = item.quantity || 1;
      const pricePerUnit = item.pricePerUnit || 0;
      const totalPrice = item.totalPrice || pricePerUnit * quantity;

      // Split long item names across multiple lines
      const itemLines = doc.splitTextToSize(itemName, 90);
      
      doc.text(itemLines, 20, yPos);
      doc.text(quantity.toString(), 120, yPos);
      doc.text(`£${pricePerUnit.toFixed(2)}`, 150, yPos, { align: "right" });
      doc.text(`£${totalPrice.toFixed(2)}`, 190, yPos, { align: "right" });

      yPos += itemLines.length * 6 + 5;
    });

    yPos += 10;

    // Totals section
    doc.line(120, yPos, 190, yPos);
    yPos += 10;

    doc.text("Subtotal:", 120, yPos);
    doc.text(`£${order.subtotal.toFixed(2)}`, 190, yPos, { align: "right" });
    yPos += 6;

    if (order.discount > 0) {
      doc.text("Discount:", 120, yPos);
      doc.text(`-£${order.discount.toFixed(2)}`, 190, yPos, { align: "right" });
      yPos += 6;
    }

    doc.text("Shipping:", 120, yPos);
    doc.text(`£${order.shipping.toFixed(2)}`, 190, yPos, { align: "right" });
    yPos += 6;

    doc.setFont("helvetica", "bold");
    doc.line(120, yPos, 190, yPos);
    yPos += 6;

    doc.text("Total:", 120, yPos);
    doc.text(`£${order.total.toFixed(2)}`, 190, yPos, { align: "right" });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you for your purchase!",
      105,
      280,
      { align: "center" }
    );

    // Generate PDF as base64 string
    const pdfString = doc.output("arraybuffer");
    const pdfBuffer = Buffer.from(pdfString);

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${order.orderNumber}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating receipt:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate receipt",
      },
      { status: 500 }
    );
  }
}
