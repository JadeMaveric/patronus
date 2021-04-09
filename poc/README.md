## Thess scripts are intented as proof of concepts...
Nonetheless, it's still possible to use them, and might be what 
you want if you have an aversion towards installing the browser plugin.

Subcapture
* add the keywords you'd like to the `keywords` array
* copy/paste `subcapture.js` into your browser's console (`F12` on most browsers).
* enable closed captions
You'll get a notification when one of the keywords is said.

Slideshot
* copy/paste each of the files in `lib` in the console
* copy/paste `slideshot.js` into the console
* When you want to stop the capture run `clearInterval( id )`
* To download the zip run `downloadZip()`
* You can change the value variable `sentivity` to control how different consecutive frames must be. The default is 1000, which should be fine for most uses, but might miss some very small animations.