// With next-intl middleware active, this page is never reached in normal operation.
// The middleware rewrites all paths to the [locale] segment internally.
export default function RootPage() {
  return null;
}
