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
  return kommunenavn;
}

//Gets the kommunenummer from the links
function getIDs(data){
  var kommunenumre = [];
    for (kommune in data.elementer) {
      kommunenumre.push(data.elementer[kommune].kommunenummer);
    }
    console.log(kommunenumre);
    return kommunenumre;

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



//Konstruktør
function Grensesnitt(url, onload) {
  this.url = url;
  this.getNames = function() {getNames(this.datasett)}
  this.getIDs = function() {getIDs(this.datasett)}
  this.load = function() {getData(this.url, this, this.onload)}
  this.getInfo = function() {getInfo(this.datasett, detaljer())} //Burde være annerledes, svarer ikke helt på oppgaven
  this.onload = onload;
}

var befolkning = new Grensesnitt(befolkning_2, function(){sysselsatte.load()})
var utdanning = new Grensesnitt(utdanning_2, function(){program()})
var sysselsatte = new Grensesnitt(sysselsatte_2, function(){utdanning.load()})
befolkning.load()
//Til rapport: Lastet ned en etter en. Begynner med befolkning, gir nytt sysselsatte, så utdanning og til slutt laster den programmet ved hjelp av callbackfunksjonen.


function program(){
  oversikt()
}

//test: Finds the latest statistics of Sysselsatte
function statistikk_sysselsatte() {
  let statistikk = sysselsatte.datasett.elementer;
  let statistikk_liste = [];
  var liste = getNames(befolkning.datasett);
  var bef = siste_måling();

  for (var i = 0; i < liste.length; i++) {
    let sysselsatte = statistikk[liste[i]]["Begge kjønn"]["2018"]
    let antall_sysselsatte = bef[i]/100 * sysselsatte
    statistikk_liste.push(sysselsatte, antall_sysselsatte);
  }

}

/*KODER:
01 Grunnskolenivå
02a Videregående skolenivå
11 Fagskolenivå
03a Universitets- og høyskolenivå, kort
04a Universitets- og høyskolenivå, lang
09a Uoppgitt eller ingen fullført utdanning
PersonerProsent - Personer over 16år, prosent*/

function høyere_utdanning() {
  let nivå = utdanning.datasett.elementer;
  let utdanning_liste = [];
  let bef = siste_måling();
  let liste = getNames(befolkning.datasett);

  for (var i = 0; i < liste.length; i++) {
    prosent_utdanning = nivå[liste[i]]["03a"]["Kvinner"]["2017"] + nivå[liste[i]]["03a"]["Menn"]["2017"];
    antall_utdanning = bef[i]/100 * prosent_utdanning;
    console.log(prosent_utdanning, antall_utdanning);
    utdanning_liste.push(prosent_utdanning, antall_utdanning);
  }
  return utdanning_liste
}

//Finds the latest count for both genders
function siste_måling(){
  let måling = befolkning.datasett.elementer;
  let måling_liste = [];

  for (var kjønn in måling) {
    måling_liste.push(måling[kjønn].Kvinner["2018"]+måling[kjønn].Menn["2018"])
  }
  return måling_liste
}

//Gets info to the page Oversikt
function oversikt() {
  //let data = getData(this.url);
  let kommunenavnliste = getNames(befolkning.datasett);
  let kommunenummer = getIDs(befolkning.datasett);
  let måling = siste_måling();
  let ut_oversikt = document.getElementById("ul");

  for (var x in kommunenavnliste){
    let li = document.createElement("li")
    let text = document.createTextNode(kommunenavnliste[x] + " / " + kommunenummer[x] + " / " + måling[x])
    li.appendChild(text)
    ut_oversikt.appendChild(li)
  }
}

//Gets info to the page Detaljer
function hent_detj_kommune(iden) {
  return document.getElementById(iden).value

}

function detaljer() {
  return hent_detj_kommune("kommune") //Må legge inn conditional statement for å forhindre ugyldig kommunenr og tekstverdi
}
