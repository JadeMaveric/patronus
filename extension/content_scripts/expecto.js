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

    // browser namespace depending on browser
    // chrome for Chrome OR browser for Firefox
    browser = (function() { return chrome || browser; })();

    /**
     * These will be populated with data received from the popup
     */
    let keywords = [];
    let interval = 3000;
    let iconURL = "";
    let intervalId = null;

    const SUBTITLE_HISTORY_LIMIT = 1000;            // Size of the history string
    let SUBTITLE_CONTAINER_CLASS = "iTTPOb VbkSUe"; // Container classname
    let SUBTITLE_SPAN_CLASS = "CNusmb";             // Subtitles are stored as spans
    let subs = "";                                  // Global subtitles seen so far
    let subtitle_scan_location = 0;                 // Last processed subtitle location
		
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
        let new_subs = subs.slice(subtitle_scan_location);
        subtitle_scan_location = subs.length;

        for( word of new_subs.split(' ') ) {
            if( keywords.includes(word.replace(/[^\w\s]|_/g,"").trim().toLowerCase()) ){
                notify(word);
            }
        }
    }

    /**
     * @function updateSubtitle
     * The function updates the global subtitle stream with the latest stable updates
     * from the subtitle textblock on gmeet
     */
    function updateSubtitle() {
            let new_subs = document.getElementsByClassName(SUBTITLE_CONTAINER_CLASS)[0]

            if (new_subs === undefined) return;
            else new_subs = new_subs.innerText;

            let old_subs_preview = subs.slice(-SUBTITLE_HISTORY_LIMIT);
            let new_subs_preview = new_subs.slice(0, Math.min(50, old_subs_preview.length));

            let match_point = old_subs_preview.match(new_subs_preview);

            if (match_point === null) {
                subs = subs.concat(new_subs);
            } else {
                match_point = match_point.index;
                old_subs_preview = old_subs_preview.slice(0,match_point);
                old_subs_preview += new_subs;
                subs = subs.slice(0, -SUBTITLE_HISTORY_LIMIT);
                subs = subs.concat(old_subs_preview);
            }
    }
    /**
     * @function pruneSubs
     * Removes subtitle history that has already been processed
     * Keeps only the most recent 1000 (+50) characters
     * The 50 charaters are a buffer against words that might not have
     * been completely processed.
     */
    function pruneSubs() {
        if (subs.length > SUBTITLE_HISTORY_LIMIT && subtitle_scan_location > SUBTITLE_HISTORY_LIMIT) {
            subs = subs.slice(SUBTITLE_HISTORY_LIMIT - 50);
            subtitle_scan_location -= SUBTITLE_HISTORY_LIMIT - 50;
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
                intervalId = setInterval(()=> {
                    updateSubtitle();
                    analyseVoice();
                    pruneSubs();
                }, interval);
                notify("I'll start notifying you now")
            }
        }
    })
})();
