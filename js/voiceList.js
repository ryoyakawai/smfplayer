/**
 *  Copyright 2013 Ryoya KAWAI
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 **/

var VoiceList = function() {
  this.gmVoiceList = {
      'instruments' : [
          'Acoustic Grand Piano'    ,'Bright Acoustic Piano'
          ,'Electric Grand Piano'    ,'Honky-tonk Piano'
          ,'Rhodes Piano'            ,'Chorused Piano'
          ,'Harpsichord'             ,'Clavinet'
          ,'Celesta'                 ,'Glockenspiel'
          ,'Music Box'               ,'Vibraphone'
          ,'Marimba'                 ,'Xylophone'
          ,'Tubular Bells'           ,'Dulcimer'
          ,'Hammond Organ'           ,'Percussive Organ'
          ,'Rock Organ'              ,'Church Organ'
          ,'Reed Organ'              ,'Accordion'
          ,'Harmonica'               ,'Tango Accordion'
          ,'Acoustic Guitar (nylon)' ,'Acoustic Guitar (steel)'
          ,'Electric Guitar (jazz)'  ,'Electric Guitar (clean)'
          ,'Electric Guitar (muted)' ,'Overdriven Guitar'
          ,'Distortion Guitar'       ,'Guitar Harmonics'
          ,'Acoustic Bass'           ,'Electric Bass (finger)'
          ,'Electric Bass (pick)'    ,'Fretless Bass'
          ,'Slap Bass 1'             ,'Slap Bass 2'
          ,'Synth Bass 1'            ,'Synth Bass 2'
          ,'Violin'                  ,'Viola'
          ,'Cello'                   ,'Contrabass'
          ,'Tremelo Strings'         ,'Pizzicato Strings'
          ,'Orchestral Harp'         ,'Timpani'
          ,'String Ensemble 1'       ,'String Ensemble 2'
          ,'SynthStrings 1'          ,'SynthStrings 2'
          ,'Choir Aahs'              ,'Voice Oohs'
          ,'Synth Voice'             ,'Orchestra Hit'
          ,'Trumpet'                 ,'Trombone'
          ,'Tuba'                    ,'Muted Trumpet'
          ,'French Horn'             ,'Brass Section'
          ,'Synth Brass 1'           ,'Synth Brass 2'
          ,'Soprano Sax'             ,'Alto Sax'
          ,'Tenor Sax'               ,'Baritone Sax'
          ,'Oboe'                    ,'English Horn'
          ,'Bassoon'                 ,'Clarinet'
          ,'Piccolo'                 ,'Flute'
          ,'Recorder'                ,'Pan Flute'
          ,'Bottle Blow'             ,'Shakuhachi'
          ,'Whistle'                 ,'Whistle'
          ,'Ocarina'                 ,'Lead 2 (sawtooth)'
          ,'Lead 3 (calliope lead)'  ,'Lead 4 (chiff lead)'
          ,'Lead 5 (charang)'        ,'Lead 6 (voice)'
          ,'Lead 7 (fifths)'         ,'Lead 8 (bass + lead)'
          ,'Pad 1 (new age)'         ,'Pad 2 (warm)'
          ,'Pad 3 (polysynth)'       ,'Pad 4 (choir)'
          ,'Pad 5 (bowed)'           ,'Pad 6 (metallic)'
          ,'Pad 7 (halo)'            ,'Pad 8 (sweep)'
          ,'FX 1 (rain)'             ,'FX 2 (soundtrack)'
          ,'FX 3 (crystal)'          ,'FX 4 (atmosphere)'
          ,'FX 5 (brightness)'       ,'FX 6 (goblins)'
          ,'FX 7 (echoes)'           ,'FX 8 (sci-fi)'
          ,'Sitar'                   ,'Banjo'
          ,'Shamisen'                ,'Koto'
          ,'Kalimba'                 ,'Bagpipe'
          ,'Fiddle'                  ,'Shanai'
          ,'Tinkle Bell'             ,'Agogo'
          ,'Steel Drums'             ,'Woodblock'
          ,'Taiko Drum'              ,'Melodic Tom'
          ,'Synth Drum'              ,'Reverse Cymbal'
          ,'Guitar Fret Noise'       ,'Breath Noise'
          ,'Seashore'                ,'Bird Tweet'
          ,'Telephone Ring'          ,'Helicopter'
          ,'Applause'                ,'Gunshot'
      ],
      'drums': [
          'Standard Kit 1'           ,'Standard Kit 2'
          ,'Dry Kit'                 ,'Brite Kit'
          ,'Skim Kit'                ,'Slim Kit'
          ,'Rogue Kit'               ,'Hob Kit'
          ,'Room Kit'                ,'DarkR Kit'
          ,'Rock Kit'                ,'Rock Kit 2'
          ,'Electric Kit'            ,'Analog Kit 1'
          ,'Analog Kit 2'            ,'Dance Kit'
          ,'HipHop Kit'              ,'Jungle Kit'
          ,'Apogee Kit'              ,'Pergee Kit'
          ,'Jazz Kit 1'              ,'Jazz Kit 2'
          ,'Brush Kit'               ,'Brush Kit 2'
      ]
  };
};

VoiceList.prototype.getGMVoiceName = function(type, num) {
  var out='';
  switch(type) {
   case 'instruments':
   default:
    out = this.gmVoiceList.instruments[num];
    break;
   case 'drums':
    out = this.gmVoiceList.drums[num];
    break;
  }
  return out;
};


var voiceList = new VoiceList();

