/**
 *  Copyright 2014 Ryoya KAWAI
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

let dispMsgBuffer = [];
let dispBufferSize = 30;
let dispChildCSize = 200;
let timerId;
let latency = 800;
let worker;
let webMidiLinkSynth = [
  /*
  {
    "id":"wml00", "version": 1, "manufacturer":"g200kg",
    "name":"🧪 GMPlayer (Web MIDI Link)",
    "url":"//webmusicdevelopers.appspot.com/webtg/gmplayer/index.html",
    //"url":"//www.g200kg.com/webmidilink/gmplayer/",
    "size":"width=400,height=200,scrollbars=yes,resizable=yes"
  },
  {
    "id":"wml01", "version": 1, "manufacturer":"Logue",
    "name":"🧪 SoundFont: Yamaha XG (Web MIDI Link)",
    "url":"//logue.github.io/smfplayer.js/wml.html",
    "size":"width=400,height=300,scrollbars=yes,resizable=yes"
  }
  */
];
let chInfo = [
  { on: true }, { on: true }, { on: true }, {on: true },
  { on: true }, { on: true }, { on: true }, {on: true },
  { on: true }, { on: true }, { on: true }, {on: true },
  { on: true }, { on: true }, { on: true }, {on: true }
];


(async () => {
  console.log('-----------------')

  // justify width
  let loadingControl = function() { }
  loadingControl.prototype = {
    addviewport: async () => {
      return new Promise( (resolve) => {
        const app_fixed_screen_width = 440
        let actual_screen_width = window.outerWidth
        let sig_digit = Math.pow(10, 3)
        let just_scale = Math.ceil(sig_digit * (actual_screen_width / app_fixed_screen_width)) / sig_digit
        let viewport = document.createElement('meta')
        viewport.setAttribute('name', 'viewport')
        viewport.setAttribute('content', `width=device-width, initial-scale=${just_scale}, maximum-scale=${just_scale}`)
        document.getElementsByTagName('head')[0].appendChild(viewport)
        resolve()
      })
    },
    hide: () => {
      let div_loading = document.querySelector('#loading')
      setTimeout( () => {
        div_loading.style.setProperty('opacity', '0')
      }, 500)
      setTimeout( () => {
        document.body.removeChild(div_loading)
      }, 1500)
    }
  }
  let lc = new loadingControl()
  await lc.addviewport()
  // justify width

  // Web MIDI API
  let inputs = [], outputs = [], midiout = [];

  let oct = 0;
  window.onload = function() {
    navigator.requestMIDIAccess({sysex: true}).then(scb, ecb);
  };
  function scb(access) {
    const midi = access;
    const inputs = []
    const outputs = []

    if (typeof midi.inputs === "function") {
      inputs = midi.inputs();
      outputs = midi.outputs();
    } else {
      var inputIterator = midi.inputs.values();
      //inputs = [];
      for (let o = inputIterator.next(); !o.done; o = inputIterator.next()) {
        inputs.push(o.value);
      }
      var outputIterator = midi.outputs.values();
      for (let o = outputIterator.next(); !o.done; o = outputIterator.next()) {
        outputs.push(o.value);
      }
    }

    let mosel = document.getElementById("midiOutSel");
    let options = new Array();
    for(let i=0; i<outputs.length; i++) {
      mosel.options[i]=new Option(outputs[i]["name"], i);
    }
    for(let i=0; i<webMidiLinkSynth.length; i++) {
      mosel.options[mosel.options.length] = new Option(webMidiLinkSynth[i].name, mosel.options.length);
    }
    document.querySelector("#midiOutSelB").removeAttribute("disabled");

    document.getElementById("midiOutSelB").addEventListener("click", function() {
      var port=document.getElementById("midiOutSel").value;

      if(port>=outputs.length) {
        var sdata=webMidiLinkSynth[port-outputs.length];
        synth.Load(sdata.url, sdata.id, sdata.size, "webmidilink");
        midiout = {
          "id": null,
          "manufacturer": sdata.manufacturer,
          "name": sdata.name,
          "type": "output",
          "version": sdata.version,
          "send": null
        };
        midiout.send=function(msg, time) {
          // time must be converted from absolite time to relative time.
          // Web MIDI API handles absolute time, but Web MIDI Links needs relative time.
          var aTime;
          aTime=time-(window.performance.now()-smfPlayer.startTime)-smfPlayer.startTime+smfPlayer.latency;
          if(typeof msg=="object") {
            for(let i=0; i<msg.length; i++) {
              msg[i]=msg[i].toString(16).replace("0x", "");
            }
          }
          var out="midi,"+msg.join(",");
          synth.send(out, aTime);
        };
      } else {
        midiout=outputs[port];
        if(midiout.name.match(/NSX\-39/)) {
          fireEvent("mousedown", "#midiin1");
        }
      }

      //document.getElementById("midiinicon").style.setProperty("color", "#5bc0de");
      document.getElementById("midiOutSelB").setAttribute("disabled", "disabled");
      document.getElementById("midiOutSel").setAttribute("disabled", "disabled");

      //document.getElementById("whiteout").style.setProperty("opacity", "0");
      document.getElementById("panic").style.setProperty("visibility", "visible");
      //setTimeout(function(){document.getElementById("whiteout").style.setProperty("display", "none");}, 500);
      document.getElementById("panic").style.setProperty("visibility", "visible");
      document.getElementById("panic").style.setProperty("opacity", "1");

      document.getElementById("panic").addEventListener("click", function(){
        for(let i=0; i<16; i++) {
          var data=[parseInt("0xb"+i.toString(16), 16), 0x78, 0x00];
          midiout.send(data, 0);
        }
      });

      smfPlayer=new SmfPlayer(midiout);

    });

    // vvv removing loading overlay vvv
    lc.hide()
    // ^^^ removing loading overlay ^^^
  }
  function ecb(e){
    console.log("[Error Callback]", e);
  }
  function fireEvent(type, elem) {
    if(type=="") type="mousedown";
    var e=document.createEvent('MouseEvent');
    var b=document.querySelector(elem);
    e.initEvent(type, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    b.dispatchEvent(e);
  }

  // midi file player
  let smfPlayer = {};
  const parsedMidi = [];
  const smfParser = new SmfParser();
  const dA = document.getElementById("midiFileList");
  dA.addEventListener('dragover', () => {
    event.preventDefault();
    this.style.setProperty("background-color", "#dddddd");
  })
  dA.addEventListener('dragleage', () => {
    this.style.setProperty("background-color", "#ffffff");
  })

  dA.ondrop = fileLoad;
  document.getElementById("fileimport").addEventListener("change", function(event) {
    event.dataTransfer=event.target;
    fileLoad.bind(dA)(event);
  }, false);
  function fileLoad(event) {
    this.style.removeProperty("background-color");
    var file = event.dataTransfer.files[0];
    if(typeof file=="undefined") return;
    var reader = new FileReader();
    reader.onload = function (event) {
      parsedMidi.push( {"name":file.name, "size":~~(file.size/1000), "data": smfParser.parse(event.target.result), "eventNo": 0});
      var Idx=parsedMidi.length-1;
      var mfList=document.getElementById("midiFileList");
      mfList.options[Idx]=new Option(parsedMidi[Idx].name+" ( "+ parsedMidi[Idx].size +" KB )", Idx);
      mfList.options[Idx].selected=true;


      dispBufferSize = 30;
      dispChildCSize = 150;
      if (typeof smfPlayer.dispEventMonitor == 'undefined') {
        smfPlayer.dispEventMonitor = {};
      }
      smfPlayer.dispEventMonitor = dispEventMonitor;

    };
    reader.readAsBinaryString(file);
    event.preventDefault();
    return false;
  };




  let stopped = false;
  document.getElementById("midistartB").addEventListener("mousedown", async function() {
    console.log('------------------- ', smfPlayer)
    let buttonMidistartB = document.querySelector("button#midistartB");
    let spanMidistartB = document.querySelector("span#midistartB");
    let Idx = 0
    switch(spanMidistartB.innerHTML) {
      case 'play_arrow':
        smfPlayer.setStartTime();
        if (stopped == true) {
          smfPlayer.changeFinished(false);
        }
        stopped = false;
        spanMidistartB.innerHTML = 'stop';
        Idx = document.getElementById("midiFileList").value;
        smfPlayer.init(parsedMidi[Idx].data, latency, parsedMidi[Idx].eventNo);
        await smfPlayer.changeMasterVolume(10);
        smfPlayer.startPlay();
        break;
      case "stop":
        Idx = document.getElementById("midiFileList").value;
        parsedMidi[Idx].eventNo = smfPlayer.eventNo;
        spanMidistartB.innerHTML = 'play_arrow';
        smfPlayer.stopPlay();
        stopped = true;
        break;
    }
  });
  document.getElementById("midifadeout").addEventListener("mousedown", async function() {
    await smfPlayer.changeMasterVolume(127)

    let fadeDuration = 8 // in sec
    let smfMasterVolume = { value: 127 }
    let volume = 127 //smfMasterVolume.value
    const slope = volume / (fadeDuration/1.27)
    const timeFreq = 1000
    let timeNow = 0
    let fadeoutInterval = 0
    if (fadeoutInterval!=0) return
    fadeoutInterval = setInterval( async () => {
      timeNow += timeFreq
      volume = parseInt(volume) - parseInt(slope)
      smfMasterVolume.value = parseInt(volume)
      await smfPlayer.changeMasterVolume(smfMasterVolume.value)
      if (volume<=0) {
        setTimeout( async () => {
          smfPlayer.allSoundOff()
          smfPlayer.stopPlay()
          stopped=true;
          smfMasterVolume.value = 127
        }, timeFreq + 100)
        clearInterval(fadeoutInterval)
        fadeoutInterval = 0
      }
    }, timeFreq)
  });


  document.getElementById("midiFileList").addEventListener("change", function() {
    for(let i=0; i<parsedMidi.length; i++) {
      parsedMidi[i].eventNo=0;
    }
  });

  document.getElementById("midizero").addEventListener("click", function() {
    smfPlayer.moveEvent("zero");
    //smfPlayer=new smfPlayer(parsedMidi, midiout, latency);
  });

  document.getElementById("midiforward").addEventListener("mousedown", function() {
    smfPlayer.moveEvent("forward");
  });

  document.getElementById("midibackward").addEventListener("mousedown", function() {
    smfPlayer.moveEvent("backward");
  });

  let midiSTimerId = {"input":[], "output":[]}; // midi status TimerId
  function dispStatusMonitor(type, ch) {
    let light = document.getElementById(`midiin${ch}`);

    if(light.classList.contains('on') && !light.classList.contains('recv')) {
      setTimeout(function(){
        light.classList.add('recv');
        midiSTimerId[type][ch] = setInterval(function() {
          light.classList.remove('recv');
          clearInterval(midiSTimerId[type][ch]);
        }, 700);
      }, latency);
    }
/*
    if(light.className == "label label-default") {
      setTimeout(function(){
        light.className = "label label-warning";
        midiSTimerId[type][ch] = setInterval(function() {
          light.className = "label label-default";
          clearInterval(midiSTimerId[type][ch]);
        }, 700);
      }, latency);
    }
    */
  }

  function dispEventMonitor(msg, type, latency) {
    var messageDispArea=document.getElementById("recvMsg");
    var spanTag=document.createElement("span");
    spanTag.style.setProperty("margin", "0px 1px 0px 1px");
    spanTag.style.setProperty("color", "#ffffff");
    var msg16="";
    for(let i=0; i<msg.length; i++) {
      var tmp;
      if(typeof msg[i]==="number") {
        tmp=msg[i].toString(16);
        if(tmp.length==1) {
          tmp= "0" + tmp;
        }
      } else if(msg[i].length==4 && msg[i].substr(0,2)=="0x"){
        tmp=msg[i].substr(2, 2);
      } else {
        tmp=msg[i];
      }
      if(i==0) {
        // for status monitor
        var ch=(parseInt(tmp.substr(1, 1), 16)+1).toString(10);
        if(type!="input") {
          dispStatusMonitor("output", ch);
        }
        // for event Monitor
        var color;
        switch(tmp.substr(0, 1).toLowerCase()) {
          case "8":
            color="color:#ffffff; background-color:#23cdfd;";
            break;
          case "9":
            color="color:#ffffff; background-color:#071cd0;";
            break;
          case "a":
            color="color:#da1019; background-color:#ffffff;";
            break;
          case "b":
            color="color:#071cd0; background-color:#ffffff;";
            break;
          case "c":
            color="color:#ffffff; background-color:#da1019;";
            break;
          case "d":
            color="color:#0a6318; background-color:#ffffff;";
            break;
          case "e":
            color="color:#ffffff; background-color:#0a6318;";
            break;
          case "f":
            color="color:#ffffff; background-color:#ef1984;";
            break;
          default:
            color="color:#ffffff; background-color:#000000;";
            break;
        }
        tmp="<span style=\""+ color +"\">"+tmp+"</span>";
      }
      msg16=msg16 + " " +tmp + " ";
    }
    spanTag.innerHTML=msg16 + " ";
    dispMsgBuffer.push(spanTag);
    if(messageDispArea.firstChild!=null) {
      if(messageDispArea.childNodes.length>dispChildCSize) {
        for(let d=dispChildCSize; d<messageDispArea.childNodes.length; d++) {
          messageDispArea.removeChild(messageDispArea.childNodes[d]);
        }
        var elem=document.createElement("span");
        elem.innerHTML=".....";
        elem.style.setProperty("color", "#fffff0");
        elem.style.setProperty("background-color", "#696969");
        elem.style.setProperty("border-raduius", "3px");
        messageDispArea.appendChild(elem);
      }
    }
    if(dispMsgBuffer.length>dispBufferSize) {
      for(let i=0; i<dispMsgBuffer.length; i++) {
        messageDispArea.insertBefore(dispMsgBuffer[i], messageDispArea.firstChild);
      }
      dispMsgBuffer=[];
    }
  };



  for (let i=0; i<chInfo.length; i++) {
    let Idx=i+1;
    document.querySelector("#midiin"+Idx).addEventListener("mouseover", function(event){
      let id=event.target.id;
      document.querySelector("#"+id).style.cursor="pointer";
    });
    document.querySelector("#midiin"+Idx).addEventListener("mouseout", function(event){
      let id=event.target.id;
      document.querySelector("#"+id).style.cursor="default";
    });
    document.querySelector("#midiin"+Idx).addEventListener("mousedown", function(event){
      let id = event.target.id;
      let ch_no = parseInt(id.replace("midiin", ""))-1;
      let elem = document.querySelector("#"+id);
      console.log(id, ch_no, elem)
      if(chInfo[ch_no].on == true) {
        chInfo[ch_no].on = false;
        elem.classList.remove('on');
      } else {
        chInfo[ch_no].on = true;
        elem.classList.add('on');
      }
    });
  }

})()
