**Note**: There's a JSZip bug with firefox, where it won't allow image files to be zipped. I've submitted a bug report to the maintainer and am also working to find a solution to it.

This is a beta copy, a lot of settings don't have user facing knobs.

## Installation
### Chromium based browsers:
1. Download the extension folder
2. In chromium click on the plugin icon (jigsaw shaped icon) on the toolbar
3. Select 'Manage extensions'
4. Click on 'Load Unpacked'
5. Navigate to the extension folder (which contains `manifest.json`...)
6. Select this folder, the extension should now be installed


### Firefox based browsers:
1. Download the extension folder
2. Navigate to [`about:debuggin`](about:debugging)
3. Click on 'This Firefox'
4. Click on 'Load a temporary extension'
5. Navigate to the extension folder
6. Select the `manifest.json` file

## Usage
### Subtitle Capture (Original feature)
0. Make sure notifications and subtitles are enabled for gmeet
1. Add the comman/space separated keywords
2. Set an interval to check in milliseconds. (3000 is a sane default)
3. Hit Apply to save these settings
4. Activate the extension by hitting the sliding button


### Slideshot
0. Make sure someone's actually presenting
1. Activate the extension by click the silding button
2. The frames counter should reflect the number of frames recorded
3. Adjust the sensitivity bar if required. (lower is less sensitive)
4. Click 'Download Zip' to download the zipped jpeg images.
