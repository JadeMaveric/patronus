(function listenForClicks() {

    // browser namespace depending on browser
    // chrome for Chrome OR browser for Firefox
    browser = (function() { return  chrome || browser; })();

    document.addEventListener('click', e => {

        function getKeywords() {
            let words = document.getElementById("keywords").value.split(/[\s,]+/);
            words = words.map(e => e.trim().toLowerCase());
            return words;
        }

        function getInterval() {
            let interval = document.getElementById("interval").value;
            return interval;
        }

        function sendProperties(tabs) {

            // if tabs is undefined, report error
            if (!tabs) {
                return reportError("tabs undefined")
           }

            let interval = getInterval();
            let keywords = getKeywords();
            console.log(`Sending properties: ${interval} ${keywords}`)
            browser.tabs.sendMessage(tabs[0].id, {
                command: "setProperties",
                interval: interval,
                keywords: keywords
            })
        }

        function togglePatronus(tabs) {
            // if tabs is undefined, report error
            if (!tabs) {
                return reportError("InternalError: No tabs defined")
            }

            console.log("Switching Patronus state...")
            browser.tabs.sendMessage(tabs[0].id, {
                command: "toggle"
            })
        }

        function toggleSlideshot(tabs) {
            // if tabs is undefined, report error
            if (!tabs) {
                return reportError("InternalError: No tabs defined")
            }

            console.log("Switching Slideshot state...")
            browser.tabs.sendMessage(tabs[0].id, {
                command: "toggleInterval"
            })
        }

        function downloadSlides(tabs) {
            // if tabs is undefined, report error
            if (!tabs) {
                return reportError("InternalError: No tabs defined")
            }

            console.log("Downloading slides...")
            browser.tabs.sendMessage(tabs[0].id, {
                command: "downloadZip"
            })
        }

        function reportError(error) {
            console.error(`Expecto Patronus failed: ${error}`)
        }


        // Get the active tab
        // Call the relevant function
        if (e.target.id === "apply") {
            console.log("Apply button hit!")
            browser.tabs.query({active: true, currentWindow: true}, sendProperties)
        }

        else if (e.target.id === "toggle_switch") {
            console.log("Toggle button hit!")
            browser.tabs.query({active: true, currentWindow: true}, togglePatronus)
        }

        else if (e.target.id === "toggle_timer") {
            console.log("Countdown initiating / stopping")
            browser.tabs.query({active: true, currentWindow: true}, toggleSlideshot)
        }

        else if (e.target.id === "download_zip") {
            console.log("Downloading zip")
            browser.tabs.query({active: true, currentWindow: true}, downloadSlides)
        }

        console.log(e.target)
    });

    // Show the warning message if we're not on the right tab
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {

        tab = tabs[0];
        console.log(tab.url);
        if (tab.url.match('meet.google.com/.+') == null) {
            console.log("Wrong tab")
            document.querySelector('#popup-content').classList.add('hidden')
            document.querySelector('#error-content').classList.remove('hidden')
        } else {
            browser.tabs.sendMessage(tab.id, {
                command: "getProperties"
            })
        }
    })


    // Get content-script state
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "setProperties") {
            console.log("Received properties")
            document.getElementById('keywords').value = message.keywords;
            document.getElementById('interval').value = message.interval;
            document.getElementById('toggle_switch').checked = message.activated;
            if (message.subtitleState)
                document.getElementById('subtitle-warning').classList.add('hidden');
            else
                document.getElementById('subtitle-warning').classList.remove('hidden');
        }
    })
})();