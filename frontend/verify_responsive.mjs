import { chromium } from 'playwright';

async function verifyResponsive() {
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { width: 1280, height: 800, name: '1280px (desktop)' },
    { width: 900, height: 800, name: '900px (tablet)' },
    { width: 390, height: 844, name: '390px (mobile)' }
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();

    try {
      console.log(`\n=== Testing at ${viewport.name} ===`);
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

      // Check if all hero elements are visible
      const elements = {
        logo: '.hero-logo-mark',
        caption: '.hero-thai-caption',
        headline: '.hero-headline',
        body: '.hero-body',
        links: '.hero-contact-links',
        cta: '.work-hero__cta'
      };

      for (const [name, selector] of Object.entries(elements)) {
        const el = await page.$(selector);
        if (el) {
          const visible = await el.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return rect.top >= -100 && rect.top <= viewport.height + 100;
          });
          console.log(`${visible ? '✓' : '⚠'} ${name} (${selector})`);
        } else {
          console.log(`❌ ${name} not found`);
        }
      }

      // Take screenshot
      const path = `/tmp/hero_responsive_${viewport.width}.png`;
      await page.screenshot({ path });
      console.log(`📸 Screenshot: ${path}`);

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\n✓ Responsive verification complete');
}

verifyResponsive().catch(console.error);
