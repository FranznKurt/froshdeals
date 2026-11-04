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

    def test_footer_replaces_inactive_newsletter_signup_with_bookmark_guidance(self):
        for width, height in ((1440, 900), (390, 844)):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': height})
                footer = self.page.locator('footer')
                text = footer.inner_text()
                self.assertEqual(footer.locator('input[type="email"], form, button').count(), 0)
                self.assertIn('Newsletter signup is unavailable.', text)
                self.assertIn('Bookmark FroshDeals to browse offers again.', text)
                for promise in ('New deals drop every week', 'Get Weekly Deals', 'Get them first'):
                    self.assertNotIn(promise, text)
                self.assertEqual(self.page.evaluate('document.documentElement.scrollWidth'), width)

    def test_privacy_explains_browsing_without_unsupported_data_promises(self):
        for width, height in ((1440, 900), (390, 844)):
            self.page.set_viewport_size({'width': width, 'height': height})
            self.page.get_by_role('link', name='Privacy Policy', exact=True).click()
            modal = self.page.locator('#modal-content')
            self.assertTrue(modal.is_visible())
            text = modal.inner_text()
            for disclosure in ('No account or login is needed to browse FroshDeals.',
                               'Newsletter signup is unavailable.',
                               'Links to other sites', 'third-party assets', 'hosting providers',
                               'may process network data', 'their own privacy policies'):
                with self.subTest(width=width, disclosure=disclosure):
                    self.assertIn(disclosure, text)
            for claim in ('We do not collect personal data', 'any personal information',
                          'your email is stored securely', 'never sold or shared',
                          'We use standard analytics', 'No personally identifiable information',
                          'no third-party requests'):
                with self.subTest(width=width, unsupported_claim=claim):
                    self.assertNotIn(claim, text)
            self.page.evaluate('closeModal()')

    def test_catalog_does_not_claim_unproven_verification_or_average_savings(self):
        text = self.page.locator('body').inner_text()
        for claim in ('$3,200+', 'Avg Annual Value', 'Verified Deals',
                      'updated every week', '✓ Verified'):
            self.assertNotIn(claim, text)
        self.assertEqual(self.page.locator('#grid .verified').count(), 0)
        self.assertIn('Check eligibility', self.page.locator('#grid .card').first.inner_text())
        self.page.evaluate("showModal('how')")
        modal = self.page.locator('#modal-content').inner_text()
        self.assertIn('not a guarantee', modal)
        self.assertNotIn('Every deal on FroshDeals is manually checked', modal)

    def test_apple_grid_and_feature_preserve_education_pricing_without_unverified_bonus(self):
        self.page.locator('#searchInput').fill('Apple')
        # Exact brand match without conflating Apple Music and Apple TV+.
        card = self.page.locator('#grid .card').filter(
            has=self.page.get_by_text('Apple', exact=True))
        self.assertEqual(card.count(), 1)
        self.assertEqual(card.locator('.discount').inner_text(), 'Education pricing')
        self.assertEqual(card.locator('a').get_attribute('href'), 'https://www.apple.com/us-edu/store')
        self.assertIn('accepted', card.locator('.desc').inner_text())
        self.page.evaluate('getWeekNumber = () => 5; renderDOTW()')
        self.assertEqual(self.page.locator('#dotw-discount').inner_text(), 'Education pricing')
        self.assertEqual(self.page.locator('#dotw-desc').inner_text(), card.locator('.desc').inner_text())
        self.assertEqual(self.page.locator('#dotw-link').get_attribute('href'), card.locator('a').get_attribute('href'))
        self.assertNotIn('AirPods', self.page.locator('#dotw-section').inner_text())

    def test_canva_free_access_is_institution_dependent_not_every_edu(self):
        self.page.locator('#searchInput').fill('Canva')
        card = self.page.locator('#grid .card')
        self.assertEqual(card.count(), 1)
        self.assertEqual(card.locator('.discount').inner_text(), 'Campus access via your school')
        self.assertIn('institution', card.locator('.desc').inner_text())
        self.assertIn('K-12', card.locator('.desc').inner_text())
        self.assertEqual(card.locator('a').get_attribute('href'), 'https://www.canva.com/for-campus/')
        self.page.locator('#freeToggleBtn').click()
        free = self.page.locator('#freeGrid a[href="https://www.canva.com/for-campus/"]')
        self.assertEqual(free.count(), 1)
        self.assertIn('VIA SCHOOL', free.inner_text())
        self.assertIn('Check Campus Access', free.inner_text())
        self.assertNotIn('Claim Free', free.inner_text())
        self.assertIn('institution', free.inner_text())

    def test_empty_search_renders_input_as_text_not_html(self):
        query = '<img src=x onerror="window.searchInjected=true">'
        self.page.locator('#searchInput').fill(query)
        self.assertEqual(self.page.locator('#grid .card').count(), 0)
        self.assertEqual(self.page.locator('#grid .empty img').count(), 0)
        self.assertIn(query.lower(), self.page.locator('#grid .empty').inner_text())
        self.assertFalse(self.page.evaluate('Boolean(window.searchInjected)'))

    def test_category_buttons_cover_every_displayed_offer(self):
        visible = set(self.page.locator('.cat-btn').all_text_contents())
        catalog = set(self.page.evaluate('DEALS.map(d => d.category)'))
        self.assertTrue(catalog.issubset(visible), f'Unreachable categories: {catalog - visible}')
        for query, category in [('PUMA', 'Clothing'), ('T-Mobile', 'Tech')]:
            self.page.locator('#searchInput').fill(query)
            self.page.get_by_role('button', name=category, exact=True).click()
            self.assertGreater(self.page.locator('#grid .card').count(), 0)
            self.assertEqual(set(self.page.locator('#grid .cat-tag').all_text_contents()), {category})
            self.page.locator('#searchInput').fill('')
            self.page.get_by_role('button', name='All', exact=True).click()

    def test_hulu_grid_and_feature_match_current_student_bundle(self):
        self.page.locator('#searchInput').fill('Hulu')
        card = self.page.locator('#grid .card').filter(
            has=self.page.get_by_text('Hulu', exact=True))
        self.assertEqual(card.count(), 1)
        self.assertEqual(card.locator('.discount').inner_text(), '$6.49/month bundle')
        description = card.locator('.desc').inner_text()
        for condition in ('Disney+', 'With Ads', '18+', 'SheerID', '$12.99', 'Direct-billed'):
            self.assertIn(condition, description)
        self.assertNotIn('$1.99', description)
        self.page.evaluate('getWeekNumber = () => 4; renderDOTW()')
        self.assertEqual(self.page.locator('#dotw-discount').inner_text(), '$6.49/month bundle')
        self.assertEqual(self.page.locator('#dotw-desc').inner_text(), description)
        self.assertEqual(self.page.locator('#dotw-link').get_attribute('href'), 'https://www.hulu.com/student')

    def test_adobe_grid_and_feature_disclose_introductory_annual_terms(self):
        self.page.locator('#searchInput').fill('Adobe Creative Cloud')
        card = self.page.locator('#grid .card')
        self.assertEqual(card.count(), 1)
        self.assertEqual(card.locator('.discount').inner_text(), 'US$19.99/mo first year')
        description = card.locator('.desc').inner_text()
        for condition in ('Creative Cloud Pro', 'annual, billed monthly', 'US$39.99/mo',
                          'after the first year', 'students and teachers', 'verification',
                          'current provider terms'):
            self.assertIn(condition, description)
        self.assertNotIn('60%', card.inner_text())
        url = 'https://www.adobe.com/creativecloud/buy/students.html'
        self.assertEqual(card.locator('a').get_attribute('href'), url)
        self.page.evaluate('getWeekNumber = () => 0; renderDOTW()')
        self.assertEqual(self.page.locator('#dotw-discount').inner_text(), card.locator('.discount').inner_text())
        self.assertEqual(self.page.locator('#dotw-desc').inner_text(), description)
        self.assertEqual(self.page.locator('#dotw-link').get_attribute('href'), url)
        # The separately maintained data file must not retain the obsolete offer.
        self.page.evaluate((ROOT / 'deals-data.js').read_text())
        separate = self.page.evaluate('DEALS_DATA.find(d => d.brand === "Adobe Creative Cloud")')
        self.assertEqual(separate['discount'], card.locator('.discount').inner_text())
        self.assertEqual(separate['desc'], description)
        self.assertEqual(separate['dealUrl'], url)
        # Static fallback must not advertise the old price or broken URL either.
        fallback = (ROOT / 'index.html').read_text().split('<!-- DEAL OF THE WEEK -->')[1].split('</section>')[0]
        self.assertNotIn('60%', fallback)
        self.assertIn(url, fallback)
        self.assertIn('US$39.99/mo', fallback)

    def test_nordvpn_grid_and_feature_share_qualified_student_offer(self):
        self.page.locator('#searchInput').fill('NordVPN')
        card = self.page.locator('#grid .card')
        self.assertEqual(card.count(), 1)
        self.assertEqual(card.locator('.discount').inner_text(), 'Extra student discount')
        description = card.locator('.desc').inner_text()
        for condition in ('extra 15%', 'eligible 2-year plans', 'eligibility',
                          'verification', 'renewal', 'current provider terms'):
            self.assertIn(condition, description)
        for unsupported in ('78%', '63%', 'free months', '18-26', '#1'):
            self.assertNotIn(unsupported, description)
        url = 'https://nordvpn.com/student-employee-discount/'
        self.assertEqual(card.locator('a').get_attribute('href'), url)
        self.page.evaluate('getWeekNumber = () => 1; renderDOTW()')
        self.assertEqual(self.page.locator('#dotw-discount').inner_text(), card.locator('.discount').inner_text())
        self.assertEqual(self.page.locator('#dotw-desc').inner_text(), description)
        self.assertEqual(self.page.locator('#dotw-link').get_attribute('href'), url)

    def test_feature_rotation_excludes_unsubstantiated_student_offers(self):
        brands = self.page.evaluate('DOTW_DEALS.map(d => d.brand)')
        self.assertNotIn('Xbox Game Pass Ultimate', brands)
        self.assertNotIn('Chegg Study', brands)
        self.assertEqual(brands, ['Adobe Creative Cloud', 'NordVPN', 'Spotify Premium',
                                  'Amazon Prime Student', 'Hulu', 'Apple Education Store'])
        self.assertEqual(self.page.evaluate('DEALS_DATA.length'), 239)
        self.assertEqual(self.page.evaluate('DEALS.length'), 224)
        catalog_brands = self.page.evaluate('DEALS.map(d => d.brand)')
        self.assertIn('Xbox Game Pass', catalog_brands)
        self.assertIn('Chegg', catalog_brands)
        for week in range(len(brands) * 2):
            self.page.evaluate('(week) => { getWeekNumber = () => week; renderDOTW(); }', week)
            self.assertEqual(self.page.locator('#dotw-brand').inner_text(), brands[week % len(brands)])
            self.assertNotIn('student rates through select campus programs',
                             self.page.locator('#dotw-section').inner_text())

    def test_feature_rotation_does_not_imply_weekly_offer_reverification(self):
        text = self.page.locator('#dotw-section').inner_text()
        self.assertIn('Rotates weekly; not a new verification.', text)
        self.assertNotIn('Refreshes every Saturday', text)
        self.assertNotIn('DEAL OF THE WEEK', text)
        self.assertIn('FEATURED ROTATION', text)
        fallback = (ROOT / 'index.html').read_text().split('<!-- DEAL OF THE WEEK -->')[1].split('</section>')[0]
        self.assertIn('Rotates weekly; not a new verification.', fallback)
        self.assertNotIn('Refreshes every Saturday', fallback)

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

    def test_footer_category_links_show_matching_deals_without_fragment_navigation(self):
        categories = {
            '🖥️ Software & Apps': 'Software',
            '📺 Streaming & Entertainment': 'Entertainment',
            '👕 Clothing & Fashion': 'Clothing',
            '💻 Tech & Gadgets': 'Tech',
            '📚 Textbooks & Education': 'Education',
            '🍕 Food & Delivery': 'Food & Delivery',
        }
        for width, height in ((1440, 900), (390, 844)):
            self.page.set_viewport_size({'width': width, 'height': height})
            for label, category in categories.items():
                with self.subTest(width=width, category=category):
                    url_before = self.page.url
                    self.page.get_by_role('link', name=label, exact=True).click()
                    expected = self.page.evaluate(
                        '(category) => DEALS.filter(d => d.category === category).length', category)
                    self.assertGreater(expected, 0)
                    self.assertEqual(self.page.locator('#grid .card').count(), expected)
                    self.assertEqual(self.page.locator('.cat-btn.active').inner_text(), category)
                    self.assertEqual(set(self.page.locator('#grid .cat-tag').all_text_contents()),
                                     {category})
                    self.assertEqual(self.page.locator('#resultsMeta').inner_text(),
                                     f'Showing {expected} deals')
                    self.assertEqual(self.page.url, url_before)

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
