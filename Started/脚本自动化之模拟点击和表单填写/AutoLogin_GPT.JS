// ==UserScript==
// @name         CatAlert (improved)
// @namespace    http://tampermonkey.net/
// @version      2025.10.26
// @description  Improved auto-login helper with safer waits and observers
// @author       Gzcoder (improved)
// @match        https://bbs.tampermonkey.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ====== CONFIG ======
    const CHECK_LOGIN_BUTTON = "#comiis_nv > div > div > div > div.comiis_dlq > a:nth-child(1)"; // keep but be ready to replace with more robust selector
    const LOGIN_BUTTON_SELECTOR = "div > div.rfm.mbw.bw0 > table > tbody > tr > td:nth-child(2) > button[name='loginsubmit']";
    const SLIDER_SUCCESS_ID = "dx_captcha_basic_bar-success_1"; // element id for slider success
    const MAX_WAIT_MS = 30_000;

    // ====== Utility: wait for element (with timeout) ======
    function waitForElement(selectorOrFn, timeout = MAX_WAIT_MS, interval = 300) {
        // selectorOrFn: either CSS selector string or () => element
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const getEl = () => {
                if (typeof selectorOrFn === 'function') return selectorOrFn();
                return document.querySelector(selectorOrFn);
            };

            const check = () => {
                const el = getEl();
                if (el) {
                    resolve(el);
                } else if (Date.now() - start >= timeout) {
                    reject(new Error('waitForElement timeout: ' + (typeof selectorOrFn === 'string' ? selectorOrFn : '[fn]')));
                } else {
                    setTimeout(check, interval);
                }
            };
            check();
        });
    }

    // ====== helper: safe click (logs and guards) ======
    function safeClick(el) {
        try {
            if (!el) return false;
            el.scrollIntoView({block: 'center', inline: 'nearest'});
            // Some buttons are not real <button> and require dispatching events:
            if (typeof el.click === 'function') {
                el.click();
            } else {
                el.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
            }
            console.info('[CatAlert] clicked', el);
            return true;
        } catch (err) {
            console.warn('[CatAlert] click failed', err, el);
            return false;
        }
    }

    // ====== attempt to open login modal / trigger login area ======
    async function loginCheckAndOpen() {
        const btn = document.querySelector(CHECK_LOGIN_BUTTON);
        if (btn) {
            console.info('[CatAlert] Found check-login button, clicking...');
            safeClick(btn);
            return true;
        }
        console.info('[CatAlert] check-login button not found yet');
        return false;
    }

    // ====== attempt to click the final login submit button ======
    async function doLoginSubmit() {
        try {
            const loginBtn = await waitForElement(LOGIN_BUTTON_SELECTOR, 5000).catch(()=>null);
            if (loginBtn) {
                // small delay to allow autofill to finish (if browser is filling credentials)
                setTimeout(()=> safeClick(loginBtn), 200);
                console.info('[CatAlert] attempted to submit login');
                return true;
            } else {
                console.warn('[CatAlert] login submit button not found');
                return false;
            }
        } catch (err) {
            console.error('[CatAlert] doLoginSubmit error', err);
            return false;
        }
    }

    // ====== observe slider/captcha success more robustly ======
    function observeSliderSuccessAndLogin() {
        // Try to find element by id first
        const successEl = document.getElementById(SLIDER_SUCCESS_ID);
        if (successEl) {
            // If element exists but may toggle display, observe attribute changes
            const mo = new MutationObserver((mutations) => {
                for (const m of mutations) {
                    if (m.type === 'attributes' && m.attributeName === 'style') {
                        const el = m.target;
                        const visible = window.getComputedStyle(el).display !== 'none' && el.offsetParent !== null;
                        if (visible) {
                            console.info('[CatAlert] slider success visible (attr change)');
                            mo.disconnect();
                            doLoginSubmit();
                        }
                    }
                }
            });
            mo.observe(successEl, { attributes: true, attributeFilter: ['style', 'class'] });

            // immediate check too
            const visibleNow = window.getComputedStyle(successEl).display !== 'none' && successEl.offsetParent !== null;
            if (visibleNow) {
                console.info('[CatAlert] slider success already visible');
                mo.disconnect();
                doLoginSubmit();
            }
            return;
        }

        // If element not present yet, watch for insertion of that element
        const rootObserver = new MutationObserver((mutations, obs) => {
            for (const m of mutations) {
                if (m.addedNodes && m.addedNodes.length) {
                    for (const n of m.addedNodes) {
                        if (!(n instanceof HTMLElement)) continue;
                        // if node is the success element or contains it
                        const found = n.id === SLIDER_SUCCESS_ID ? n : n.querySelector && n.querySelector('#' + SLIDER_SUCCESS_ID);
                        if (found) {
                            console.info('[CatAlert] slider success element inserted');
                            obs.disconnect();
                            // small delay to allow final rendering
                            setTimeout(()=> {
                                const visible = window.getComputedStyle(found).display !== 'none' && found.offsetParent !== null;
                                if (visible) doLoginSubmit();
                                else observeSliderSuccessAndLogin(); // fallback to attribute observer
                            }, 150);
                            return;
                        }
                    }
                }
            }
        });

        // observe document body only (narrower than document)
        if (document.body) {
            rootObserver.observe(document.body, { childList: true, subtree: true });
            // also set a timeout to stop observing after some time to avoid forever observer
            setTimeout(()=> {
                try { rootObserver.disconnect(); } catch(e){}
            }, MAX_WAIT_MS);
        } else {
            console.warn('[CatAlert] document.body not ready for observing slider');
        }
    }

    // ====== main ======
    async function main() {
        try {
            // Wait a bit for page to settle
            await new Promise(r=>setTimeout(r, 120));
            // Try to open login if button present; keep trying for some seconds
            const opened = await loginCheckAndOpen();
            if (!opened) {
                // if not opened, try again a few times (in case nav loads later)
                try {
                    await waitForElement(CHECK_LOGIN_BUTTON, 5000);
                    await loginCheckAndOpen();
                } catch(_) {
                    console.info('[CatAlert] login open button not found after wait; continuing to observe for slider in case user manually opened modal.');
                }
            }

            // Start observing slider/captcha success
            observeSliderSuccessAndLogin();

            // Also attempt a safety call: if user completes captcha and the login button exists, we will submit automatically
            // This fallback polls for login button being visible for some time
            (async function pollLoginButtonFallback() {
                const end = Date.now() + MAX_WAIT_MS;
                while (Date.now() < end) {
                    const el = document.querySelector(LOGIN_BUTTON_SELECTOR);
                    if (el && (el.offsetParent !== null)) {
                        console.info('[CatAlert] fallback: login button visible, clicking');
                        safeClick(el);
                        break;
                    }
                    await new Promise(r=>setTimeout(r, 500));
                }
            })();

        } catch (err) {
            console.error('[CatAlert] main loop error', err);
        }
    }

    // run on load (and also try shortly after in case of fast SPA)
    window.addEventListener('load', () => setTimeout(main, 100));
    // extra attempt in case load already fired earlier
    setTimeout(main, 500);
})();
