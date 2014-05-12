## Live Demo
[http://ryoyakawai.github.io/smfplayer/](http://ryoyakawai.github.io/smfplayer/)


![](https://raw.githubusercontent.com/ryoyakawai/smfplayer/master/images/screenshot.png)

## What is this?

This application is Standard MIDI File Player with JavaScript.
Now you can play Standard MIDI File only with your Chrome(as is 2014/05).
With external MIDI devices with Web MIDI API. Even if you do not own any external MIDI Device,
this application support Web MIDI Link which is tone generator build on top of Web Audio API!!
(Thanks for [@g200kg](https://twitter.com/g200kg)!!)

 - What is Standard MIDI File? -> [Standard MIDI File@wikipedia](http://en.wikipedia.org/wiki/Standard_MIDI_File#Standard_MIDI_files)
 - What is Web MIDI API? -> [Web MIDI API@W3C](http://webaudio.github.io/web-midi-api/)
 - What is Web MIDI Link? -> [Web MIDI Link](http://www.g200kg.com/en/docs/webmidilink/)

## Requirements (as is 2014/05)
[Google Chrome](https://www.google.com/intl/en/chrome/browser/) Version 34 or higher.
(Both Mac and Windows are supported.)

## Useful files

###js/smfParser.js
Parse Standard MIDI File to JavaScript Object.

    var smfParser=new SmfParser();
    var parsedSmf = smfParser.parse( [midiFile] );


###js/smfPlayer.js
Playback JavaScript Objected Standard MIDI File.

    var smfPlayer=new SmfPlayer();
    smfPlayer.init( [JavaScript Objected Standard MIDI File], latency, eventNo );

* **latency (msec)**: Set number unit of milliseconds that you want delay.
* **eventNo**: Pass event number of JavaScript Object where to start play.

###Web MIDI Link
Tone Generator created by Web Audio.
Implementation of Web MIDI Link parts are here.

**add div element in HTML**

    <div id="webmidilink"></div>

**include sender file**

    <script type="text/javascript" src="js/webmidilinkSender.js"></script>


**js/app.js : Line23-36** : Define the Tone Generators support Web MIDI Link.

    synth.Load(url, name, attributes, element_id);

* **url**: URL of Tone Generator support Web MIDI Link.
* **name**: iframe's name when you use Web MIDI Link in iframe. Set *null* when you use in div element.
* **attribute**: iframe's name when you use Web MIDI Link in iframe. Set *null* when you use in div element.
* **element_id**: Id of the element where to set. Set *null* when you use in iframe.

**js/app.js : Line62-84** : Send message to Web MIDI Link. Very similar to Web MIDI API.


## LICENSE
[LICENSE](https://raw.githubusercontent.com/ryoyakawai/smfplayer/master/LICENSE)

