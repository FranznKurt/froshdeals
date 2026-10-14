"""Mocked failure-path regressions: no browser or network calls."""
import unittest
from unittest.mock import Mock, call, patch

import test_offer_copy as harness


class OfferCopyCleanupTests(unittest.TestCase):
    def test_class_setup_failures_release_acquired_resources(self):
        for failure in ('thread_start', 'playwright_start', 'browser_launch'):
            with self.subTest(failure=failure):
                class Probe(harness.OfferCopyTests):
                    def setUp(self):
                        pass

                    def runTest(self):
                        pass

                resources = Mock()
                server, thread, playwright = Mock(), Mock(ident=None), Mock()
                resources.attach_mock(server, 'server')
                resources.attach_mock(thread, 'thread')
                resources.attach_mock(playwright, 'playwright')
                starter = Mock()
                starter.start.return_value = playwright
                if failure == 'thread_start':
                    thread.start.side_effect = RuntimeError('thread start failed')
                elif failure == 'playwright_start':
                    thread.ident = 1
                    starter.start.side_effect = RuntimeError('Playwright start failed')
                else:
                    thread.ident = 1
                    playwright.chromium.launch.side_effect = RuntimeError('launch failed')
                with patch.object(harness.http.server, 'ThreadingHTTPServer', return_value=server), \
                     patch.object(harness.threading, 'Thread', return_value=thread), \
                     patch.object(harness, 'sync_playwright', return_value=starter):
                    result = unittest.TestResult()
                    unittest.TestSuite([Probe('runTest')]).run(result)
                self.assertEqual(len(result.errors), 1)
                self.assertEqual(result.testsRun, 0)
                server.server_close.assert_called_once_with()
                if failure == 'thread_start':
                    server.shutdown.assert_not_called()
                    thread.join.assert_not_called()
                else:
                    server.shutdown.assert_called_once_with()
                    thread.join.assert_called_once_with()
                    self.assertEqual(resources.mock_calls[-3:], [
                        call.server.shutdown(), call.thread.join(), call.server.server_close()])
                if failure == 'browser_launch':
                    playwright.stop.assert_called_once_with()
                else:
                    playwright.stop.assert_not_called()

    def test_browser_close_failure_does_not_block_other_class_cleanups(self):
        class Probe(harness.OfferCopyTests):
            def setUp(self):
                pass

            def tearDown(self):
                pass

            def runTest(self):
                pass

        resources = Mock()
        server, thread, playwright, browser = Mock(), Mock(ident=1), Mock(), Mock()
        for name, resource in [('server', server), ('thread', thread),
                               ('playwright', playwright), ('browser', browser)]:
            resources.attach_mock(resource, name)
        starter = Mock()
        starter.start.return_value = playwright
        playwright.chromium.launch.return_value = browser
        browser.close.side_effect = RuntimeError('browser close failed')
        with patch.object(harness.http.server, 'ThreadingHTTPServer', return_value=server), \
             patch.object(harness.threading, 'Thread', return_value=thread), \
             patch.object(harness, 'sync_playwright', return_value=starter):
            result = unittest.TestResult()
            unittest.TestSuite([Probe('runTest')]).run(result)
        self.assertEqual(result.testsRun, 1)
        self.assertEqual(len(result.errors), 1)
        self.assertIn('browser close failed', result.errors[0][1])
        self.assertEqual(resources.mock_calls[-5:], [
            call.browser.close(), call.playwright.stop(), call.server.shutdown(),
            call.thread.join(), call.server.server_close()])

    def test_instance_setup_failures_close_context(self):
        for failure in ('route', 'new_page', 'goto'):
            with self.subTest(failure=failure):
                class Probe(harness.OfferCopyTests):
                    @classmethod
                    def setUpClass(cls):
                        pass

                    def runTest(self):
                        self.fail('test body must not run after failed setup')

                context, page = Mock(), Mock()
                context.new_page.return_value = page
                target = page.goto if failure == 'goto' else getattr(context, failure)
                target.side_effect = RuntimeError(f'{failure} failed')
                probe = Probe('runTest')
                probe.browser = Mock()
                probe.browser.new_context.return_value = context
                probe.server = Mock(server_port=12345)
                result = unittest.TestResult()
                unittest.TestSuite([probe]).run(result)
                self.assertEqual(result.testsRun, 1)
                self.assertEqual(len(result.errors), 1)
                self.assertIn(f'{failure} failed', result.errors[0][1])
                self.assertEqual(result.failures, [])
                context.close.assert_called_once_with()


if __name__ == '__main__':
    unittest.main()
