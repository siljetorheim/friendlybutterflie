//Hides the pages not in use
function hide_info(id) {
  return document.getElementById(id)
}

function hide(tall) {
  let liste = [hide_info("introduksjon"), hide_info("oversikt"), hide_info("detaljer"), hide_info("sammenligning")]
  for (var i = 0; i < liste.length; i++) {
    liste[i].className = "hide"
  }
  if (tall != undefined) {
    liste[tall].className = "active"
  }
}

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
function getNames(data) {
  var kommunenavn = [];
    for (kommune in data["elementer"]) {
      kommunenavn.push(kommune)
    }
    console.log(kommunenavn);
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
function getInfo(data, kommunenr){
  for (kommune in data.elementer) {
    if (data.elementer[kommune].kommunenummer == kommunenr) {
      console.log(data.elementer[kommune])
      return data.elementer[kommune]

    }
  }
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
  this.getInfo = function() {getInfo(this.datasett, detaljer())} //Burde være annerledes, svarer ikke helt på oppgaven
}
var utdanning = new Grensesnitt(utdanning_2)
var sysselsatte = new Grensesnitt(sysselsatte_2)
var befolkning = new Grensesnitt(befolkning_2)

//test: befolkning.getInfo(this.datasett, document.getElementById("kommune"))

//Gets info to the page Oversikt
function heihei() {
  let working_elem = document.getElementById("oversikt_kommune");
  working_elem.innerHTML += "<ul>"
  for (outpt in obj["elementer"]){
    working_elem.innerHTML += "<li>" + outpt + "</li>";
  }
  working_elem.innerHTML += "</ul>"
  console.log(outpt)
}

//Gets info to the page Detaljer
function hent_detj_kommune(iden) {
  return document.getElementById(iden).value
}

function detaljer() {
  return hent_detj_kommune("kommune") //Må legge inn conditional statement for å forhindre ugyldig kommunenr og tekstverdi
}
