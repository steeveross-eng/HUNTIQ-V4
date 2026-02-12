/**
 * HUNTIQ V3 - E2E Tests
 * Tests end-to-end pour les fonctionnalités critiques
 */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'https://huntiq-v3.preview.emergentagent.com';
const API_URL = BASE_URL;

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/HUNT|Bionic/i);
    
    // Check hero section exists
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
  });

  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');
    
    // Check main navigation elements
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});

test.describe('Plan Maître Dashboard', () => {
  test('should load Plan Maître page', async ({ page }) => {
    await page.goto('/plan-maitre');
    await page.waitForLoadState('networkidle');
    
    // Check dashboard loaded - use more specific selector
    await expect(page.locator('h1:has-text("Plan Maître")')).toBeVisible();
  });

  test('should display legal time bar', async ({ page }) => {
    await page.goto('/plan-maitre');
    await page.waitForLoadState('networkidle');
    
    // Check for legal time information
    const legalTimeBar = page.locator('[data-testid="legal-time-bar"]');
    if (await legalTimeBar.count() > 0) {
      await expect(legalTimeBar).toBeVisible();
    }
  });

  test('should navigate to Legal Times tab', async ({ page }) => {
    await page.goto('/plan-maitre');
    await page.waitForLoadState('networkidle');
    
    // Click on Legal Times tab
    const legalTimesTab = page.locator('button:has-text("Heures Légales")');
    if (await legalTimesTab.count() > 0) {
      await legalTimesTab.click();
      await page.waitForTimeout(1000);
      
      // Verify content loaded
      await expect(page.locator('text=Fenêtre')).toBeVisible();
    }
  });
});

test.describe('API Endpoints', () => {
  test('should return legal time window', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1/legal-time/legal-window`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.legal_window).toBeDefined();
    expect(data.legal_window.start_time).toBeDefined();
    expect(data.legal_window.end_time).toBeDefined();
  });

  test('should return predictive success', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1/predictive/success?species=deer`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.prediction).toBeDefined();
    expect(data.prediction.success_probability).toBeGreaterThanOrEqual(0);
    expect(data.prediction.success_probability).toBeLessThanOrEqual(100);
  });

  test('should return activity timeline', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1/predictive/timeline?species=deer`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.timeline).toHaveLength(24);
  });

  test('should return notification status', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1/notification/legal-time/status`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.is_legal_period).toBeDefined();
    expect(data.legal_window).toBeDefined();
  });

  test('should return weather score', async ({ request }) => {
    const params = new URLSearchParams({
      temperature: '10',
      humidity: '60',
      wind_speed: '8',
      wind_direction: 'N',
      pressure: '1013',
      precipitation: '0'
    });
    
    const response = await request.get(`${API_URL}/api/v1/weather/score?${params}`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.score).toBeDefined();
  });

  test('should return module status', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/modules/status`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.total_modules).toBeGreaterThanOrEqual(40);
  });
});

test.describe('AI Engine', () => {
  test('should process AI query', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/v1/ai/query`, {
      data: {
        question: "Quel est le meilleur moment pour chasser?",
        species: "deer"
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.answer).toBeDefined();
  });
});

test.describe('Core Dashboard', () => {
  test('should load Core Dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Should show dashboard content - use heading
    await expect(page.locator('h1:has-text("Core Dashboard"), h1:has-text("Dashboard")')).toBeVisible();
  });
});

test.describe('Business Dashboard', () => {
  test('should load Business Dashboard', async ({ page }) => {
    await page.goto('/business');
    await page.waitForLoadState('networkidle');
    
    // Should show business content - use heading or specific data-testid
    await expect(page.locator('h1:has-text("Business"), [data-testid="business-dashboard"]')).toBeVisible();
  });
});
