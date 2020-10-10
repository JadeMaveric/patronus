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
                command: "setProperties",
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
        if (message.command = "setProperties") {
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