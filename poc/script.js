/** 
 * @author Julius Alphonso
 * This script is intented as a proof of concept...
 * Nonetheless, it's still possible to use it, and might be what 
 * you want if you have an aversion towards installing the browser plugin.
 * 
 * Simply add the keywords you'd like to the keywords array and paste this script 
 * into your browser's console (F12 on most browsers). You'll get a notification
 * when one of the keywords is said. As usual, be sure to enable Closed Captions
*/

// Add the keywords you would like here, you'll be notified when one of them is said
// Use only lowercase letters
keywords = ["neural", "networks", "fourier", "analysis"];

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
        var notification = new Notification("Patronus", {body: notifBody});
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
            if( keywords.includes(word.toLowerCase()) ){
                notify(word);
            }
        }
    }
}

// Make sure notifications are working
notify("Yay! I can notify you now")
// Analyse the subtitles every 5000ms (5 secs)
setInterval(analyseVoice, 5000);