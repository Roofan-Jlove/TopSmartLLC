import { LegalPage } from '@/components/sections/LegalPage';
import { termsOfService } from '@/data/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: termsOfService.title,
  description: termsOfService.description,
  path: termsOfService.path,
});

export default function Page() {
  return <LegalPage document={termsOfService} />;
}
