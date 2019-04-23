//Hides the pages not in use
/*function getInfo(id) {
  return document.getElementById(id)
}
function hide(tall) {
  let liste = [getInfo("introduksjon"), getInfo("oversikt"), getInfo("detaljer"), getInfo("sammenligning")]
  for (var i = 0; i < liste.length; i++) {
    liste[i].className = "hide"
  }
  if (tall != undefined) {
    liste[tall].className = "active"
  }
}*/

//The links with the data
let beskrivelser = "http://wildboy.uib.no/~tpe056/folk/"
let befolkning_2 = "http://wildboy.uib.no/~tpe056/folk/104857.json"
let sysselsatte_2 = "http://wildboy.uib.no/~tpe056/folk/100145.json"
let utdanning_2 = "http://wildboy.uib.no/~tpe056/folk/85432.json"

//Gets the data from the link
function getData(url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var info = JSON.parse(xhr.responseText);
      data.datasett = info

      if (callback) {
        callback();
      }

    };
  }
  xhr.send();
}

//Gets the names from the link
function getNames(obj) {
    let working_elem = document.getElementById("utdanning");
    working_elem.innerHTML += "<ul>"
    for (outpt in obj["elementer"]){
      working_elem.innerHTML += "<li>" + outpt + "</li>";
    }
    working_elem.innerHTML += "</ul>"
}


//Gets the kommunenummer from the links
function getIDs(data){
  var kommunenumre = [];
    for (kommune in data.elementer) {
      kommunenumre.push(data.elementer[kommune].kommunenummer);
    }
    console.log(kommunenumre);

}

//Gets information about the kommuner
function getInfo(){

}

//Loads the datasett
function load() {
  befolkning.load()
  sysselsatte.load()
  utdanning.load()
}

//Konstruktør
function Grensesnitt(url) {
  this.url = url;
  this.getNames = function() {getNames(this.datasett)}
  this.getIDs = function() {getIDs(this.datasett)}
  this.load = function() {getData(this.url, this)}
}
var utdanning = new Grensesnitt(utdanning_2)
var sysselsatte = new Grensesnitt(sysselsatte_2)
var befolkning = new Grensesnitt(befolkning_2)








//GAMLE KODEN
/*//URL til JSON filene
let beskrivelser = "http://wildboy.uib.no/~tpe056/folk/"
let befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
let sysselsatte = "http://wildboy.uib.no/~tpe056/folk/100145.json"
let utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"

var url = "http://wildboy.uib.no/~tpe056/folk/100145.json";

//getNames - Returnere alle kommunenavnene.

function getNames() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var obj = JSON.parse(xhr.responseText);
      var obj1 = xhr.responseText
      //console.log(obj["elementer"]);

      let working_elem = document.getElementById("kommune_liste");

      for (outpt in obj["elementer"]){
        working_elem.innerHTML += "<option value='" + outpt + "'>" + outpt + "</option>"

      }
      console.log(working_elem)


    }
  };
  xhr.send();
}
window.onload = getNames;
*/
