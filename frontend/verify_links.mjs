import { chromium } from 'playwright';

async function verifyLinks() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    console.log('Verifying contact link hrefs...');
    
    const contactLinks = await page.$$('.hero-contact-link');
    const links = await Promise.all(contactLinks.map(async (link) => {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      return { text, href };
    }));

    links.forEach(({ text, href }) => {
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        console.log(`✓ ${text}: ${href}`);
      } else {
        console.log(`❌ ${text}: ${href} (invalid)`);
      }
    });

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

verifyLinks().catch(console.error);
