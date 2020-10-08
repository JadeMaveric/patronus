(function listenForClicks() {
    document.addEventListener("click", (e) => {
        console.log("I got a click!");

        function getKeywords() {
            let words = document.getElementById("keywords").value.split(/[\s,]+/);
            words = words.map(e => e.trim().toLowerCase());
            return words;
        }
        
        function getInterval() {
            let interval = document.getElementById("interval").value;
            return interval;
        }

        function sendKeywords(tabs) {
            let words = getKeywords();
            console.log(`Sending keywords: ${words}`)
            browser.tabs.sendMessage(tabs[0].id, {
                command: "keywords",
                keywords: words
            })
        }

        function sendInterval(tabs) {
            let interval = getInterval();
            console.log(`Sending interval: ${interval}`)
            browser.tabs.sendMessage(tabs[0].id, {
                command: "interval",
                interval: interval
            })
        }

        function expectoPatronum(tabs) {
            console.log("Expecto Patronum!")
            browser.tabs.sendMessage(tabs[0].id, {
                command: "start"
            })
        }

        function recallPatronus(tabs) {
            console.log("Recalling Patronus...")
            browser.tabs.sendMessage(tabs[0].id, {
                command: "stop"
            })
        }

        function reportError(error) {
            console.error(`Expecto Patronus failed: ${error}`)
        }


        // Get the active tab
        // Call the relevant function
        if (e.target.classList.contains("keywords")) {
            browser.tabs.query({active: true, currentWindow: true})
            .then(sendKeywords)
            .catch(reportError)
        }
        else if (e.target.classList.contains("interval")) {
            browser.tabs.query({active: true, currentWindow: true})
            .then(sendInterval)
            .catch(reportError)
        }
        else if (e.target.classList.contains("set")) {
            browser.tabs.query({active: true, currentWindow: true})
            .then(expectoPatronum)
            .catch(reportError)
        }
        else if (e.target.classList.contains("reset")) {
            browser.tabs.query({active: true, currentWindow: true})
            .then(recallPatronus)
            .catch(reportError)
        }
    })
})();