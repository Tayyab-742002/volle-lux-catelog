import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { notFound } from "next/navigation";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

// Buying guide content
const buyingGuides: Record<
  string,
  {
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    featuredImage: string;
    topics: string[];
    seoTitle?: string;
    seoDescription?: string;
    content: string;
  }
> = {
  "packaging-boxes-guide": {
    title: "Complete Guide to Buying Packaging Boxes in the UK",
    excerpt:
      "Everything you need to know about choosing the right cardboard boxes for your business. Size, strength, material, and cost considerations.",
    category: "Boxes",
    readTime: "10 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    topics: [
      "Box types and materials",
      "Size selection",
      "Strength ratings",
      "Cost optimization",
      "UK suppliers",
    ],
    seoTitle:
      "Packaging Boxes Buying Guide UK | How to Choose Cardboard Boxes",
    seoDescription:
      "Complete guide to buying packaging boxes in the UK. Learn about box types, sizes, strength ratings, materials, and cost optimization for your business.",
    content: `
# Complete Guide to Buying Packaging Boxes in the UK

Choosing the right packaging boxes is essential for protecting your products and managing shipping costs. This comprehensive guide covers everything UK businesses need to know about buying cardboard boxes.

## Understanding Box Types

### Single-Wall Cardboard Boxes
The most common type of packaging box, suitable for most shipping needs.

**Best For:**
- Lightweight items (under 20kg)
- Standard retail products
- Cost-effective shipping
- Short to medium distance shipping

**Cost Range:** £0.20-£1.50 per box (depending on size)

### Double-Wall Cardboard Boxes
Extra strength for heavier or more fragile items.

**Best For:**
- Heavy items (20-40kg)
- Fragile products
- Long-distance shipping
- Valuable items

**Cost Range:** £0.50-£3.00 per box

### Triple-Wall Cardboard Boxes
Maximum protection for very heavy or extremely fragile items.

**Best For:**
- Very heavy items (over 40kg)
- Industrial equipment
- International shipping
- Extremely fragile items

**Cost Range:** £1.00-£5.00+ per box

## Box Size Selection

### How to Measure Your Product
1. Measure length (longest side)
2. Measure width (shorter side)
3. Measure height (vertical dimension)
4. Add 2-5cm to each dimension for padding

### UK Standard Box Sizes

**Small Boxes (20-25cm)**
- Best for: Books, small electronics, jewelry
- Weight capacity: Up to 5-8kg
- Cost: £0.20-£0.50

**Medium Boxes (30-35cm)**
- Best for: Clothing, multiple items, medium electronics
- Weight capacity: Up to 15-20kg
- Cost: £0.50-£1.50

**Large Boxes (40-50cm)**
- Best for: Large items, bulk orders, home goods
- Weight capacity: Up to 25-30kg
- Cost: £1.00-£3.00

**Extra Large Boxes (50cm+)**
- Best for: Very large items, furniture parts, bulk shipments
- Weight capacity: Up to 40kg+
- Cost: £2.00-£5.00+

## Understanding Box Strength (ECT Rating)

Edge Crush Test (ECT) rating indicates box strength:

- **32 ECT**: Standard strength for lightweight items
- **44 ECT**: Medium strength for average weight items
- **48 ECT**: High strength for heavy items
- **55+ ECT**: Maximum strength for very heavy items

**Matching Strength to Weight:**
- Items under 10kg: 32 ECT
- Items 10-20kg: 44 ECT
- Items 20-30kg: 48 ECT
- Items over 30kg: 55+ ECT

## Material Considerations

### Kraft Cardboard
- Brown cardboard (most common)
- Strong and durable
- Fully recyclable
- Best for most applications

### White Cardboard
- Clean, professional appearance
- Slightly less strong than kraft
- Good for retail packaging
- More expensive than kraft

### Recycled Cardboard
- Eco-friendly option
- Variable strength
- Cost-effective
- Good for standard shipping

## Cost Optimization Strategies

### 1. Bulk Ordering
Ordering in larger quantities significantly reduces costs:
- **10-20% discount**: Orders over 500 boxes
- **20-30% discount**: Orders over 1,000 boxes
- **30%+ discount**: Orders over 5,000 boxes

### 2. Right-Sizing
Using correctly sized boxes saves money:
- Reduces material waste
- Lowers shipping costs
- Improves protection
- Better space utilization

### 3. Standard Sizes
Choosing standard sizes over custom:
- Lower cost per box
- Faster delivery
- Easier to stock
- Better availability

## UK-Specific Considerations

### Royal Mail Size Limits
- **Small Parcel**: Up to 45cm × 35cm × 16cm
- **Medium Parcel**: Up to 61cm × 46cm × 46cm
- **Large Parcel**: Up to 100cm × 70cm × 50cm

### Courier Requirements
- Most couriers accept up to 120cm in any dimension
- Weight restrictions apply
- Check specific carrier guidelines

### VAT Considerations
- Most boxes subject to 20% VAT
- B2B customers can reclaim VAT
- Factor VAT into cost calculations

## Where to Buy Packaging Boxes in the UK

### Online Suppliers
- **Advantages**: Convenient, bulk pricing, wide selection
- **Best For**: Regular orders, bulk purchases
- **Delivery**: Usually 1-3 business days

### Local Suppliers
- **Advantages**: Faster delivery, local support
- **Best For**: Urgent orders, local businesses
- **Delivery**: Often same or next day

### Wholesale Suppliers
- **Advantages**: Best prices for large quantities
- **Best For**: High-volume businesses
- **Delivery**: Varies by supplier

## Quality Checklist

When buying packaging boxes, check:
- [ ] Correct size for your products
- [ ] Appropriate strength rating (ECT)
- [ ] Good quality material
- [ ] Proper construction (no gaps, strong corners)
- [ ] Recyclable material
- [ ] Competitive pricing
- [ ] Reliable supplier
- [ ] Fast delivery options

## Best Practices

1. **Stock Multiple Sizes**: Keep 3-5 different sizes in stock
2. **Match Strength to Weight**: Don't over or under-specify
3. **Consider Shipping Costs**: Larger boxes cost more to ship
4. **Plan for Growth**: Order boxes that scale with your business
5. **Test Before Bulk Ordering**: Try sample sizes first

## Conclusion

Choosing the right packaging boxes requires understanding your product needs, shipping requirements, and budget constraints. By following this guide, UK businesses can make informed decisions that protect products while managing costs effectively.

Remember: The right box size and strength not only protects your products but also optimizes shipping costs and improves customer satisfaction.

[Shop cardboard boxes in various sizes](/products?category=shipping-boxes) with automatic bulk pricing and next-day delivery across the UK.
    `,
  },
  "bubble-wrap-guide": {
    title: "Bubble Wrap Buying Guide: Choose the Right Protection",
    excerpt:
      "Complete guide to selecting bubble wrap for your shipping needs. Learn about bubble sizes, thickness, and when to use different types.",
    category: "Protective Materials",
    readTime: "8 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    topics: [
      "Bubble sizes explained",
      "Thickness options",
      "When to use bubble wrap",
      "Cost considerations",
      "Environmental alternatives",
    ],
    seoTitle: "Bubble Wrap Buying Guide UK | How to Choose Bubble Wrap",
    seoDescription:
      "Complete guide to buying bubble wrap in the UK. Learn about bubble sizes, thickness, types, and when to use different bubble wrap for optimal protection.",
    content: `
# Bubble Wrap Buying Guide: Choose the Right Protection

Bubble wrap is one of the most popular protective packaging materials. This guide helps UK businesses choose the right bubble wrap for their shipping needs.

## Understanding Bubble Sizes

### Small Bubbles (6mm)
- **Best For**: Lightweight, small items
- **Protection Level**: Standard
- **Cost**: Lower
- **Use Cases**: Electronics, glassware, small ceramics

### Medium Bubbles (10mm)
- **Best For**: Most standard items
- **Protection Level**: Good
- **Cost**: Moderate
- **Use Cases**: General fragile items, most shipping needs

### Large Bubbles (25mm)
- **Best For**: Heavy, large items
- **Protection Level**: Excellent
- **Cost**: Higher
- **Use Cases**: Large electronics, furniture parts, heavy items

## Thickness Options

### Standard Thickness (80-100 microns)
- Suitable for most items
- Good balance of protection and cost
- Most common choice

### Heavy-Duty Thickness (150+ microns)
- Extra protection for fragile items
- Better for heavy items
- Higher cost but better protection

## Types of Bubble Wrap

### Standard Bubble Wrap
- Clear plastic bubbles
- Most common type
- Good for general use
- Cost-effective

### Anti-Static Bubble Wrap
- Prevents static electricity
- Essential for electronics
- Slightly more expensive
- Protects sensitive components

### Perforated Bubble Wrap
- Easy to tear to size
- Reduces waste
- Convenient for packing
- Slightly higher cost

### Colored Bubble Wrap
- Branding opportunities
- Visual appeal
- Higher cost
- Less common

## When to Use Bubble Wrap

### Ideal For:
- Fragile items (glass, ceramics, electronics)
- Items with irregular shapes
- Light to medium weight items
- Standard shipping protection

### Not Ideal For:
- Very heavy items (may need foam)
- Items requiring moisture protection
- Temperature-sensitive items
- Items needing custom-fit protection

## Cost Considerations

### Standard Bubble Wrap
- **Cost**: £0.50-£2.00 per square meter
- **Best For**: Most shipping needs
- **Value**: Excellent protection-to-cost ratio

### Heavy-Duty Bubble Wrap
- **Cost**: £1.50-£3.50 per square meter
- **Best For**: Fragile or valuable items
- **Value**: Higher protection, higher cost

### Bulk Pricing
- Ordering in bulk reduces costs significantly
- 10-30% discount for large orders
- Consider annual needs when ordering

## How Much Bubble Wrap Do You Need?

### Calculation Method
1. Measure item dimensions
2. Calculate surface area
3. Add 20% for overlap and wrapping
4. Consider multiple layers for fragile items

### General Guidelines
- **Light Items**: 1-2 layers
- **Standard Items**: 2-3 layers
- **Fragile Items**: 3-4 layers
- **Very Fragile**: 4+ layers or double boxing

## Environmental Considerations

### Recyclability
- Bubble wrap is recyclable
- Check local recycling facilities
- Some areas have specific collection points
- Reusable if handled carefully

### Eco-Friendly Alternatives
- Biodegradable bubble wrap
- Paper-based alternatives
- Recycled bubble wrap
- Reusable packaging materials

## UK-Specific Information

### Availability
- Widely available from UK suppliers
- Next-day delivery options
- Bulk ordering available
- Various sizes and types stocked

### Recycling
- Accepted at most UK recycling centers
- Some councils collect separately
- Check local recycling guidelines
- Reuse when possible

## Best Practices

1. **Wrap Items Properly**: Cover all surfaces
2. **Use Appropriate Thickness**: Match to item fragility
3. **Don't Over-Wrap**: Balance protection with cost
4. **Store Correctly**: Keep in dry, cool place
5. **Reuse When Possible**: Extend material life

## Quality Checklist

When buying bubble wrap:
- [ ] Appropriate bubble size for your items
- [ ] Correct thickness for protection needs
- [ ] Good quality material (no weak spots)
- [ ] Perforated if needed for convenience
- [ ] Anti-static if shipping electronics
- [ ] Competitive pricing
- [ ] Reliable supplier
- [ ] Fast delivery options

## Conclusion

Choosing the right bubble wrap involves understanding your product protection needs, shipping requirements, and budget. By selecting the appropriate bubble size, thickness, and type, UK businesses can effectively protect their shipments while managing costs.

Remember: Proper wrapping technique is just as important as choosing the right bubble wrap. Take time to wrap items correctly for maximum protection.

[Shop bubble wrap in various sizes and types](/products?category=bubble-wrap) with next-day delivery across the UK.
    `,
  },
  "packing-tape-guide": {
    title: "Packing Tape Buying Guide: Secure Your Shipments",
    excerpt:
      "How to choose the right packing tape for your boxes. Learn about tape types, strength, and application techniques for secure shipping.",
    category: "Sealing Materials",
    readTime: "6 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    topics: [
      "Tape types",
      "Strength ratings",
      "Application methods",
      "Cost efficiency",
      "UK standards",
    ],
    seoTitle: "Packing Tape Buying Guide UK | How to Choose Packing Tape",
    seoDescription:
      "Complete guide to buying packing tape in the UK. Learn about tape types, strength ratings, application methods, and cost efficiency for secure shipping.",
    content: `
# Packing Tape Buying Guide: Secure Your Shipments

Choosing the right packing tape is crucial for ensuring your packages arrive safely. This comprehensive guide helps UK businesses select the best tape for their shipping needs.

## Understanding Tape Types

### Clear Packing Tape
The most common type of packing tape, suitable for most shipping needs.

**Best For:**
- General shipping
- Standard boxes
- Cost-effective sealing
- Most packaging applications

**Characteristics:**
- Clear appearance
- Good adhesion
- Cost-effective
- Widely available

### Brown Packing Tape
Matches brown cardboard boxes for a professional appearance.

**Best For:**
- Brown cardboard boxes
- Professional appearance
- Brand consistency
- Standard shipping

**Characteristics:**
- Matches box color
- Good adhesion
- Professional look
- Slightly more expensive

### Heavy-Duty Packing Tape
Extra strength for heavy or valuable shipments.

**Best For:**
- Heavy boxes
- Valuable items
- Long-distance shipping
- High-security needs

**Characteristics:**
- Superior strength
- Better adhesion
- More durable
- Higher cost

## Tape Strength Ratings

### Standard Strength (32-44 lbs)
- Suitable for most standard boxes
- Good for lightweight to medium items
- Cost-effective option
- Most common choice

### Heavy-Duty Strength (50-60 lbs)
- Better for heavy boxes
- Stronger adhesion
- More secure sealing
- Higher cost

### Extra Heavy-Duty (60+ lbs)
- Maximum strength
- For very heavy shipments
- Industrial applications
- Premium pricing

## Tape Width Options

### Narrow Tape (24-36mm)
- Best for small boxes
- Cost-effective
- Less material usage
- Good for standard parcels

### Standard Tape (48mm)
- Most common width
- Suitable for most boxes
- Good balance of coverage and cost
- Versatile option

### Wide Tape (72mm+)
- Best for large boxes
- Better coverage
- More secure sealing
- Higher material cost

## Application Methods

### Hand Dispensers
- Manual application
- Good for low volume
- Cost-effective
- Portable

### Desktop Dispensers
- Faster application
- Better for medium volume
- Consistent application
- Moderate cost

### Automatic Dispensers
- Fastest application
- Best for high volume
- Most efficient
- Higher initial cost

## Cost Considerations

### Standard Tape
- **Cost**: £2-£5 per roll
- **Best For**: Most shipping needs
- **Value**: Excellent cost-to-performance ratio

### Heavy-Duty Tape
- **Cost**: £4-£8 per roll
- **Best For**: Heavy or valuable shipments
- **Value**: Higher protection, higher cost

### Bulk Pricing
- Ordering in bulk reduces costs
- 10-25% discount for large orders
- Consider annual needs when ordering

## UK-Specific Information

### Royal Mail Requirements
- Tape must be strong enough to secure boxes
- Clear or brown tape preferred
- Avoid decorative tapes for shipping
- Ensure proper sealing

### Courier Requirements
- Most couriers accept standard packing tape
- Heavy-duty recommended for valuable items
- Check specific carrier guidelines
- Ensure boxes are properly sealed

## Best Practices

1. **Use Enough Tape**: Apply 2-3 strips per seam
2. **Seal All Edges**: Cover all box openings
3. **Apply Evenly**: Smooth application prevents bubbles
4. **Store Properly**: Keep tape in cool, dry place
5. **Check Expiry**: Old tape may lose adhesion

## Quality Checklist

When buying packing tape:
- [ ] Appropriate strength for your boxes
- [ ] Correct width for box size
- [ ] Good adhesion quality
- [ ] Competitive pricing
- [ ] Reliable supplier
- [ ] Fast delivery options
- [ ] Suitable for your volume

## Common Mistakes to Avoid

- **Using Insufficient Tape**: Weak seals lead to damage
- **Wrong Width**: Too narrow or too wide reduces effectiveness
- **Poor Application**: Uneven application weakens seals
- **Storing Incorrectly**: Heat and moisture affect tape quality
- **Using Old Tape**: Expired tape loses adhesion

## Conclusion

Choosing the right packing tape involves understanding your box sizes, shipping requirements, and volume needs. By selecting the appropriate tape type, strength, and width, UK businesses can ensure secure shipments while managing costs effectively.

Remember: Proper tape application is essential for package security. Take time to seal boxes correctly for maximum protection.

[Shop packing tape in various types and sizes](/products?category=packing-tape) with next-day delivery across the UK.
    `,
  },
  "protective-packaging-guide": {
    title: "Protective Packaging Guide: Keep Items Safe During Shipping",
    excerpt:
      "Comprehensive guide to protective packaging materials. Learn when to use different materials and how to protect fragile items effectively.",
    category: "Protective Materials",
    readTime: "9 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    topics: [
      "Material types",
      "Protection levels",
      "Cost vs protection",
      "Best practices",
      "UK availability",
    ],
    seoTitle:
      "Protective Packaging Guide UK | How to Protect Items During Shipping",
    seoDescription:
      "Complete guide to protective packaging materials in the UK. Learn about different material types, protection levels, and best practices for shipping fragile items.",
    content: `
# Protective Packaging Guide: Keep Items Safe During Shipping

Protecting items during shipping is essential for customer satisfaction and reducing returns. This comprehensive guide covers all protective packaging materials available to UK businesses.

## Understanding Protection Levels

### Light Protection
Suitable for items that need minimal cushioning.

**Materials:**
- Thin bubble wrap
- Paper padding
- Light foam sheets

**Best For:**
- Non-fragile items
- Lightweight products
- Short-distance shipping
- Cost-sensitive applications

### Standard Protection
Most common level of protection for general shipping.

**Materials:**
- Standard bubble wrap
- Medium foam padding
- Air pillows
- Paper void fill

**Best For:**
- Most standard items
- General retail products
- Medium-distance shipping
- Balanced protection and cost

### Heavy Protection
Maximum protection for fragile or valuable items.

**Materials:**
- Heavy-duty bubble wrap
- Thick foam padding
- Custom-fit foam
- Multiple layers

**Best For:**
- Fragile items
- Valuable products
- Long-distance shipping
- High-value shipments

## Material Types

### Bubble Wrap
Flexible plastic with air-filled bubbles providing cushioning.

**Advantages:**
- Excellent shock absorption
- Flexible and conforming
- Lightweight
- Cost-effective

**Best For:**
- Fragile items
- Irregular shapes
- General protection
- Most shipping needs

### Foam Padding
Various foam types providing different protection levels.

**Types:**
- Polyethylene foam
- Polyurethane foam
- Expanded polystyrene (EPS)
- Custom-cut foam

**Best For:**
- Heavy items
- Custom protection
- Maximum cushioning
- Industrial applications

### Air Pillows
Inflatable plastic cushions for void fill.

**Advantages:**
- Lightweight
- Space-efficient
- Cost-effective
- Easy to use

**Best For:**
- Void fill
- Large boxes
- Lightweight protection
- Volume reduction

### Paper Padding
Eco-friendly paper-based protection.

**Types:**
- Kraft paper
- Shredded paper
- Paper honeycomb
- Corrugated paper

**Best For:**
- Eco-friendly shipping
- Lightweight items
- Void fill
- Sustainable packaging

### Void Fill Materials
Materials to fill empty space in boxes.

**Types:**
- Packing peanuts
- Air pillows
- Paper fill
- Foam chips

**Best For:**
- Preventing movement
- Filling gaps
- Reducing damage
- Stabilizing items

## Cost vs Protection Analysis

### Budget-Friendly Options
- Paper padding: £0.10-£0.50 per box
- Air pillows: £0.20-£0.80 per box
- Standard bubble wrap: £0.50-£2.00 per box

### Mid-Range Options
- Medium foam: £1.00-£3.00 per box
- Heavy bubble wrap: £1.50-£4.00 per box
- Custom foam inserts: £2.00-£5.00 per box

### Premium Options
- Custom-fit foam: £5.00-£15.00+ per box
- Multi-layer protection: £3.00-£10.00 per box
- Specialized materials: Varies

## When to Use Different Materials

### For Fragile Items
- Use: Heavy bubble wrap or thick foam
- Apply: Multiple layers
- Consider: Custom-fit protection
- Priority: Maximum protection

### For Heavy Items
- Use: Thick foam or EPS
- Apply: Bottom and side padding
- Consider: Double boxing
- Priority: Weight distribution

### For Lightweight Items
- Use: Light bubble wrap or paper
- Apply: Single layer sufficient
- Consider: Cost efficiency
- Priority: Basic protection

### For Irregular Shapes
- Use: Flexible bubble wrap
- Apply: Wrap completely
- Consider: Custom solutions
- Priority: Complete coverage

## UK-Specific Considerations

### Availability
- All materials widely available
- Next-day delivery options
- Bulk ordering available
- Various suppliers to choose from

### Environmental Options
- Recyclable materials
- Biodegradable alternatives
- Paper-based options
- Reusable materials

### Cost Factors
- VAT applies to most materials
- Bulk discounts available
- Shipping costs vary
- Consider total cost per shipment

## Best Practices

1. **Match Protection to Item**: Don't over or under-protect
2. **Use Multiple Layers**: Better protection for fragile items
3. **Fill All Voids**: Prevent movement during shipping
4. **Test Before Shipping**: Verify protection effectiveness
5. **Consider Environmental Impact**: Choose recyclable options

## Protection Checklist

When packaging items:
- [ ] Appropriate protection level selected
- [ ] All surfaces covered
- [ ] Voids filled
- [ ] Items secured in place
- [ ] Box properly sealed
- [ ] Protection tested
- [ ] Cost optimized

## Common Mistakes

- **Insufficient Protection**: Leads to damage
- **Over-Protection**: Wastes money
- **Wrong Material**: Ineffective protection
- **Poor Application**: Reduces effectiveness
- **Ignoring Voids**: Items move and damage

## Environmental Considerations

### Recyclable Materials
- Most bubble wrap is recyclable
- Paper options fully recyclable
- Foam recycling varies by type
- Check local recycling facilities

### Sustainable Alternatives
- Biodegradable bubble wrap
- Recycled paper padding
- Reusable packaging materials
- Minimal packaging approach

## Conclusion

Choosing the right protective packaging requires understanding your product needs, shipping requirements, and budget. By selecting appropriate materials and applying them correctly, UK businesses can protect shipments effectively while managing costs.

Remember: Proper protection prevents damage, reduces returns, and improves customer satisfaction. Invest in quality protective materials for long-term success.

[Shop protective packaging materials](/products?category=protective-materials) with next-day delivery across the UK.
    `,
  },
};

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = buyingGuides[slug];

  if (!guide) {
    return {
      title: "Buying Guide Not Found | Bubble Wrap Shop",
      description: "The buying guide you're looking for doesn't exist.",
    };
  }

  const guideTitle = guide.seoTitle || guide.title;
  const guideDescription = guide.seoDescription || guide.excerpt;
  const guideUrl = `${siteUrl}/guides/${slug}`;

  return {
    title: `${guideTitle} | Bubble Wrap Shop`,
    description: guideDescription,
    keywords: [
      "packaging buying guide",
      "how to choose packaging",
      "packaging guide UK",
      guide.category.toLowerCase(),
    ],
    openGraph: {
      title: guideTitle,
      description: guideDescription,
      url: guideUrl,
      type: "article",
      images: [
        {
          url: guide.featuredImage,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    alternates: {
      canonical: guideUrl,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(buyingGuides).map((slug) => ({
    slug,
  }));
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = buyingGuides[slug];

  if (!guide) {
    notFound();
  }

  // Simple markdown-like content formatter
  const formatContent = (content: string) => {
    return content
      .split("\n")
      .map((line) => {
        if (line.startsWith("# ")) {
          return `<h2 class="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">${line.substring(2)}</h2>`;
        }
        if (line.startsWith("## ")) {
          return `<h3 class="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3">${line.substring(3)}</h3>`;
        }
        if (line.startsWith("### ")) {
          return `<h4 class="text-lg md:text-xl font-semibold text-gray-900 mt-4 mb-2">${line.substring(4)}</h4>`;
        }
        if (line.startsWith("- ")) {
          return `<li class="ml-6 mb-2">${line.substring(2)}</li>`;
        }
        if (line.startsWith("- [ ]")) {
          return `<li class="ml-6 mb-2 list-none"><span class="text-emerald-600 mr-2">☐</span>${line.substring(6)}</li>`;
        }
        if (line.startsWith("- [x]")) {
          return `<li class="ml-6 mb-2 list-none"><span class="text-emerald-600 mr-2">☑</span>${line.substring(6)}</li>`;
        }
        if (line.trim() === "") {
          return "<br />";
        }
        if (line.includes("[") && line.includes("](")) {
          const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (linkMatch) {
            const linkText = linkMatch[1];
            const linkUrl = linkMatch[2];
            return `<p class="mb-4 text-gray-700 leading-relaxed"><a href="${linkUrl}" class="text-emerald-600 hover:text-emerald-700 underline font-medium">${linkText}</a></p>`;
          }
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return `<p class="mb-4 text-gray-700 leading-relaxed font-semibold">${line.replace(/\*\*/g, "")}</p>`;
        }
        return `<p class="mb-4 text-gray-700 leading-relaxed">${line}</p>`;
      })
      .join("");
  };

  const formattedContent = formatContent(guide.content);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200/30 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs
            items={[
              { label: "Buying Guides", href: "/guides" },
              { label: guide.title, href: `/guides/${slug}` },
            ]}
          />
        </div>
      </div>

      {/* Hero Section with Featured Image */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={guide.featuredImage}
            alt={guide.title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-linear-to-br from-emerald-900/85 via-emerald-800/75 to-teal-900/85"></div>
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-lighten filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-lighten filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link href="/guides" className="inline-block mb-8">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm border border-white/30"
              >
                <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
                Back to Guides
              </Button>
            </Link>

            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30">
                <BookOpen className="h-4 w-4" />
                {guide.category} Guide
              </span>
            </div>

            {/* Guide Header */}
            <header className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                {guide.title}
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 leading-relaxed drop-shadow-lg">
                {guide.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-300" />
                  <span>{guide.readTime}</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-300" />
                  <span>{guide.topics.length} Topics Covered</span>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {guide.topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30"
                  >
                    <Tag className="h-3 w-3" />
                    {topic}
                  </span>
                ))}
              </div>
            </header>
          </div>
        </div>
      </section>

      {/* Guide Content */}
      <article className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 md:py-16 lg:py-20">

        {/* Guide Content */}
        <div
          className="prose prose-lg prose-emerald max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-emerald-600 prose-a:font-medium prose-a:underline hover:prose-a:text-emerald-700
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6
            prose-li:text-gray-700 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600
            bg-white rounded-2xl shadow-lg p-8 md:p-12 lg:p-16 border border-emerald-100"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />

        {/* Related Content Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Related Blog Posts
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/blog/how-to-choose-the-right-packaging-box"
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium group-hover:gap-3 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                    How to Choose the Right Packaging Box
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/cardboard-box-sizes-guide"
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium group-hover:gap-3 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Cardboard Box Sizes Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="group relative bg-white rounded-2xl p-8 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Shop Products
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/products"
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium group-hover:gap-3 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Browse All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium group-hover:gap-3 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                    View Categories
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </article>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070"
            alt="Professional packaging warehouse"
            fill
            className="object-cover"
            loading="lazy"
            quality={90}
          />
          <div className="absolute inset-0 bg-linear-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/90"></div>
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-lighten filter blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-lighten filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30">
              <Sparkles className="h-5 w-5 text-emerald-300" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">
                Ready to Shop
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
              Ready to Shop
              <span className="block bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mt-2">
                Packaging Supplies?
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-white/95 mb-12 leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
              Browse our complete range of packaging supplies with automatic bulk
              pricing and next-day delivery across the UK.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto shadow-2xl hover:shadow-emerald-500/50 text-lg px-8 py-6"
              >
                <Link href="/products">
                  Shop All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

