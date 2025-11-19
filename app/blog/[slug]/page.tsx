import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://bubblewrapshop.co.uk";

// Blog post content (can be moved to Sanity CMS later)
const blogPosts: Record<
  string,
  {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    publishedAt: string;
    readTime: string;
    featuredImage: string;
    tags: string[];
    author: string;
    seoTitle?: string;
    seoDescription?: string;
  }
> = {
  "how-to-choose-the-right-packaging-box": {
    title: "How to Choose the Right Packaging Box: Complete Guide 2024",
    excerpt:
      "Learn how to select the perfect cardboard box for your shipping needs. Size, strength, and material considerations for UK businesses.",
    category: "Buying Guides",
    publishedAt: "2024-12-15",
    readTime: "8 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: ["packaging boxes", "shipping", "cardboard boxes", "buying guide"],
    author: "Bubble Wrap Shop",
    seoTitle:
      "How to Choose the Right Packaging Box UK | Complete Buying Guide 2024",
    seoDescription:
      "Complete guide to choosing the right packaging box in the UK. Learn about box sizes, strength ratings, materials, and cost considerations for your shipping needs.",
    content: `
# How to Choose the Right Packaging Box: Complete Guide 2024

Choosing the right packaging box is crucial for protecting your products during shipping and ensuring they arrive safely to your customers. With so many options available in the UK market, it can be overwhelming to make the right choice. This comprehensive guide will help you select the perfect cardboard box for your specific needs.

## Understanding Box Types

### Single-Wall Cardboard Boxes
Single-wall boxes are the most common type of packaging box. They consist of one layer of fluted cardboard between two flat liners. These boxes are ideal for:
- Lightweight items (under 20kg)
- Short-distance shipping
- Cost-effective packaging solutions
- Standard retail products

### Double-Wall Cardboard Boxes
Double-wall boxes have two layers of fluted cardboard, providing extra strength and protection. Choose these for:
- Heavy items (20-40kg)
- Fragile products requiring extra protection
- Long-distance shipping
- Valuable items

### Triple-Wall Cardboard Boxes
Triple-wall boxes offer maximum protection with three layers of fluted cardboard. Use these for:
- Very heavy items (over 40kg)
- Industrial equipment
- International shipping
- Extremely fragile items

## Key Factors to Consider

### 1. Box Size
Selecting the correct box size is essential for both protection and cost efficiency:

- **Too Small**: Items won't fit or will be damaged
- **Too Large**: Wasted space, higher shipping costs, less protection
- **Perfect Fit**: Optimal protection and cost efficiency

**How to Measure:**
1. Measure the length, width, and height of your item
2. Add 2-5cm to each dimension for padding
3. Choose the closest standard box size

### 2. Box Strength (ECT Rating)
Edge Crush Test (ECT) rating indicates box strength:
- **32 ECT**: Standard strength for lightweight items
- **44 ECT**: Medium strength for average weight items
- **48 ECT**: High strength for heavy items
- **55+ ECT**: Maximum strength for very heavy items

### 3. Material Quality
Cardboard quality affects durability:
- **Kraft Paper**: Strong, brown cardboard (most common)
- **White Cardboard**: Clean appearance, slightly less strong
- **Recycled Cardboard**: Eco-friendly, variable strength

## UK Standard Box Sizes

Common box sizes available in the UK:

- **Small**: 20cm x 15cm x 10cm - Books, small electronics
- **Medium**: 30cm x 25cm x 20cm - Clothing, medium items
- **Large**: 40cm x 35cm x 30cm - Multiple items, larger products
- **Extra Large**: 50cm x 40cm x 35cm - Bulk items, large products

## Cost Considerations

### Bulk Pricing Benefits
- Ordering in bulk significantly reduces per-unit costs
- Many UK suppliers offer automatic bulk discounts
- Consider your annual packaging needs when ordering

### Material Costs
- Single-wall boxes: Most economical
- Double-wall boxes: 30-50% more expensive
- Triple-wall boxes: 50-100% more expensive

## Best Practices for UK Businesses

1. **Stock Multiple Sizes**: Keep 3-5 different box sizes in stock
2. **Consider Your Products**: Match box strength to item weight
3. **Factor in Shipping Costs**: Larger boxes cost more to ship
4. **Think About Branding**: Custom printed boxes enhance brand image
5. **Plan for Growth**: Order boxes that scale with your business

## Environmental Considerations

- Choose recyclable cardboard boxes
- Opt for boxes made from recycled materials
- Consider reusable packaging for B2B customers
- Minimize packaging waste by choosing right-sized boxes

## Where to Buy Packaging Boxes in the UK

When purchasing packaging boxes in the UK, consider:
- **Online Suppliers**: Convenient, bulk pricing available
- **Local Suppliers**: Faster delivery, support local business
- **Wholesale Options**: Best prices for large quantities
- **Custom Options**: Tailored solutions for specific needs

## Conclusion

Choosing the right packaging box requires careful consideration of size, strength, material, and cost. By understanding your specific needs and the options available, you can select boxes that protect your products while keeping costs manageable.

For UK businesses, working with a reliable packaging supplier that offers next-day delivery and bulk pricing can streamline your operations and reduce costs. Consider your shipping volume, product types, and budget when making your decision.

Ready to find the perfect packaging boxes for your business? [Browse our range of cardboard boxes](/products?category=shipping-boxes) with automatic bulk pricing and next-day delivery across the UK.
    `,
  },
  "bubble-wrap-vs-foam-which-is-better": {
    title: "Bubble Wrap vs Foam: Which Protective Packaging is Better?",
    excerpt:
      "Compare bubble wrap and foam packaging materials. Discover which option offers better protection, cost-effectiveness, and environmental impact for your business.",
    category: "Product Guides",
    publishedAt: "2024-12-10",
    readTime: "6 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: [
      "bubble wrap",
      "protective packaging",
      "foam packaging",
      "comparison",
    ],
    author: "Bubble Wrap Shop",
    seoTitle:
      "Bubble Wrap vs Foam Packaging: Which is Better for UK Businesses?",
    seoDescription:
      "Compare bubble wrap and foam packaging materials. Learn which offers better protection, cost-effectiveness, and environmental benefits for UK shipping needs.",
    content: `
# Bubble Wrap vs Foam: Which Protective Packaging is Better?

When it comes to protecting fragile items during shipping, two of the most popular options are bubble wrap and foam packaging. Both materials serve the same purpose but have distinct characteristics that make them suitable for different applications. This guide will help UK businesses choose the right protective packaging material.

## Understanding Bubble Wrap

Bubble wrap is a flexible plastic material with air-filled bubbles that provide cushioning and shock absorption.

### Advantages of Bubble Wrap
- **Lightweight**: Reduces overall shipping weight and costs
- **Flexible**: Conforms to irregular shapes easily
- **Reusable**: Can be reused multiple times if handled carefully
- **Cost-Effective**: Generally more affordable than foam
- **Easy to Use**: Simple to wrap around items
- **Good Shock Absorption**: Air bubbles provide excellent cushioning

### Disadvantages of Bubble Wrap
- **Less Dense Protection**: May not be sufficient for very heavy items
- **Environmental Concerns**: Made from plastic (though recyclable)
- **Can Pop**: Bubbles may burst under extreme pressure

## Understanding Foam Packaging

Foam packaging includes materials like expanded polystyrene (EPS), polyurethane foam, and packing peanuts.

### Advantages of Foam Packaging
- **Superior Protection**: Excellent shock absorption for fragile items
- **Lightweight Options**: Some foam types are very light
- **Moisture Resistance**: Certain foams resist water damage
- **Customizable**: Can be cut to exact shapes
- **Temperature Insulation**: Good for temperature-sensitive items

### Disadvantages of Foam Packaging
- **More Expensive**: Generally costs more than bubble wrap
- **Less Flexible**: Doesn't conform as easily to shapes
- **Environmental Impact**: Some foams are not easily recyclable
- **Takes More Space**: Can be bulkier than bubble wrap

## Comparison Table

| Factor | Bubble Wrap | Foam Packaging |
|--------|-------------|----------------|
| Cost | Lower | Higher |
| Weight | Light | Varies |
| Protection | Good | Excellent |
| Flexibility | High | Low-Medium |
| Reusability | Yes | Limited |
| Environmental | Recyclable | Varies |
| Ease of Use | Easy | Moderate |

## When to Use Bubble Wrap

Bubble wrap is ideal for:
- **Light to Medium Weight Items**: Electronics, glassware, ceramics
- **Irregular Shapes**: Items with curves or odd dimensions
- **Cost-Conscious Shipping**: When budget is a primary concern
- **Standard Fragile Items**: Most common shipping scenarios
- **UK Domestic Shipping**: Perfect for next-day delivery services

## When to Use Foam Packaging

Foam packaging is better for:
- **Very Fragile Items**: Delicate antiques, artwork, precision instruments
- **Heavy Items**: Items that need maximum protection
- **Temperature-Sensitive Items**: Products requiring insulation
- **Custom Fit Requirements**: Items needing exact shape matching
- **High-Value Shipments**: When protection is more important than cost

## Cost Analysis for UK Businesses

### Bubble Wrap Costs
- Standard bubble wrap: £0.50-£2.00 per square meter
- Heavy-duty bubble wrap: £1.50-£3.50 per square meter
- Bulk pricing available for large orders

### Foam Packaging Costs
- Packing peanuts: £1.00-£3.00 per liter
- Foam sheets: £2.00-£5.00 per square meter
- Custom foam inserts: £10-£50+ per item

## Environmental Considerations

### Bubble Wrap
- **Recyclable**: Can be recycled at most UK recycling centers
- **Reusable**: Can be used multiple times
- **Plastic Content**: Made from plastic materials

### Foam Packaging
- **Variable Recyclability**: Depends on foam type
- **EPS Foam**: Recyclable but not widely accepted
- **Biodegradable Options**: Some eco-friendly alternatives available

## Best Practices for UK Shipping

1. **Combine Materials**: Use bubble wrap for wrapping and foam for void fill
2. **Match Protection to Value**: Higher value items may need foam
3. **Consider Shipping Distance**: Longer distances may require extra protection
4. **Factor in Costs**: Balance protection needs with budget constraints
5. **Think About Customer Experience**: Easy-to-remove packaging is appreciated

## Real-World Applications

### E-commerce Businesses
- **Bubble Wrap**: Perfect for most online retail shipments
- **Cost-effective for high-volume shipping**
- **Easy for warehouse staff to use**

### B2B Shipping
- **Foam Packaging**: Better for industrial equipment
- **Custom foam inserts for consistent products**
- **Professional appearance**

### Art and Antiques
- **Foam Packaging**: Essential for maximum protection
- **Custom-cut foam inserts**
- **Temperature and humidity control**

## Making Your Decision

Consider these factors:
1. **Item Fragility**: How delicate is your product?
2. **Shipping Distance**: Local vs international?
3. **Budget Constraints**: Cost per shipment?
4. **Volume**: How many items do you ship?
5. **Environmental Goals**: Sustainability priorities?

## Conclusion

Both bubble wrap and foam packaging have their place in protective packaging. For most UK businesses shipping standard products, bubble wrap offers an excellent balance of protection, cost, and ease of use. However, for very fragile, high-value, or temperature-sensitive items, foam packaging may be worth the additional investment.

The best approach is often a combination: use bubble wrap for wrapping items and foam for void fill or custom protection. This provides optimal protection while managing costs effectively.

[Shop bubble wrap](/products?category=bubble-wrap) and [protective packaging materials](/products?category=protective-materials) with next-day delivery across the UK.
    `,
  },
  "packaging-tips-for-fragile-items": {
    title:
      "10 Essential Packaging Tips for Fragile Items: Protect Your Shipments",
    excerpt:
      "Expert tips for packaging fragile items safely. Learn proper wrapping techniques, box selection, and padding methods to prevent damage during shipping.",
    category: "Packaging Tips",
    publishedAt: "2024-12-05",
    readTime: "7 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: ["fragile items", "packaging tips", "shipping safety", "protection"],
    author: "Bubble Wrap Shop",
    seoTitle:
      "10 Essential Packaging Tips for Fragile Items UK | Shipping Guide",
    seoDescription:
      "Expert tips for packaging fragile items safely in the UK. Learn proper wrapping techniques, box selection, and padding methods to prevent shipping damage.",
    content: `
# 10 Essential Packaging Tips for Fragile Items: Protect Your Shipments

Shipping fragile items requires careful planning and proper techniques to ensure they arrive safely. Whether you're shipping glassware, electronics, ceramics, or artwork, these expert tips will help you package fragile items correctly and reduce the risk of damage during transit.

## 1. Choose the Right Box Size

Selecting the correct box size is crucial for fragile items:

- **Too Small**: Items will be cramped and more likely to break
- **Too Large**: Items will move around and get damaged
- **Perfect Fit**: Leave 5-8cm of space on all sides for padding

**Rule of Thumb**: Your item should fit comfortably with enough room for protective padding on all sides.

## 2. Use Multiple Layers of Protection

Don't rely on a single layer of protection. Use a combination of:

- **Inner Layer**: Wrap item directly (bubble wrap or foam)
- **Middle Layer**: Additional padding around wrapped item
- **Outer Layer**: Sturdy box with void fill

## 3. Wrap Items Individually

If shipping multiple fragile items:

- Wrap each item separately
- Prevent items from touching each other
- Use dividers or individual compartments
- Consider separate boxes for very fragile items

## 4. Use Proper Padding Materials

Choose the right padding for your items:

- **Bubble Wrap**: Best for most fragile items
- **Foam Sheets**: For extra protection
- **Packing Paper**: For lightweight items
- **Air Cushions**: For void fill in larger boxes

## 5. Fill All Empty Spaces

Void fill is essential to prevent movement:

- Fill bottom of box with padding
- Surround item completely with padding
- Fill top space before sealing
- Items should not move when box is shaken

## 6. Use Double Boxing for Very Fragile Items

For extremely delicate items:

- Wrap item in inner box with padding
- Place inner box in larger outer box
- Fill space between boxes with padding
- Provides extra protection against impacts

## 7. Seal Boxes Properly

Proper sealing prevents boxes from opening:

- Use strong packing tape (not regular tape)
- Apply tape in H-pattern on top and bottom
- Use at least 3 strips of tape per side
- Reinforce corners and edges

## 8. Label Boxes Correctly

Clear labeling helps handlers:

- Mark "FRAGILE" on all sides
- Add "HANDLE WITH CARE" labels
- Include "THIS SIDE UP" if applicable
- Use arrows to indicate orientation

## 9. Consider Box Strength

Match box strength to item weight:

- **Light Items**: Single-wall cardboard
- **Medium Items**: Double-wall cardboard
- **Heavy Items**: Triple-wall cardboard
- Check ECT rating for strength

## 10. Test Your Packaging

Before shipping valuable items:

- Shake the box - items shouldn't move
- Apply gentle pressure - box shouldn't collapse
- Check for gaps - all spaces should be filled
- Verify seals - tape should be secure

## Special Considerations for UK Shipping

### Next-Day Delivery
- Use extra protection for express shipping
- Consider double boxing for urgent shipments
- Ensure packaging can withstand faster handling

### Weather Protection
- Use weather-resistant materials for outdoor items
- Consider plastic wrapping for moisture protection
- Use waterproof tape for outdoor shipments

### Carrier Requirements
- Check carrier guidelines for fragile items
- Some carriers require special handling labels
- Insurance may be required for high-value items

## Common Mistakes to Avoid

1. **Insufficient Padding**: Not using enough protective material
2. **Wrong Box Size**: Too large or too small boxes
3. **Poor Sealing**: Weak tape or insufficient tape
4. **No Void Fill**: Empty spaces allowing movement
5. **Incorrect Labeling**: Missing fragile labels
6. **Reusing Weak Boxes**: Using damaged or worn boxes
7. **Mixing Items**: Fragile and non-fragile items together
8. **Inadequate Protection**: Underestimating shipping risks

## Cost vs Protection Balance

While protection is important, consider costs:

- **Standard Protection**: Suitable for most items
- **Enhanced Protection**: For valuable or very fragile items
- **Maximum Protection**: For irreplaceable items

Balance your protection needs with shipping costs and item value.

## UK Shipping Best Practices

1. **Use UK Suppliers**: Faster delivery, better support
2. **Bulk Ordering**: Save on packaging costs
3. **Standard Sizes**: Easier to source and stock
4. **Quality Materials**: Invest in good packaging
5. **Regular Review**: Update packaging based on damage rates

## Conclusion

Proper packaging of fragile items requires attention to detail and the right materials. By following these ten essential tips, you can significantly reduce the risk of damage during shipping and ensure your fragile items arrive safely at their destination.

Remember: It's better to over-protect than to risk damage. The cost of additional packaging is minimal compared to the cost of replacing damaged items and losing customer trust.

[Shop protective packaging materials](/products?category=protective-materials) with next-day delivery across the UK to protect your fragile shipments.
    `,
  },
  "eco-friendly-packaging-alternatives": {
    title:
      "Eco-Friendly Packaging Alternatives: Sustainable Solutions for UK Businesses",
    excerpt:
      "Discover sustainable packaging materials that reduce environmental impact. Learn about recyclable, biodegradable, and compostable packaging options available in the UK.",
    category: "Sustainability",
    publishedAt: "2024-11-28",
    readTime: "9 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: [
      "eco-friendly",
      "sustainability",
      "green packaging",
      "environmental",
    ],
    author: "Bubble Wrap Shop",
    seoTitle:
      "Eco-Friendly Packaging Alternatives UK | Sustainable Packaging Guide",
    seoDescription:
      "Discover sustainable packaging solutions for UK businesses. Learn about recyclable, biodegradable, and compostable packaging materials to reduce environmental impact.",
    content: `
# Eco-Friendly Packaging Alternatives: Sustainable Solutions for UK Businesses

As environmental awareness grows, UK businesses are increasingly seeking sustainable packaging solutions. This guide explores eco-friendly packaging alternatives that reduce environmental impact while maintaining protection and functionality.

## Why Choose Eco-Friendly Packaging?

### Environmental Benefits
- **Reduced Waste**: Less material going to landfills
- **Lower Carbon Footprint**: Reduced manufacturing emissions
- **Resource Conservation**: Using renewable or recycled materials
- **Biodegradability**: Materials that break down naturally

### Business Benefits
- **Customer Appeal**: Growing demand for sustainable products
- **Brand Image**: Demonstrates environmental responsibility
- **Cost Savings**: Some eco-friendly options are cost-effective
- **Compliance**: Meeting environmental regulations

## Types of Eco-Friendly Packaging

### 1. Recycled Cardboard Boxes
Made from recycled paper and cardboard:

- **Benefits**: Fully recyclable, widely available, cost-effective
- **Best For**: Most shipping applications
- **UK Availability**: Readily available from UK suppliers
- **Recycling**: Accepted at all UK recycling centers

### 2. Biodegradable Bubble Wrap
Alternative to traditional plastic bubble wrap:

- **Benefits**: Breaks down naturally, similar protection
- **Best For**: Standard fragile item protection
- **Limitations**: May be slightly more expensive
- **Availability**: Growing selection in UK market

### 3. Paper-Based Packaging
Made from renewable paper sources:

- **Paper Void Fill**: Shredded paper for padding
- **Paper Tape**: Adhesive tape made from paper
- **Kraft Paper**: Strong brown paper for wrapping
- **Benefits**: Fully recyclable, renewable resource

### 4. Compostable Packaging
Materials that break down in composting conditions:

- **Cornstarch Packing Peanuts**: Dissolve in water
- **Mushroom Packaging**: Made from mycelium
- **Plant-Based Plastics**: Derived from renewable sources
- **Best For**: Items shipped to environmentally conscious customers

### 5. Reusable Packaging
Packaging designed for multiple uses:

- **Returnable Boxes**: Customers return for reuse
- **Durable Materials**: Stronger construction for longevity
- **Best For**: B2B shipping, subscription services
- **Benefits**: Long-term cost savings, zero waste

## UK-Specific Considerations

### Recycling Infrastructure
UK has excellent recycling facilities:
- Most local councils accept cardboard and paper
- Many areas have separate recycling collections
- Recycling rates improving across the UK

### Consumer Expectations
UK consumers increasingly value:
- Sustainable packaging choices
- Clear recycling instructions
- Minimal packaging waste
- Environmental certifications

## Cost Comparison

### Traditional Packaging
- Standard bubble wrap: Lower initial cost
- Plastic void fill: Very affordable
- Regular cardboard: Most economical

### Eco-Friendly Alternatives
- Recycled cardboard: Similar cost to regular
- Biodegradable bubble wrap: 10-20% more expensive
- Paper void fill: Similar or lower cost
- Compostable materials: 20-50% more expensive

## Implementation Strategy

### Phase 1: Easy Wins
1. Switch to recycled cardboard boxes
2. Use paper-based void fill
3. Replace plastic tape with paper tape
4. Add recycling instructions to packages

### Phase 2: Material Upgrades
1. Try biodegradable bubble wrap
2. Test compostable packing peanuts
3. Explore plant-based alternatives
4. Consider reusable packaging options

### Phase 3: Complete Transition
1. Full eco-friendly packaging line
2. Sustainable supplier partnerships
3. Customer education programs
4. Environmental impact tracking

## Best Practices for UK Businesses

1. **Start Small**: Begin with one product line
2. **Test Thoroughly**: Ensure protection isn't compromised
3. **Communicate**: Tell customers about your efforts
4. **Monitor Costs**: Track packaging expenses
5. **Gather Feedback**: Listen to customer responses

## Common Misconceptions

### "Eco-Friendly Means Less Protection"
- Modern eco-friendly materials offer excellent protection
- Many alternatives match traditional material performance
- Proper packaging techniques matter more than material type

### "It's Too Expensive"
- Many eco-friendly options are cost-competitive
- Bulk pricing available for sustainable materials
- Long-term savings from reduced waste

### "Limited Availability"
- UK market has excellent eco-friendly options
- Many suppliers offer sustainable alternatives
- Growing selection of materials

## Certifications to Look For

When choosing eco-friendly packaging:
- **FSC Certified**: Forest Stewardship Council
- **PEFC Certified**: Programme for Endorsement of Forest Certification
- **Recycled Content**: Percentage of recycled materials
- **Compostable Certification**: Meets composting standards

## Real-World Examples

### E-commerce Success Stories
Many UK e-commerce businesses have successfully transitioned:
- Reduced packaging waste by 30-50%
- Improved customer satisfaction scores
- Enhanced brand reputation
- Maintained protection standards

## Making the Switch

### Step 1: Assess Current Packaging
- Identify all packaging materials used
- Calculate current costs
- Review damage rates
- Understand customer preferences

### Step 2: Research Alternatives
- Explore eco-friendly options
- Compare costs and performance
- Test sample materials
- Check UK supplier availability

### Step 3: Pilot Program
- Start with one product category
- Monitor performance closely
- Gather customer feedback
- Adjust as needed

### Step 4: Full Implementation
- Roll out across all products
- Update packaging procedures
- Train staff on new materials
- Communicate changes to customers

## Conclusion

Eco-friendly packaging alternatives offer UK businesses an opportunity to reduce environmental impact while maintaining product protection and customer satisfaction. With a wide range of options available, businesses can find sustainable solutions that fit their needs and budget.

The key is to start with easy wins and gradually expand your eco-friendly packaging program. Many sustainable materials now offer protection and cost-effectiveness comparable to traditional options, making the transition easier than ever.

[Browse our eco-friendly packaging options](/products?ecoFriendly=true) with next-day delivery across the UK.
    `,
  },
  "how-to-calculate-packaging-costs": {
    title: "How to Calculate Packaging Costs: Save Money on Shipping Supplies",
    excerpt:
      "Learn how to calculate and reduce your packaging costs. Understand bulk pricing, material costs, and strategies to optimize your packaging budget.",
    category: "Packaging Tips",
    publishedAt: "2024-11-20",
    readTime: "5 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: ["packaging costs", "budget", "bulk pricing", "cost savings"],
    author: "Bubble Wrap Shop",
    seoTitle:
      "How to Calculate Packaging Costs UK | Save Money on Shipping Supplies",
    seoDescription:
      "Learn how to calculate and reduce packaging costs for UK businesses. Understand bulk pricing, material costs, and strategies to optimize your shipping budget.",
    content: `
# How to Calculate Packaging Costs: Save Money on Shipping Supplies

Understanding and managing packaging costs is essential for UK businesses looking to optimize their shipping operations. This guide will help you calculate packaging costs accurately and identify opportunities to save money.

## Components of Packaging Costs

### 1. Box Costs
The primary container for your products:
- **Single-Wall Boxes**: £0.20-£1.50 per box
- **Double-Wall Boxes**: £0.50-£3.00 per box
- **Custom Boxes**: £1.00-£5.00+ per box

### 2. Protective Materials
Materials to protect items during shipping:
- **Bubble Wrap**: £0.50-£2.00 per square meter
- **Foam Padding**: £1.00-£3.00 per square meter
- **Void Fill**: £0.10-£0.50 per liter

### 3. Sealing Materials
Tapes and labels for securing packages:
- **Packing Tape**: £2.00-£5.00 per roll
- **Labels**: £0.05-£0.20 per label
- **Custom Labels**: £0.10-£0.50 per label

### 4. Additional Materials
Other packaging components:
- **Tissue Paper**: £0.05-£0.15 per sheet
- **Bubble Mailers**: £0.30-£1.50 per mailer
- **Poly Bags**: £0.10-£0.50 per bag

## Calculating Total Packaging Cost

### Formula
**Total Cost per Shipment = Box Cost + Protective Materials + Sealing Materials + Additional Materials**

### Example Calculation
For a standard UK shipment:
- Box (medium): £0.80
- Bubble wrap (2 sq meters): £1.50
- Packing tape: £0.10
- Void fill: £0.20
- **Total: £2.60 per shipment**

## Factors Affecting Packaging Costs

### 1. Order Volume
- **Small Orders (1-100 boxes)**: Higher per-unit cost
- **Medium Orders (100-1000 boxes)**: Moderate discounts
- **Large Orders (1000+ boxes)**: Significant bulk discounts

### 2. Box Size
- Larger boxes cost more
- Oversized boxes increase shipping costs
- Right-sized boxes optimize total cost

### 3. Material Quality
- Premium materials cost more
- Standard materials offer good value
- Balance quality with cost

### 4. Supplier Choice
- Online suppliers: Often lower prices
- Local suppliers: May have higher prices but faster delivery
- Wholesale suppliers: Best prices for bulk orders

## Cost Optimization Strategies

### 1. Bulk Ordering
Ordering in larger quantities reduces per-unit costs:
- **10-20% discount**: Orders over 500 units
- **20-30% discount**: Orders over 1000 units
- **30%+ discount**: Orders over 5000 units

### 2. Right-Sizing Boxes
Using correctly sized boxes saves money:
- Reduces material waste
- Lowers shipping costs
- Improves protection

### 3. Material Efficiency
Using materials efficiently:
- Don't over-pad items
- Use appropriate protection levels
- Avoid unnecessary materials

### 4. Supplier Negotiation
Negotiate better prices:
- Commit to regular orders
- Combine product orders
- Build long-term relationships

## UK-Specific Cost Considerations

### VAT
- Most packaging materials are subject to 20% VAT
- Factor VAT into cost calculations
- B2B customers can reclaim VAT

### Shipping Costs
- Packaging weight affects shipping costs
- Lighter materials reduce shipping expenses
- Consider total cost, not just material cost

### Storage Costs
- Bulk ordering requires storage space
- Factor storage costs into calculations
- Balance bulk savings with storage expenses

## Cost Comparison Examples

### Small Business (50 shipments/month)
- Standard packaging: £2.50 per shipment
- Monthly cost: £125
- Annual cost: £1,500

### Medium Business (500 shipments/month)
- Standard packaging: £2.20 per shipment (bulk discount)
- Monthly cost: £1,100
- Annual cost: £13,200

### Large Business (5000 shipments/month)
- Standard packaging: £1.80 per shipment (volume discount)
- Monthly cost: £9,000
- Annual cost: £108,000

## Hidden Costs to Consider

### 1. Damage Costs
Poor packaging leads to:
- Product replacements
- Customer refunds
- Lost business
- Reputation damage

### 2. Labor Costs
Time spent on packaging:
- Packing time per order
- Material handling
- Quality control
- Training costs

### 3. Storage Costs
Holding packaging inventory:
- Warehouse space
- Inventory management
- Capital tied up

## ROI of Quality Packaging

Investing in quality packaging:
- **Reduces Damage**: Saves replacement costs
- **Improves Efficiency**: Faster packing
- **Enhances Brand**: Better customer experience
- **Builds Trust**: Professional appearance

## Budget Planning Tips

1. **Track Costs**: Monitor packaging expenses monthly
2. **Set Targets**: Aim for cost reduction goals
3. **Review Regularly**: Adjust based on volume changes
4. **Compare Suppliers**: Regularly check market prices
5. **Optimize Continuously**: Look for improvement opportunities

## Conclusion

Calculating and optimizing packaging costs requires understanding all components and finding the right balance between cost, protection, and efficiency. By implementing bulk ordering, right-sizing, and efficient material use, UK businesses can significantly reduce packaging costs while maintaining quality.

Remember: The cheapest packaging isn't always the most cost-effective. Consider total costs including damage, shipping, and customer satisfaction when making packaging decisions.

[Shop packaging supplies with automatic bulk pricing](/products) to save on your packaging costs.
    `,
  },
  "cardboard-box-sizes-guide": {
    title: "Cardboard Box Sizes Guide: Find the Perfect Box for Your Products",
    excerpt:
      "Complete guide to UK cardboard box sizes. Learn standard dimensions, how to measure your products, and choose the right box size for efficient shipping.",
    category: "Buying Guides",
    publishedAt: "2024-11-15",
    readTime: "6 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1200",
    tags: ["cardboard boxes", "box sizes", "shipping boxes", "dimensions"],
    author: "Bubble Wrap Shop",
    seoTitle:
      "Cardboard Box Sizes Guide UK | Standard Dimensions & How to Choose",
    seoDescription:
      "Complete guide to UK cardboard box sizes. Learn standard dimensions, how to measure products, and choose the right box size for efficient shipping in the UK.",
    content: `
# Cardboard Box Sizes Guide: Find the Perfect Box for Your Products

Choosing the right cardboard box size is essential for efficient shipping, cost management, and product protection. This comprehensive guide covers UK standard box sizes and how to select the perfect box for your products.

## Understanding Box Dimensions

Cardboard boxes are measured in three dimensions:
- **Length (L)**: The longest side
- **Width (W)**: The shorter side
- **Height (H)**: The vertical dimension

Dimensions are typically listed as: Length × Width × Height (in centimeters)

## UK Standard Box Sizes

### Small Boxes
**20cm × 15cm × 10cm**
- Best for: Books, small electronics, jewelry
- Weight capacity: Up to 5kg
- Common uses: E-commerce small items

**25cm × 20cm × 15cm**
- Best for: Clothing, accessories, small gifts
- Weight capacity: Up to 8kg
- Common uses: Retail shipping

### Medium Boxes
**30cm × 25cm × 20cm**
- Best for: Multiple items, medium electronics
- Weight capacity: Up to 15kg
- Common uses: Standard e-commerce shipping

**35cm × 30cm × 25cm**
- Best for: Larger items, multiple products
- Weight capacity: Up to 20kg
- Common uses: Bulk orders, larger products

### Large Boxes
**40cm × 35cm × 30cm**
- Best for: Large items, multiple products
- Weight capacity: Up to 25kg
- Common uses: Home goods, bulk orders

**50cm × 40cm × 35cm**
- Best for: Very large items, furniture parts
- Weight capacity: Up to 30kg
- Common uses: Industrial shipping

### Extra Large Boxes
**60cm × 50cm × 40cm**
- Best for: Large appliances, bulk shipments
- Weight capacity: Up to 40kg
- Common uses: B2B shipping, large products

## How to Measure Your Product

### Step 1: Measure Item Dimensions
1. Measure length (longest side)
2. Measure width (shorter side)
3. Measure height (vertical dimension)

### Step 2: Add Padding Space
Add 2-5cm to each dimension for:
- Protective padding
- Bubble wrap or foam
- Safe handling space

### Step 3: Select Box Size
Choose the smallest standard box that accommodates your item with padding.

## Box Size Selection Guide

### For Books and Media
- **Small (20×15×10cm)**: Single book
- **Medium (30×25×20cm)**: Multiple books
- **Large (40×35×30cm)**: Book sets, large volumes

### For Electronics
- **Small (25×20×15cm)**: Small devices, accessories
- **Medium (35×30×25cm)**: Tablets, laptops
- **Large (50×40×35cm)**: Monitors, large electronics

### For Clothing
- **Small (25×20×15cm)**: Single items
- **Medium (35×30×25cm)**: Multiple items
- **Large (40×35×30cm)**: Bulk clothing orders

### For Fragile Items
- **Add Extra Space**: Use larger box for more padding
- **Double Boxing**: Consider for very fragile items
- **Protective Materials**: Factor in bubble wrap thickness

## Cost Implications

### Box Size and Shipping Costs
- **Larger Boxes**: Higher shipping costs
- **Oversized Boxes**: Additional surcharges
- **Right-Sized Boxes**: Optimal cost efficiency

### Material Costs
- **Small Boxes**: £0.20-£0.50 each
- **Medium Boxes**: £0.50-£1.50 each
- **Large Boxes**: £1.00-£3.00 each
- **Extra Large**: £2.00-£5.00+ each

## UK Shipping Considerations

### Royal Mail Size Limits
- **Small Parcel**: Up to 45cm × 35cm × 16cm
- **Medium Parcel**: Up to 61cm × 46cm × 46cm
- **Large Parcel**: Up to 100cm × 70cm × 50cm

### Courier Size Limits
- Most couriers accept up to 120cm in any dimension
- Some have weight restrictions
- Check specific carrier requirements

## Common Mistakes

### 1. Choosing Box Too Small
- Items don't fit properly
- Increased risk of damage
- Difficult to pack

### 2. Choosing Box Too Large
- Wasted space and materials
- Higher shipping costs
- Less protection (items move around)

### 3. Not Considering Weight
- Box strength must match item weight
- Heavy items need stronger boxes
- Check weight capacity ratings

## Best Practices

1. **Stock Multiple Sizes**: Keep 3-5 different sizes
2. **Measure Accurately**: Use proper measuring tools
3. **Factor in Padding**: Always add space for protection
4. **Consider Weight**: Match box strength to item weight
5. **Test Before Ordering**: Try sample sizes first

## Custom Box Sizes

When standard sizes don't fit:
- **Custom Boxes**: Made to exact specifications
- **Higher Cost**: Typically 2-3x standard box price
- **Minimum Orders**: Usually 100+ boxes required
- **Lead Time**: 1-2 weeks for production

## Conclusion

Selecting the right cardboard box size requires careful measurement and consideration of your product dimensions, weight, and shipping requirements. By understanding UK standard sizes and following proper measurement techniques, you can optimize both protection and costs.

Remember: The perfect box size provides adequate protection while minimizing material use and shipping costs. Investing time in proper box selection pays off in reduced damage, lower costs, and improved customer satisfaction.

[Browse our range of cardboard boxes in various sizes](/products?category=shipping-boxes) with next-day delivery across the UK.
    `,
  },
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: "Blog Post Not Found | Bubble Wrap Shop",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  const postTitle = post.seoTitle || post.title;
  const postDescription = post.seoDescription || post.excerpt;
  const postUrl = `${siteUrl}/blog/${slug}`;

  return {
    title: `${postTitle} | Bubble Wrap Shop`,
    description: postDescription,
    keywords: [
      ...post.tags,
      "packaging blog",
      "packaging tips UK",
      "packaging guides",
    ],
    openGraph: {
      title: postTitle,
      description: postDescription,
      url: postUrl,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: postTitle,
      description: postDescription,
      images: [post.featuredImage],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  // Convert markdown-like content to HTML (simplified - in production, use a markdown parser)
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
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return `<li class="ml-6 mb-2">${line.substring(2)}</li>`;
        }
        if (line.trim() === "") {
          return "<br />";
        }
        if (line.startsWith("|")) {
          // Table row - skip for now, would need proper table parsing
          return "";
        }
        if (line.includes("[") && line.includes("](")) {
          // Link parsing
          const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (linkMatch) {
            const linkText = linkMatch[1];
            const linkUrl = linkMatch[2];
            return `<p class="mb-4 text-gray-700 leading-relaxed"><a href="${linkUrl}" class="text-emerald-600 hover:text-emerald-700 underline font-medium">${linkText}</a></p>`;
          }
        }
        return `<p class="mb-4 text-gray-700 leading-relaxed">${line}</p>`;
      })
      .join("");
  };

  const formattedContent = formatContent(post.content);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Breadcrumbs */}
      <div className="relative z-10 border-b border-emerald-200/30 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-6">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title, href: `/blog/${slug}` },
            ]}
          />
        </div>
      </div>

      {/* Hero Section with Featured Image */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={post.featuredImage}
            alt={post.title}
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
            <Link href="/blog" className="inline-block mb-8">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm border border-white/30"
              >
                <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
                Back to Blog
              </Button>
            </Link>

            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30">
                <BookOpen className="h-4 w-4" />
                {post.category}
              </span>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                {post.title}
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 leading-relaxed drop-shadow-lg">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-300" />
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-300" />
                  <span>{post.readTime}</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-300" />
                  <span>{post.author}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </header>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 md:py-16 lg:py-20">
        {/* Article Content */}
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
                Related Guides
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/guides/packaging-boxes-guide"
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium group-hover:gap-3 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Complete Guide to Buying Packaging Boxes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides/bubble-wrap-guide"
                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium group-hover:gap-3 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Bubble Wrap Buying Guide
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
              Browse our complete range of packaging supplies with automatic
              bulk pricing and next-day delivery across the UK.
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
