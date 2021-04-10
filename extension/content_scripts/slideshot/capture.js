/** 
 * @author Julius Alphonso
 * This script is based off poc/slideshot.js
 * It frequently searches for a presentation video element and searches for frame changes
*/

(function() {
    /**
     * Check and set a global guard variable
     * This prevents the script from executing twice on the same page
     */
    if (window.hasSubcapture) {
        return;
    }
    window.hasSubcapture = true;

    let id = null;
    window.frame = null;
    window.frameHistory = [];
    window.frameDiffs = [];
    window.senstivity = 1000;

    // browser namespace depending on browser
    // chrome for Chrome OR browser for Firefox
    browser = (function() { return chrome || browser; })();

    function captureFrame(debug) {
        prevFrame = window.frame
        // The presentation is the always the first visible video
        let video = Array.from(document.querySelectorAll('video')).find(
            videoElement => videoElement.style.display !== 'none'
        );
    
        if (!video) return;
    
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
    
        let width = video.parentElement.style.width; // Remove "px"
        let height = video.parentElement.style.height;
        width = Number(width.slice(0,-2));
        height = Number(height.slice(0,-2));
    
        canvas.width = width;
        canvas.height = height;
    
        ctx.drawImage(video, 0, 0, width, height);
        
        let currFrame = ctx.getImageData(0, 0, width, height);
        let diff = 0;
    
        const numOfPixels = width * height;
        const numOfChannels = 4;
        
        try {
            if (frame && frame.width === width && frame.height === height) {
                diff = pixelmatch(currFrame.data, prevFrame.data, null, width, height);
            }
            else {
                diff = width * height;
            }
    
            const changeRatio = diff / numOfPixels;
            const senstivity = window.senstivity || 5000;
            const diffScore = changeRatio * senstivity | 0;
    
            if (debug) console.log(diffScore);
            
            if (window.frameDiffs.length >= 3) {
                window.frameDiffs = window.frameDiffs.slice(1,3);
                window.frameDiffs.push(diffScore);
                [a,b,c] = window.frameDiffs;
                
                if (b>=a && b>c && b!=0) {
                    console.log("Peaked");
                }
                else if (b<a && b<=c) {
                    console.log("Switched/Stabilised");
                    window.frameHistory.push(window.frame);
                }
            }
            else {
                console.log("First frame");
                window.frameHistory.push(window.frame);
                window.frameDiffs.push(diffScore);            
            }
            window.frame = currFrame;
        }
        catch (e) {
            console.error(e);
            console.log({video, width, height, frame});
        }
    }
    
    async function downloadZip() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const zip = new JSZip();
    
        if (frameHistory[0] === null) frameHistory.shift();
        const promises = frameHistory.map( (frame, i) => 
            new Promise( resolve => {
                canvas.width = frame.width;
                canvas.height = frame.height;
                ctx.putImageData(frame, 0, 0);
                canvas.toBlob(resolve, 'image/jpeg', 0.1);
            })
        )
    
        Promise.all(promises)
        .then( blobs => {
            blobs.forEach((blob, i) => {
                zip.file(`Frame ${i}.png`, blob);
            });

            zip.generateAsync({type:"blob"})
            .then( blob => {
                console.log("Saving zip...")
                saveAs(blob, "gMeetSlides.zip")
                //location.href="data:application/zip;base64," + blob;
            })
        })
    
        console.log("End of zip function, waiting for browser to finish processing")
    }
    
    browser.runtime.onMessage.addListener((message) => {
        if( message.command === "toggleInterval" ) {
            if ( id ) {
                console.log("Clear Interval")
                window.clearInterval(id)
                id = null;
            } else {
                console.log("Capturing Frames")
                id = window.setInterval(captureFrame, 100)
            }
        }

        if ( message.command === "downloadZip" ) {
            console.log("Building zip")
            downloadZip()
        }
    })

    exportFunction(downloadZip, window, {defineAs:'downloadZip'});
    exportFunction(captureFrame, window, {defineAs:'captureFrame'});
})();
