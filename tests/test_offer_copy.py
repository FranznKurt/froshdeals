"""Local browser regressions; uses existing Playwright, no package install.
Run: PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
"""
import functools
import http.server
from pathlib import Path
import threading
import unittest
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


class OfferCopyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        handler = functools.partial(QuietHandler, directory=str(ROOT))
        cls.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
        cls.addClassCleanup(cls.server.server_close)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.addClassCleanup(lambda: cls.thread.join() if cls.thread.ident is not None else None)
        cls.thread.start()
        cls.addClassCleanup(cls.server.shutdown)
        cls.playwright = sync_playwright().start()
        cls.addClassCleanup(cls.playwright.stop)
        cls.browser = cls.playwright.chromium.launch(channel='chrome', headless=True)
        cls.addClassCleanup(cls.browser.close)

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 900})
        self.addCleanup(self.context.close)
        # Only localhost requests: no provider clicks, logos, analytics or test traffic.
        self.context.route('**/*', lambda route: route.continue_()
                           if route.request.url.startswith('http://127.0.0.1:')
                           else route.abort())
        self.page = self.context.new_page()
        self.page.goto(f'http://127.0.0.1:{self.server.server_port}/', wait_until='load')

    def test_mobile_offer_interactions(self):
        # Characterization of existing behavior, not a new feature.
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.page.evaluate('getWeekNumber = () => 2; renderDOTW()')
        self.assertEqual(self.page.locator('#dotw-discount').inner_text(), '$6.99/month')
        self.page.locator('#freeToggleBtn').click()
        self.assertTrue(self.page.locator('#freeGrid').is_visible())
        trial = self.page.locator('#freeGrid a[href="https://www.amazon.com/joinstudent"]')
        trial.scroll_into_view_if_needed()
        self.assertIn('TRIAL', trial.inner_text())
        self.page.locator('#freeToggleBtn').click()
        self.assertFalse(self.page.locator('#freeGrid').is_visible())
        self.page.locator('#searchInput').fill('Spotify')
        self.assertEqual(self.page.locator('#grid .card').count(), 1)
        self.page.locator('#searchInput').fill('no-such-student-offer-xyz')
        self.assertEqual(self.page.locator('#grid .card').count(), 0)
        self.page.locator('#searchInput').fill('')
        for category in self.page.locator('.cat-btn').all_text_contents():
            self.page.evaluate('(category) => setCategory(category)', category)
            self.assertGreater(self.page.locator('#grid .card').count(), 0)
        self.page.evaluate("setCategory('All')")
        self.assertEqual(self.page.locator('#grid .card').count(), 224)
        self.page.get_by_role('button', name='🔍 Find My Deals').click()
        self.assertTrue(self.page.locator('#searchInput').evaluate('(el) => el === document.activeElement'))
        self.assertEqual(self.page.evaluate('document.documentElement.scrollWidth'), 390)
        for slot in range(8):
            self.page.evaluate('(slot) => { getWeekNumber = () => slot; renderDOTW(); }', slot)
            self.assertTrue(self.page.locator('#dotw-brand').inner_text())
            self.assertTrue(self.page.locator('#dotw-link').get_attribute('href').startswith('https://'))

    def test_amazon_free_card_is_a_trial_without_adding_attribution(self):
        self.page.locator('#freeToggleBtn').click()
        card = self.page.locator('#freeGrid a[href="https://www.amazon.com/joinstudent"]')
        text = card.inner_text()
        self.assertIn('TRIAL', text)
        self.assertIn('6-month trial', text)
        self.assertIn('then $7.49/month', text)
        self.assertIn('eligibility and renewal terms', text)
        self.assertIn('View Trial Terms', text)
        self.assertNotIn('completely free with .edu', text)
        self.assertNotIn('Claim Free', text)
        self.assertEqual(card.get_attribute('href'), 'https://www.amazon.com/joinstudent')

    def test_free_section_discloses_conditional_offers(self):
        header = self.page.locator('#freeToggleBtn').inner_text()
        self.assertIn('Free Offers & Trials', header)
        self.assertIn('Eligibility, payment details and renewal terms vary', header)
        for misleading in ('No credit card', 'No trial', 'Completely Free With Your .edu'):
            self.assertNotIn(misleading, header)
        self.page.locator('#freeToggleBtn').click()
        self.assertTrue(self.page.locator('#freeGrid').is_visible())
        self.assertEqual(self.page.locator('#freeGrid a').count(), 18)
        self.page.locator('#freeToggleBtn').click()
        self.assertFalse(self.page.locator('#freeGrid').is_visible())

    def test_spotify_matches_verified_us_offer_on_grid_and_feature(self):
        # Force the Spotify rotation slot regardless of the execution date.
        self.page.evaluate('getWeekNumber = () => 2; renderDOTW()')
        self.assertEqual(self.page.locator('#dotw-discount').inner_text(), '$6.99/month')
        self.page.locator('#searchInput').fill('Spotify')
        self.assertEqual(self.page.locator('#grid .card').count(), 1)
        card = self.page.locator('#grid .card')
        self.assertEqual(card.locator('.discount').inner_text(), '$6.99/month')
        description = card.locator('.desc').inner_text()
        for condition in ('1 month', 'not tried Premium before', '18', 'US Title IV',
                          'SheerID', 'Hulu', 'eligibility', 'tax'):
            self.assertIn(condition, description)
        self.assertEqual(self.page.locator('#dotw-desc').inner_text(), description)
        self.assertNotIn('$2.99', description)
        self.assertEqual(self.page.locator('#dotw-link').get_attribute('href'),
                         card.locator('a').get_attribute('href'))
        self.assertEqual(card.locator('a').get_attribute('href'),
                         'https://www.spotify.com/us/student/')


if __name__ == '__main__':
    unittest.main()
