const { chromium } = require('playwright');
const fs = require('fs');

async function verifyHoverBehavior() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Wait for cards to load
    await page.waitForSelector('.card', { timeout: 5000 });

    // Test at 1280px width
    console.log('=== Testing at 1280px viewport ===');
    await testHoverAtViewport(page, 1280, '/tmp/hover_1280.png');

    // Change viewport to ~900px
    await page.setViewportSize({ width: 900, height: 800 });
    console.log('=== Testing at 900px viewport ===');
    await testHoverAtViewport(page, 900, '/tmp/hover_900.png');

    // Change viewport to mobile (~390px)
    await page.setViewportSize({ width: 390, height: 844 });
    console.log('=== Testing at 390px viewport (mobile) ===');
    await testHoverAtViewport(page, 390, '/tmp/hover_390.png');

    console.log('✓ All viewport tests completed');

  } finally {
    await browser.close();
  }
}

async function testHoverAtViewport(page, width, screenshotPath) {
  try {
    // Get first card
    const card = await page.$('.card');
    if (!card) {
      console.log('❌ No card found');
      return;
    }

    // Get media element before hover
    const mediaBeforeHover = await page.evaluate(() => {
      const media = document.querySelector('.media');
      if (!media) return null;
      const rect = media.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, height: rect.height };
    });
    console.log(`Before hover - Media position: top=${mediaBeforeHover.top}, bottom=${mediaBeforeHover.bottom}, height=${mediaBeforeHover.height}`);

    // Hover over card
    await card.hover();
    await page.waitForTimeout(600); // Wait for animation

    // Get media element after hover
    const mediaAfterHover = await page.evaluate(() => {
      const media = document.querySelector('.media');
      if (!media) return null;
      const rect = media.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, height: rect.height };
    });
    console.log(`After hover - Media position: top=${mediaAfterHover.top}, bottom=${mediaAfterHover.bottom}, height=${mediaAfterHover.height}`);

    // Verify media grows upward (bottom stays same)
    const bottomMovement = Math.abs(mediaAfterHover.bottom - mediaBeforeHover.bottom);
    const expectedScale = 1.45;
    const expectedHeight = mediaBeforeHover.height * expectedScale;
    const heightDiff = Math.abs(mediaAfterHover.height - expectedHeight);

    if (bottomMovement < 5) {
      console.log(`✓ Bottom edge stayed fixed (movement: ${bottomMovement}px)`);
    } else {
      console.log(`❌ Bottom edge moved too much (${bottomMovement}px)`);
    }

    if (heightDiff < 10) {
      console.log(`✓ Media scaled to ~${expectedScale}x (height: ${mediaAfterHover.height}px, expected: ${expectedHeight}px)`);
    } else {
      console.log(`❌ Media height mismatch (got ${mediaAfterHover.height}px, expected ~${expectedHeight}px)`);
    }

    // Check pills are visible and positioned
    const pills = await page.evaluate(() => {
      const pillElements = Array.from(document.querySelectorAll('.card-pill'));
      return pillElements.map(pill => {
        const rect = pill.getBoundingClientRect();
        const opacity = window.getComputedStyle(pill).opacity;
        return {
          label: pill.textContent,
          opacity: parseFloat(opacity),
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          display: window.getComputedStyle(pill).display
        };
      });
    });

    const visiblePills = pills.filter(p => p.opacity > 0.5);
    if (visiblePills.length === 4) {
      console.log(`✓ All 4 pills are visible`);
      visiblePills.forEach(p => console.log(`  - ${p.label}: opacity=${p.opacity.toFixed(2)}`));
    } else {
      console.log(`❌ Only ${visiblePills.length}/4 pills visible`);
    }

    // Check card body opacity
    const cardBodyOpacity = await page.evaluate(() => {
      const body = document.querySelector('.card-body');
      return parseFloat(window.getComputedStyle(body).opacity);
    });

    if (cardBodyOpacity >= 0.95) {
      console.log(`✓ Card body stays fully opaque (opacity: ${cardBodyOpacity.toFixed(2)})`);
    } else {
      console.log(`❌ Card body faded on hover (opacity: ${cardBodyOpacity.toFixed(2)})`);
    }

    // Take screenshot
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot saved to ${screenshotPath}`);

  } catch (error) {
    console.log(`❌ Error during test: ${error.message}`);
  }
}

verifyHoverBehavior().catch(console.error);
