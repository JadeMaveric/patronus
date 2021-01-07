![patronus-logo](/extension/icons/deer-96.png)
# patronus
A browser extension that listens to your gMeets for you. And notifies you if something important is mentioned

### Installation
* Firefox - get it from the [addon store](https://addons.mozilla.org/en-US/firefox/addon/patronus-for-gmeet/)

### Usage
1. Enable subtitles (CC)
2. In the browser bar UI - set the keywords and interval
    * Keywords are the words that should be searched for. Case and punctuation are ignored when matching keywords.
    * Interval is how often the search will be run (in milliseconds). I've found that 10 seconds (10000 ms) is reliably well. (A value lower than 5000 leads to the same keywords being detected multiple times, and a value more than 20000 will often miss words)
3. Click the toggle switch to enable Patronus (it won't check for anything unless this is on)
4. You'll be notified when one of the keywords is found
---
MIT License

Copyright (c) 2020 Julius Alphonso

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

