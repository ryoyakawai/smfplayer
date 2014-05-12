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

function Synth() {
    this.sy=null;
    this.worker=null;
    this.que=[];
    this.Load = function(url, name, size, elemId) {
        var elem=document.getElementById(elemId);
        if(elem==null) {
            this.sy = window.open(url, name, size);
        } else {
            var iframe=document.createElement("iframe");
            iframe.src=url;
            iframe.height=200;
            iframe.width=650;
            iframe.style.setProperty("border", "1px solid #ddd");
            iframe.style.setProperty("margin", "20px");
            iframe.style.setProperty("border-radius", "5px");
            iframe.id="sy01";
            elem.appendChild(iframe);
            this.sy=iframe.contentWindow;
        }
        this.worker=new Worker('js/msgSendWorker.js');
        var self=this;
        this.worker.addEventListener('message', function(event) {
            self.SendMessage(self.sy, event.data);
        }, false);
    };
    this.NoteOn = function(note, velo) {
        this.SendMessage(this.sy, "midi,90," + note.toString(16) + "," + velo.toString(16));
    };
    this.NoteOff = function(note) {
        this.SendMessage(this.sy, "midi,80," + note.toString(16) + ",0");
    };
    this.AllSoundOff = function() {
        this.SendMessage(this.sy, "midi,b0,78,0");
    };
    this.SendMessage = function(sy, s) {
        if(this.sy) {
            this.sy.postMessage(s, "*");
        }
    };
    this.send = function(msg, time, useWorker) {
        if(useWorker==false) {
            this.sy.postMessage(msg, "*");
        } else {
            this.worker.postMessage(msg+":"+time);
        }
    };
}
var synth = new Synth();
