(function listenForClicks() {
    document.addEventListener('click', e => {
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

        function sendProperties(tabs) {
            let interval = getInterval();
            let keywords = getKeywords();
            console.log(`Sending properties: ${interval} ${keywords}`)
            browser.tabs.sendMessage(tabs[0].id, {
                command: "properties",
                interval: interval,
                keywords: keywords
            })
        }

        function togglePatronus(tabs) {
            console.log("Switching Patronus state...")
            browser.tabs.sendMessage(tabs[0].id, {
                command: "toggle"
            })
        }

        function reportError(error) {
            console.error(`Expecto Patronus failed: ${error}`)
        }


        // Get the active tab
        // Call the relevant function
        if (e.target.classList.contains("apply")) {
            console.log("Apply button hit")
            browser.tabs.query({active: true, currentWindow: true})
            .then(sendProperties)
            .catch(reportError)
        }

        else if (e.target.classList.contains("slider")) {
            console.log("Toggle button hit")
            browser.tabs.query({active: true, currentWindow: true})
            .then(togglePatronus)
            .catch(reportError)
        }

        else {
            console.log(e.target.classList)
        }
    });

    // Show the warning message if we're not on the right tab
    browser.tabs.query({active: true, currentWindow: true})
    .then( (tabs) => {
        tab = tabs[0];
        if (tab.url.match('meet.google.com') == null) {
            console.log("Wrong tab")
            document.querySelector('#wrongtab').classList.remove('hidden')
        }
    })
})();