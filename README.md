TizenTVApps
===========

This repository hosts applications for the Tizen TV Web Platform.  Tizen TV apps are HTML5/JS/CSS applications and can be run in the Tizen TV Web Simulator.  You can find the Tizen TV SDK 1.4 (with Web Simulator) here:

http://www.samsungdforum.com/TizenDevtools/SdkDownload

App Overview
------------

**May 28, 2015**

We added 2 video apps (HTML5 and AVPlayer) and a simple image slideshow:

**TVDemoSlideShow** A simple HTML5/CSS3 image slide show:
<img src="https://raw.githubusercontent.com/rodrigogrow/TizenTVApps/master/screenshots/imageslideshow.png" alt="Demo in Web Simulator" style="width:250px"/>

**TVDemoVideoPlayer** A simple video player app, it uses HTML5 tag video:
<img src="https://raw.githubusercontent.com/rodrigogrow/TizenTVApps/master/screenshots/videotizenappdemon.png" alt="Demo in Web Simulator" style="width:250px"/>

**TVDemoAvPlay** A simple video player using Tizen WebAPI for AVPlay component (It supports DRMs and streaming engines like DASH, HAS, HLS and SmoothStreaming) Must be tested on TV Tizen Emulator:
<img src="https://raw.githubusercontent.com/rodrigogrow/TizenTVApps/master/screenshots/avplayerappdemo.png" alt="Demo in Web Simulator" style="width:250px"/>

**October 24, 2014**

We are happy to add 2 new apps that use the [Phaser](http://phaser.io/) game library:

**TVDemoGrandmasBakery** : A match-3 games using the Phaser game library.
<img src="https://raw.githubusercontent.com/Samsung/TizenTVApps/master/screenshots/grandmas_01.png" alt="Demo in Web Simulator" style="width:250px"/>


**TVDemoSimonSaysDemo** : A "Simon Says" games using the Phaser game library.
<img src="https://raw.githubusercontent.com/Samsung/TizenTVApps/master/screenshots/simonsays_01.png" alt="Demo in Web Simulator" style="width:250px"/>

**August 12, 2014**

**TVDemoPlatformerMelonJS** : A port of the MelonJS game demo application.

![Platform Demo in Web Simulator](https://raw.githubusercontent.com/Samsung/TizenTVApps/master/screenshots/platformer_02.png)

**TVDemoTenframe** : A port of a Tizen demo showing an educational application.

![Demo in Web Simulator](https://raw.githubusercontent.com/Samsung/TizenTVApps/master/screenshots/tenframe_02.png)

How to Run
------------
- Clone this repository to your desktop
- Install the Tizen TV Web SDK 1.5 (available here: http://www.samsungdforum.com/TizenDevtools/SdkDownload )
- Launch the Tizen IDE and import each app's folder into your workspace
- After important, right-click on the app's folder and choose 
 Run As > Tizen TV Web Simulator Application (Samsung TV)
- NOTE: If you are running latest Tizen IDE and try running these projects, you might get following error.
{code}
Cannot run program "tizen-sdk/tools/sec_tv_websimulator/node-webkit.app/Contents/MacOS/node-webkit": error=2, No such file or directory.
{code}
- Default IDE settings look like this:
 ![IDE default simulator path settings](https://raw.githubusercontent.com/Samsung/TizenTVApps/master/screenshots/Screen%20Shot%202016-04-27%20at%2011.43.31%20PM.png)
- Make following changes to your IDE configuration in order to make it work.
 ![IDE correct simulator path settings](https://raw.githubusercontent.com/mtrivedi/TizenTVApps/master/screenshots/correct_settings.png)
- Go to Tizen SDK directory and navigate to tools/sec_tv_websimulator/nwjs.app/Contents/MacOS/
- rename the file nwjs to node-webkit

Current Issues
------------
* Remote Control events are not working properly.  Please use keyboard and/or mouse.

Credits
------------
Original MelonJS Demo App: http://melonjs.github.io/tutorial-platformer/

Additional Tizen HTML5 Apps: https://developer.tizen.org/downloads/sample-web-applications

Phaser homepage: http://phaser.io/




