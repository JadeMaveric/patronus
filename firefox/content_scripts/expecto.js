/** 
 * @author Julius Alphonso
 * This script is based off poc/script.js
 * It communicates with the UI in firefox/popup to get the keywords
*/

(function() {
    /**
     * Check and set a global guard variable
     * This prevents the script from executing twice on the same page
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    /**
     * This will be populated with data received from the popup
     */
    let keywords = [];
    let interval = 3000;
    let iconURL = "";
    let intervalId = null;

    /**
     * @function notify
     * Wrapper method that creates a new notification object or requests permissions
     * to do so if it's disabled. Throws an error if the browser doesn't support extensions
     * This is the example script found on MDN
     */
    function notify(notifBody) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
    
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification("Patronus", {body: notifBody, icon: iconURL});
        }
    
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification("Patronus", {body: notifBody});
            }
            });
        }
    
        // At last, if the user has denied notifications, and you 
        // want to be respectful there is no need to bother them any more.
    }
    /**
     * @function analyseVoice
     * When called, this function scans through the current state of the subtitles
     * and fires a notification if any of the words match those mentioned in the
     * keywords array
     */
    function analyseVoice() {
        subClassName = "CNusmb";
        for( sub of document.getElementsByClassName(subClassName) ) {
            for( word of sub.innerHTML.split(' ') ) {
                if( keywords.includes(word.replace(/[^\w\s]|_/g,"").trim().toLowerCase()) ){
                    notify(word);
                }
            }
        }
    }

    function subtitleState() {
        ccButtonText = document.getElementsByClassName('I98jWb')[0].innerText;
        return ccButtonText === "Turn off captions";
    }

    // notify("I'll notify you now")
    // itervalId = setInterval(analyseVoice, interval)

    browser.runtime.onMessage.addListener((message) => {
        if( message.command === "setProperties" ) {
            keywords = [];
            interval = message.interval;
            for( word of message.keywords ) {
                keywords.push(word)
            }
            let messageBody = intervalId==null?'When actived, ':'';
            messageBody += `I'll check for the following keywords every <i>${interval}</i>ms: <i>${keywords}</i>`
            notify(messageBody)
        }
        else if( message.command === "getProperties" ) {
            browser.runtime.sendMessage({
                command: "setProperites",
                activated: intervalId!=null,
                keywords: keywords,
                interval: interval,
                subtitleState: subtitleState()
            })
        }
        else if( message.command === "toggle" ) {
            if (intervalId) {
                clearInterval(intervalId)
                intervalId = null
                notify("I'll stop notifying you now")
            }
            else {
                intervalId = setInterval(analyseVoice, interval);
                notify("I'll start notifying you now")
            }
        }
    })
})();