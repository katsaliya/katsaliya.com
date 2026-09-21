import { chromium } from 'playwright';

async function verifyHoverBehavior() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForSelector('.card', { timeout: 5000 });

    console.log('=== Testing at 1280px viewport ===');
    await testHoverAtViewport(page, 1280, '/tmp/hover_1280.png');

    await context.close();
    const context900 = await browser.newContext({ viewport: { width: 900, height: 800 } });
    const page900 = await context900.newPage();
    await page900.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    console.log('\n=== Testing at 900px viewport ===');
    await testHoverAtViewport(page900, 900, '/tmp/hover_900.png');

    await context900.close();
    const context390 = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page390 = await context390.newPage();
    await page390.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    console.log('\n=== Testing at 390px viewport (mobile) ===');
    await testHoverAtViewport(page390, 390, '/tmp/hover_390.png');

    await context390.close();
    console.log('\n✓ All viewport tests completed');
  } finally {
    await browser.close();
  }
}

async function testHoverAtViewport(page, width, screenshotPath) {
  try {
    const card = await page.$('.card');
    if (!card) {
      console.log('❌ No card found');
      return;
    }

    const mediaBeforeHover = await page.evaluate(() => {
      const media = document.querySelector('.media');
      if (!media) return null;
      const rect = media.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, height: rect.height };
    });
    console.log(`Before hover - Media bottom: ${mediaBeforeHover.bottom.toFixed(0)}, height: ${mediaBeforeHover.height.toFixed(0)}`);

    await card.hover();
    await page.waitForTimeout(700);

    const mediaAfterHover = await page.evaluate(() => {
      const media = document.querySelector('.media');
      if (!media) return null;
      const rect = media.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, height: rect.height };
    });
    console.log(`After hover - Media bottom: ${mediaAfterHover.bottom.toFixed(0)}, height: ${mediaAfterHover.height.toFixed(0)}`);

    const bottomMovement = Math.abs(mediaAfterHover.bottom - mediaBeforeHover.bottom);
    if (bottomMovement < 5) {
      console.log(`✓ Bottom edge stayed fixed (movement: ${bottomMovement.toFixed(1)}px)`);
    } else {
      console.log(`❌ Bottom edge moved (${bottomMovement.toFixed(1)}px)`);
    }

    const expectedHeight = mediaBeforeHover.height * 1.45;
    const heightDiff = Math.abs(mediaAfterHover.height - expectedHeight);
    if (heightDiff < 10) {
      console.log(`✓ Media scaled 1.45x (height: ${mediaAfterHover.height.toFixed(0)}px, expected: ${expectedHeight.toFixed(0)}px)`);
    } else {
      console.log(`❌ Media height mismatch (got ${mediaAfterHover.height.toFixed(0)}px, expected ~${expectedHeight.toFixed(0)}px)`);
    }

    const pills = await page.evaluate(() => {
      const pillElements = Array.from(document.querySelectorAll('.card-pill'));
      return pillElements.map(pill => {
        const opacity = window.getComputedStyle(pill).opacity;
        return { label: pill.textContent, opacity: parseFloat(opacity) };
      });
    });

    const visiblePills = pills.filter(p => p.opacity > 0.5);
    if (visiblePills.length === 4) {
      console.log(`✓ All 4 pills visible`);
    } else {
      console.log(`❌ Only ${visiblePills.length}/4 pills visible`);
    }

    const cardBodyOpacity = await page.evaluate(() => {
      const body = document.querySelector('.card-body');
      return parseFloat(window.getComputedStyle(body).opacity);
    });

    if (cardBodyOpacity >= 0.95) {
      console.log(`✓ Card body fully opaque (${cardBodyOpacity.toFixed(2)})`);
    } else {
      console.log(`❌ Card body opacity: ${cardBodyOpacity.toFixed(2)}`);
    }

    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot: ${screenshotPath}`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

verifyHoverBehavior().catch(console.error);
