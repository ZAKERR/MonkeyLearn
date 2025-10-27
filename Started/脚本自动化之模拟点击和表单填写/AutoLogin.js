// ==UserScript==
// @name         CatAlert
// @namespace    http://tampermonkey.net/
// @version      2025-10-25
// @description  try to take over the world!
// @author       Gzcoder
// @match        https://bbs.tampermonkey.net.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    const CHECK_LOGIN_BUTTON = "#comiis_nv > div > div > div > div.comiis_dlq > a:nth-child(1)"

    function doLogin() {
        const loginButton = document.querySelector("div > div.rfm.mbw.bw0 > table > tbody > tr > td:nth-child(2) > button[name='loginsubmit']");
        if (loginButton) {
            setTimeout(loginButton.click(),300)
        }
    }

    function observeSliderPass()
    {
        const checkBoxObs = new MutationObserver(()=> {
            const sliderPass = document.querySelector('#dx_captcha_basic_bar-success_1[style="display: block;"]');
            if (sliderPass)  {
                checkBoxObs.disconnect();
                doLogin();
            }
        })

        checkBoxObs.observe(document,{childList:true,subtree:true})
    }

    
    
    function loginCheck() {
        const checkLoginButton = document.querySelector(CHECK_LOGIN_BUTTON);
        if (checkLoginButton) {
            checkLoginButton.click();
            return true;
        } else {
            return false;
        }
    }
    
    function main() {
        if (loginCheck()) {
            observeSliderPass(observeSliderPass);
        }
        
    }


    window.addEventListener('load',()=>setTimeout(main,100))


})();