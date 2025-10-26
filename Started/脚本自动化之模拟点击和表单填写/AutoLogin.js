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

    function observeSlider() {

        // 检查状态
        const loginUIObs = new MutationObserver(()=> {
             const loginUI = document.querySelector("#fwin_login")
             if (loginUI) {
                 loginUIObs.disconnect()
                 alert("loginUI Show")
             }
        });


        loginUIObs.observe(document,{childList:true,subtree:true})

    }

    function doLogin() 
    {
        
    }
    
    
    function clickLogin() {
    
    }
    
    function main() {

        
    }

    window.addEventListener('load',()=>setTimeout(observeSlider,300))



})();