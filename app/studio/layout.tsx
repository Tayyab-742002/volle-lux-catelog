/**
 * Separate layout for Sanity Studio
 * This layout is minimal - the root layout handles html/body structure
 * and conditionally excludes header/footer for studio routes
 */

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is intentionally minimal
  // The root layout (app/layout.tsx) handles the html/body structure
  // and conditionally excludes header/footer for /studio routes
  return <>{children}</>;
}
