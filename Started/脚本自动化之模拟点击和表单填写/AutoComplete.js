// ==UserScript==
// @name         AutoComplete
// @namespace    http://tampermonkey.net/
// @version      2025-10-28
// @description  try to take over the world!
// @author       Gzcoder
// @match        https://formy-project.herokuapp.com/form
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const firstNameInput = document.querySelector('#first-name');
    const lastNameInput = document.querySelector('#last-name');
    const jobTitleInput = document.querySelector('#job-title');
    const educationRadio = document.querySelector('#radio-button-2');
    const maleSexRadio = document.querySelector('#checkbox-1');
    const experienceSelect = document.querySelector('#select-menu');
    const dateInput = document.querySelector('#datepicker');


    function fillForm() {
           firstNameInput.value = "Gzcoder";
           lastNameInput.value = "Jane";
           jobTitleInput.value = "Developer";
            educationRadio.checked = true;
            maleSexRadio.checked = true;
            experienceSelect.value = 2;
            dateInput.value = "10/28/2025";


            [firstNameInput,lastNameInput,jobTitleInput,dateInput].forEach(inp => {
                inp.dispatchEvent(new Event('input',{bubbles:true}));
            });
    }

    function submitForm() {
        const submitButton = document.querySelector('.btn.btn-lg.btn-primary');
        if (submitButton) {
            setTimeout(() => submitButton.click(),1000);
        } else {
            alert("Submit button not found");
        }
    }

    function main() {
        fillForm();
        submitForm();
    }


    window.addEventListener('load',()=>setTimeout(main,1000))

    // Your code here...
})();