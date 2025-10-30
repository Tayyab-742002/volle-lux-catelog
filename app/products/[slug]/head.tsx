import { getProductBySlug } from "@/services/products/product.service";

export default async function Head({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  const hero = product?.image || product?.images?.[0];

  return (
    <>
      {hero ? (
        <link
          rel="preload"
          as="image"
          href={hero}
          imageSrcSet={`${hero} 1200w`}
          imageSizes="100vw"
          fetchPriority="high"
        />
      ) : null}
    </>
  );
}
