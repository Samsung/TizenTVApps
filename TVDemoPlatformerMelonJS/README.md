Tizen Game Demo with MelonJS
-------------------------------------------------------------------------------
The Tizen TV platform is based on HTML5 and web standards.  Therefore, it is easy to port your HTML5 games to this platform.  

One popular HTML5 gaming library is the free and open-source MelonJS game engine.  This demo app shows how a MelonJS example application can run in the Tizen Web Simulator.

How to Run
==========
* Clone the app in your desktop environment.
* Import the app into your Tizen TV Web SDK IDE (available here http://www.samsungdforum.com/ )  
* Launch the app in the Web Simulator.

**NOTE**: Currently, only keyboard controls are supported.  Arrow keys control the character, and X is to jump.

Changes from Original App
=========================
* Window layout modified to fit the TV area
* Added MelonJS logo / Tizen logo / Instructions / Links to GUI
*	Added config.xml to make the application a valid Tizen application

Bugs / Issues
=============

Currently, the Web Simulator does not handle Remote Control JavaScript events correctly.  Therefore, it is recommended that you use the keyboard to control the game for now.

If the app is not responding to your keyboard presses, try to click inside the app’s window to make sure it has focus.

Further Reading
===============

To download the Tizen TV SDK, please visit this site:

http://www.samsungdforum.com/ 

To learn more about the MelonJS game library and this tutorial, you can read the guide here:

http://melonjs.github.io/tutorial-platformer/

Original application:

https://github.com/melonjs/tutorial-platformer 
