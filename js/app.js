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

var dispMsgBuffer=[];
var dispBufferSize=30;
var dispChildCSize=200;
var timerId;
var latency=800;
var worker;
var webMidiLinkSynth=[
    {
        "id":"wml00", "version": 1, "manufacturer":"g200kg",
        "name":"[Experimental] GMPlayer (Web MIDI Link)",
        "url":"http://www.g200kg.com/webmidilink/gmplayer/",
        "size":"width=600,height=600,scrollbars=yes,resizable=yes"
    },
    {
        "id":"wml01", "version": 1, "manufacturer":"Logue",
        "name":"[Experimental] SoundFont: Yamaha XG (Web MIDI Link)",
        "url":"http://logue.github.io/smfplayer.js/wml.html",
        "size":"width=600,height=600,scrollbars=yes,resizable=yes"
    }
];

// Web MIDI API
var inputs, outputs, midiout;
var oct=0;
window.onload=function() {
    navigator.requestMIDIAccess({sysex: true}).then(scb, ecb);
};
function scb(access) {
    var midi=access;
    outputs=midi.outputs();
    var mosel=document.getElementById("midiOutSel");
    var options=new Array();
    for(var i=0; i<outputs.length; i++) {
        mosel.options[i]=new Option(outputs[i]["name"], i);
    }
    for(var i=0; i<webMidiLinkSynth.length; i++) {
        mosel.options[mosel.options.length]=new Option(webMidiLinkSynth[i].name, mosel.options.length);
    }
    document.querySelector("#midiOutSelB").removeAttribute("disabled");
    
    document.getElementById("midiOutSelB").addEventListener("click", function() {
        var port=document.getElementById("midiOutSel").value;
        
        if(port>=outputs.length) {
            var sdata=webMidiLinkSynth[port-outputs.length];
            synth.Load(sdata.url, sdata.id, sdata.size, "webmidilink");
            midiout={
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
                    for(var i=0; i<msg.length; i++) {
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

        document.getElementById("midiinicon").style.setProperty("color", "#5bc0de");
        document.getElementById("midiOutSelB").setAttribute("disabled", "disabled");
        document.getElementById("midiOutSel").setAttribute("disabled", "disabled");
        
        document.getElementById("whiteout").style.setProperty("display", "none");
        document.getElementById("panic").style.setProperty("visibility", "visible");
        
        document.getElementById("panic").addEventListener("click", function(){
            for(var i=0; i<16; i++) {
                var data=[parseInt("0xb"+i.toString(16), 16), 0x78, 0x00];
                midiout.send(data, 0);
            }
        });

        smfPlayer=new SmfPlayer(midiout);
        smfPlayer.changeUiStop=function() {
            document.getElementById("midistartB").className="glyphicon glyphicon-play";
        };

    });
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
var smfPlayer, parsedMidi=[];
var smfParser = new SmfParser();
var dA=document.getElementById("midiFileList");
dA.ondragover=function(event) {
    event.preventDefault();
    this.style.setProperty("background-color", "#dddddd");
};
dA.ondragend=dA.ondragleave=function() {
    this.style.setProperty("background-color", "#ffffff");
};
dA.ondrop=fileLoad;
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
        
        
        dispBufferSize=30;
        dispChildCSize=200;
        smfPlayer.dispEventMonitor=dispEventMonitor;

    };
    reader.readAsBinaryString(file);
    event.preventDefault();
    return false;
};




var stopped=false;
document.getElementById("midistart").addEventListener("click", function() {
    var midistartB=document.getElementById("midistartB");
    switch(midistartB.className) {
      case "glyphicon glyphicon-play":
        smfPlayer.setStartTime();
        if(stopped==true) {
            smfPlayer.changeFinished(false);
        }
        stopped=false;
        midistartB.className="glyphicon glyphicon-pause";
        var Idx=document.getElementById("midiFileList").value;
        smfPlayer.init(parsedMidi[Idx].data, latency, parsedMidi[Idx].eventNo);
        smfPlayer.startPlay();
        break;
      case "glyphicon glyphicon-pause":
        var Idx=document.getElementById("midiFileList").value;
        parsedMidi[Idx].eventNo=smfPlayer.eventNo;
        midistartB.className="glyphicon glyphicon-play";
        smfPlayer.stopPlay();
        stopped=true;
        break;
    }
});
document.getElementById("midiFileList").addEventListener("change", function() {
    for(var i=0; i<parsedMidi.length; i++) {
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





var midiSTimerId={"input":[], "output":[]}; // midi status TimerId
function dispStatusMonitor(type, ch) {
    var midiLabel;
    switch(type) {
      case "input":
        midiLabel="midiin"+ch;
        break;
      case "output":
        midiLabel="midiout"+ch;
        break;
    }
    
    var light=document.getElementById(midiLabel);
    if(light.className=="label label-default") {
        setTimeout(function(){
            light.className="label label-warning";
            midiSTimerId[type][ch]=setInterval(function() {
                light.className="label label-default";
                clearInterval(midiSTimerId[type][ch]);
            }, 700);
        }, latency);
    } 
}

function dispEventMonitor(msg, type, latency) {
    var messageDispArea=document.getElementById("recvMsg");
    var spanTag=document.createElement("span");
    spanTag.style.setProperty("margin", "0px 1px 0px 1px");
    spanTag.style.setProperty("color", "#ffffff");
    var msg16="";
    for(var i=0; i<msg.length; i++) {
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
                color="color:#ffffff; background-color:#00ffff;";
                break;
              case "9":
                color="color:#ffffff; background-color:#0000ff;";
                break;
              case "a":
                color="color:#ff0000; background-color:#ffffff;";
                break;
              case "b":
                color="color:#0000cd; background-color:#ffffff;";
                break;
              case "c":
                color="color:#ffffff; background-color:#ff0000;";
                break;
              case "d":
                color="color:#008000; background-color:#ffffff;";
                break;
              case "e":
                color="color:#ffffff; background-color:#008000;";
                break;
              case "f":
                color="color:#ffffff; background-color:#ff69b4;";
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
            for(var d=dispChildCSize; d<messageDispArea.childNodes.length; d++) {
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
        for(var i=0; i<dispMsgBuffer.length; i++) {
            messageDispArea.insertBefore(dispMsgBuffer[i], messageDispArea.firstChild);
        }
        dispMsgBuffer=[];
    }
};



var chInfo=[
    {"on":true}, {"on":true}, {"on":true}, {"on":true},
    {"on":true}, {"on":true}, {"on":true}, {"on":true},
    {"on":true}, {"on":true}, {"on":true}, {"on":true},
    {"on":true}, {"on":true}, {"on":true}, {"on":true}
];
for(var i=0; i<chInfo.length; i++) {
    var Idx=i+1;
    document.querySelector("#midiin"+Idx).addEventListener("mouseover", function(event){
        var id=event.target.id;
        document.querySelector("#"+id).style.cursor="pointer";
    });
    document.querySelector("#midiin"+Idx).addEventListener("mouseout", function(event){
        var id=event.target.id;
        document.querySelector("#"+id).style.cursor="default";
    });
    document.querySelector("#midiin"+Idx).addEventListener("mousedown", function(event){
        var id=event.target.id;
        var chNo=parseInt(id.replace("midiin", ""))-1;
        var elem=document.querySelector("#"+id);
        if(chInfo[chNo].on==true) {
            chInfo[chNo].on=false;
            elem.className="label label-default";
        } else {
            chInfo[chNo].on=true;
            elem.className="label label-success";
        }
    });
}