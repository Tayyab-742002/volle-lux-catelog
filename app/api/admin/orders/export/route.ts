/**
 * Admin Orders Export API Route
 * Exports orders as CSV file
 */

import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/utils/admin-auth";
import { getAllOrders } from "@/services/admin/order.service";

/**
 * GET /api/admin/orders/export
 * Export orders as CSV
 * 
 * Query params:
 * - status: Filter by status
 * - startDate: Filter by start date
 * - endDate: Filter by end date
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return new Response("Forbidden: Admin access required", { status: 403 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build filters object
    const filters: any = {};
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    // Fetch orders
    const result = await getAllOrders(filters);

    // Convert orders to CSV format
    const csvRows = [
      ['Order Number', 'Date', 'Customer', 'Email', 'Status', 'Total Amount', 'Payment Status', 'Items', 'Shipping Address', 'Tracking Number'].join(','),
      ...result.orders.map(order => {
        // Format items
        const items = order.items
          ?.map((item: any) => `${item.product?.name || 'Unknown'} (x${item.quantity || 0})`)
          .join('; ') || '';
        
        // Format shipping address
        const shippingAddress = order.shippingAddress
          ? `${order.shippingAddress.address || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}`
          : '';
        
        // Format date
        const date = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : '';
        
        // Escape CSV fields
        const escapeCSV = (value: any) => {
          const str = String(value || '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };
        
        return [
          order.orderNumber || '',
          escapeCSV(date),
          escapeCSV(order.customerName || ''),
          escapeCSV(order.email || ''),
          escapeCSV(order.status || ''),
          escapeCSV(`£${order.total.toFixed(2)}`),
          escapeCSV('paid'),
          escapeCSV(items),
          escapeCSV(shippingAddress),
          escapeCSV(order.trackingNumber || ''),
        ].join(',');
      }),
    ];

    const csvContent = csvRows.join('\n');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `orders-export-${timestamp}.csv`;

    // Return CSV file
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error exporting orders:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to export orders',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

