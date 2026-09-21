import { chromium } from 'playwright';

async function verifyHero() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    console.log('Verifying hero structure...');
    
    // Check if logo mark exists
    const logoMark = await page.$('.hero-logo-mark');
    if (logoMark) {
      console.log('✓ Logo mark present');
    } else {
      console.log('❌ Logo mark missing');
    }

    // Check if Thai caption exists
    const thaiCaption = await page.$('.hero-thai-caption');
    if (thaiCaption) {
      const text = await thaiCaption.textContent();
      console.log(`✓ Thai caption present: "${text}"`);
    } else {
      console.log('❌ Thai caption missing');
    }

    // Check if headline exists
    const headline = await page.$('.hero-headline');
    if (headline) {
      const text = await headline.textContent();
      console.log(`✓ Headline present: "${text}"`);
    } else {
      console.log('❌ Headline missing');
    }

    // Check if body paragraph exists
    const body = await page.$('.hero-body');
    if (body) {
      console.log('✓ Body paragraph present');
    } else {
      console.log('❌ Body paragraph missing');
    }

    // Check if contact links exist
    const contactLinks = await page.$$('.hero-contact-link');
    if (contactLinks.length === 4) {
      const labels = await Promise.all(contactLinks.map(link => link.textContent()));
      console.log(`✓ Contact links present: ${labels.join(', ')}`);
    } else {
      console.log(`❌ Contact links: found ${contactLinks.length}, expected 4`);
    }

    // Check if background motifs exist
    const bgMotifs = await page.$$('.hero-bg-motif');
    if (bgMotifs.length === 2) {
      console.log('✓ Background motifs present (2)');
    } else {
      console.log(`❌ Background motifs: found ${bgMotifs.length}, expected 2`);
    }

    // Check if work section is visible
    const workSection = await page.$('.cards-section');
    if (workSection) {
      const visible = await workSection.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.top < 800;
      });
      if (!visible) {
        console.log('✓ Work section not visible on first paint');
      } else {
        console.log('❌ Work section visible (should be below fold)');
      }
    }

    // Take screenshot
    await page.screenshot({ path: '/tmp/hero_1280.png' });
    console.log('📸 Screenshot saved to /tmp/hero_1280.png');

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

verifyHero().catch(console.error);
