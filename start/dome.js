/*
 *
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2018 Jaume Fuster i Claris
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

// "Thus, programs must be written for people to read, and only incidentally for machines to execute."
// TODO: Commenting.


// ---------- CONFIGURATION ----------

// div.innerHTML : {a.innerHTML : a.href}
var sites = {
				"School": {
					"Google Drive" 			: "https://drive.google.com",
					"Canvas" 						: "https://bsd.instructure.com",
					"StudentVue" 				: "https://parentvue.beaverton.k12.or.us/PXP2_Login.aspx",
					"Gmail" 						: "https://mail.google.com",
          "Bell Schedule" 		: "https://www.beaverton.k12.or.us/schools/southridge/calendar/Pages/Bell-Schedule.aspx"
				},
				"Intranet": {
					"ESXi" 							: "https://vmware/ui/#/host",
					"Router"				 		: "http://192.168.123.250/Main_Login.asp",
					"Plex (Local)" 			: "https://falcom:32400",
					"Gitea" 						: "http://hollandaise",
					"Local Syncthing" 	: "http://localhost:8384",
					"Falcon Syncthing" 	: "http://falcon:8384",
					"Sonarr (TV)" 			: "http://falcon:8989",
					"Radarr (Movies)" 	: "http://falcon:7878",
					"QBittorrent" 			: "http://falcon:8080",
          "NextCloud" 				: "http://falcon:8080",
        	"Portainer" 				: "http://falcon:9000"
				},
				"Social": {
					"Github"						: "https://github.com/multipixelone",
					"Twitter"						: "https://twitter.com/",
					"Reddit"						: "https://reddit.com/",
					"Amazon"						: "https://amazon.com/",
					"Pushbullet" 				: "https://www.pushbullet.com",
					"OneDrive" 					: "https://onedrive.live.com/"
				},
				"Games": { // To find the game ID check the url in the store page or the community page
					"Monster Hunter World" : "steam://run/582010",
					"Cities Skylines" : "steam://run/255710",
					"Mark of the Ninja" : "steam://run/860950",
					"Space Engineers" : "steam://run/244850",
					"Sunset Overdrive" : "steam://run/847370",
					"XCOM 2" : "steam://run/268500",
					"Factorio" : "steam://run/427520"
				},
				"Streaming": {
					"Netflix" : "https://www.netflix.com",
					"YouTube"				: "https://www.youtube.com/",
					"Hulu" : "https://www.hulu.com",
					"Spotify" : "https://open.spotify.com/collection/playlists",
					"Plex (Remote)" : "https://plex.tv/web"
				},
				"Theater": {
					"MusicNotes" : "https://www.musicnotes.com/",
					"Production Calender" : "https://www.skyhawktheatre.com/copy-of-production-calendar",
					"Rehearsal Sign-In" : "https://goo.gl/forms/BkgCeX7L0EoMLxMm2",
					"Work Party Sign-In" : "https://goo.gl/forms/GFWNdG8sO15E3myx2"
				}
			};

var search = { // Query variable name is q, hardcoded, looks like a standard already anyways
				"default": "https://duckduckgo.com",
				"d": "https://duckduckgo.com/",
				"s": "https://startpage.com/do/search",
				"r": "https://reddit.com/search",
                "g": "https://google.com/search"
			};

// ---------- BUILD PAGE ----------
var pivotmatch = 0;
var totallinks = 0;
var prevregexp = "";
function matchLinks(regex = prevregexp) {
	totallinks = 0;
	pivotmatch = regex == prevregexp ? pivotmatch : 0;
	prevregexp = regex;
	pivotbuffer = pivotmatch;
	p = document.getElementById("links");
	while (p.firstChild) {
		p.removeChild(p.firstChild);
	}
	if (regex.charAt(1) == ' ' && search.hasOwnProperty(regex.charAt(0))) {
		document.getElementById("action").action = search[regex.charAt(0)];
		document.getElementById("action").children[0].name = "q";
	} else {
		match = new RegExp(regex ? regex : ".", "i");
		gmatches = false; // kinda ugly, rethink
		for (i = 0; i < Object.keys(sites).length; i++) {
			matches = false;
			sn = Object.keys(sites)[i];
			section = document.createElement("div");
			section.id = sn;
			section.innerHTML = sn;
			section.className = "section";
			inner = document.createElement("div");
			for (l = 0; l < Object.keys(sites[sn]).length; l++) {
				ln = Object.keys(sites[sn])[l];
				if (match.test(ln)) {
					link = document.createElement("a");
					link.href = sites[sn][ln];
					link.innerHTML = ln;
					if (!pivotbuffer++ && regex != "") {
						link.className = "selected";
						document.getElementById("action").action = sites[sn][ln];
						document.getElementById("action").children[0].removeAttribute("name");
					}
					inner.appendChild(link);
					matches = true;
					gmatches = true;
					totallinks++;
				}
			}
			section.appendChild(inner);
			matches ? p.appendChild(section) : false;
		}
		if (!gmatches || regex == "") {
			document.getElementById("action").action = search["default"];
			document.getElementById("action").children[0].name = "q";
		}
	}
	document.getElementById("main").style.height = document.getElementById("main").children[0].offsetHeight+"px";
}

document.onkeydown = function(e) {
	switch (e.keyCode) {
		case 38:
			pivotmatch = pivotmatch >= 0 ? 0 : pivotmatch + 1;
			matchLinks();
			break;
		case 40:
			pivotmatch = pivotmatch <= -totallinks + 1 ? -totallinks + 1 : pivotmatch - 1;
			matchLinks();
			break;
		default:
			break;
	}
	document.getElementById("action").children[0].focus();
}

document.getElementById("action").children[0].onkeypress = function(e) {
	if (e.key == "ArrowDown" || e.key == "ArrowUp") {
		return false;
	}
}
/*
function displayClosk() {
	var d = new Date();
  var hh = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var dd = "AM";
  var h = hh;
  if (h >= 12) {
    h = hh - 12;
    dd = "PM";
  }
  if (h == 0) {
    h = 12;
  }
  m = m < 10 ? "0" + m : m;

  s = s < 10 ? "0" + s : s;

  clock = new RegExp("0?" + hh + ":" + m + ":" + s);

  var replacement = h + ":" + m;
  replacement += " " + dd;

	document.getElementById("clock").innerHTML = clock;
}
*/

function displayClock() {
	now = new Date();
	clock = (now.getHours() < 10 ? "0"+now.getHours() : now.getHours())+":"
			+(now.getMinutes() < 10 ? "0"+now.getMinutes() : now.getMinutes())+":"
			+(now.getSeconds() < 10 ? "0"+now.getSeconds() : now.getSeconds());
	document.getElementById("clock").innerHTML = clock;
}

window.onload = matchLinks();
document.getElementById("action").onsubmit = function() {
	svalue = this.children[0].value;
	if (svalue.charAt(1) == ' ' && search.hasOwnProperty(svalue.charAt(0))) {
		this.children[0].value = svalue.substring(2);
	}
	return true;
}
displayClock();
setInterval(displayClock, 1000);
