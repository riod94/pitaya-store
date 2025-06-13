import { useTranslations } from 'next-intl';

export default function TermsAndConditionsPage() {
  const t = useTranslations('Footer.terms');
  return (
    <main className="container mx-auto px-4 py-28 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
      <div className="prose">
        <p>{t('intro')}</p>
        <h2>{t('section1Title')}</h2>
        <p>{t('section1Content')}</p>
        <h2>{t('section2Title')}</h2>
        <p>{t('section2Content')}</p>
        {/* Tambahkan bagian lain sesuai kebutuhan */}
      </div>
    </main>
  );
}
