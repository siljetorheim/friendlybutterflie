//-------------------Hide--------------------------------------------------------------------------------------
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



//-------------------Data--------------------------------------------------------------------------------------
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
  return kommunenavn;
}

function getNameKommune(data, kommunenr) {
  for (kommune in data.elementer) {
    if (data.elementer[kommune].kommunenummer == kommunenr) {
      return kommune
    }
  }
}

//Gets the kommunenummer from the links
function getIDs(data){
  var kommunenumre = [];
    for (kommune in data.elementer) {
      kommunenumre.push(data.elementer[kommune].kommunenummer);
    }
    return kommunenumre;

}

//Gets information about the kommuner
function getInfo(data, kommunenr){
  for (kommune in data.elementer) {
    if (data.elementer[kommune].kommunenummer == kommunenr) {
      return data.elementer[kommune]

    }
  }
}




//-------------------Konstruktør--------------------------------------------------------------------------------------
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


//-------------------Sysselsatte--------------------------------------------------------------------------------------
//Finds the latest statistics of Sysselsatte
function statistikk_sysselsatt(kommunenr) {
  let statistikk = getInfo(sysselsatte.datasett, kommunenr)
  let statistikk_liste_beggekjønn = [];
  let statistikk_liste_kvinner = [];
  let statistikk_liste_menn = [];
  var bef = siste_måling_spes(kommunenr);

//-----Finner sysselsatte siste året, både prosent og tall----
  const sisteAarpro = statistikk["Begge kjønn"]["2018"]
  const sisteAar = bef/100 * statistikk["Begge kjønn"]["2018"]

//-----Finner historisk data for sysselsatte, prosent og tall-----
  for (aarstall in statistikk["Begge kjønn"]) {
    let pro_sysselsatt = statistikk["Begge kjønn"][aarstall]
    let antall_sysselsatte = bef/100 * statistikk["Begge kjønn"][aarstall]
    statistikk_liste_beggekjønn.push({"aarstall": aarstall, "antall_sysselsatte": antall_sysselsatte, "pro_sysselsatt": pro_sysselsatt});
  }

  for (aarstall in statistikk["Kvinner"]) {
    let pro_sysselsatt = statistikk["Kvinner"][aarstall]
    let antall_sysselsatte = bef/100 * statistikk["Kvinner"][aarstall]
    statistikk_liste_kvinner.push({"aarstall": aarstall, "antall_sysselsatte": antall_sysselsatte, "pro_sysselsatt": pro_sysselsatt});
  }

  for (aarstall in statistikk["Menn"]) {
    let pro_sysselsatt = statistikk["Menn"][aarstall]
    let antall_sysselsatte = bef/100 * statistikk["Menn"][aarstall]
    statistikk_liste_menn.push({"aarstall": aarstall, "antall_sysselsatte": antall_sysselsatte, "pro_sysselsatt": pro_sysselsatt});
  }

  return {"sisteAar": sisteAar, "sisteAarpro": sisteAarpro, "liste_beggekjønn": statistikk_liste_beggekjønn, "liste_kvinner": statistikk_liste_kvinner, "liste_menn": statistikk_liste_menn}

}


//-------------------Utdanning--------------------------------------------------------------------------------------
//Finds the latest statistic for utdanning
/*KODER:
01 Grunnskolenivå
02a Videregående skolenivå
11 Fagskolenivå
03a Universitets- og høyskolenivå, kort
04a Universitets- og høyskolenivå, lang
09a Uoppgitt eller ingen fullført utdanning
PersonerProsent - Personer over 16år, prosent*/

function høyere_utdanning(kommunenr) {
  let nivå = getInfo(utdanning.datasett, kommunenr)
  let nivå_liste_beggekjønn = [];
  let nivå_liste_kvinner = [];
  let nivå_liste_menn = [];
  var bef = siste_måling_spes(kommunenr);

  const sisteAarpro = nivå["03a"]["Menn"]["2017"]+nivå["03a"]["Kvinner"]["2017"]
  const sisteAar = bef/100 * nivå["03a"]["Menn"]["2017"] + nivå["03a"]["Kvinner"]["2017"]

  return {"sisteAarpro": sisteAarpro, "sisteAar": sisteAar}

}

//-------------------Siste måling--------------------------------------------------------------------------------------
//Finds the latest count for both genders
function siste_måling(){
  let måling = befolkning.datasett.elementer;
  let måling_liste = [];

  for (var kjønn in måling) {
    måling_liste.push(måling[kjønn].Kvinner["2018"] + måling[kjønn].Menn["2018"])
  }
  return måling_liste
}

function siste_måling_spes(kommunenr){
  let måling = befolkning.datasett.elementer;

  for (var kjønn in måling) {
    if (måling[kommune].kommunenummer == kommunenr) {
      return måling[kjønn].Kvinner["2018"]+måling[kjønn].Menn["2018"]

    }
  }
}



//-------------------OVERSIKT--------------------------------------------------------------------------------------
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



//-------------------DETALJER--------------------------------------------------------------------------------------
//Gets info to the page Detaljer
function hent_detj_kommune(iden) {
  return document.getElementById(iden).value

}

function detaljer() {

  document.getElementById("siste_aaret").innerHTML = ""
  document.getElementById("ul_kjønn").innerHTML= ""
  document.getElementById("ul_kvinner").innerHTML = ""
  document.getElementById("ul_menn").innerHTML= ""

 const kommunenummer = hent_detj_kommune("kommune") //Må legge inn conditional statement for å forhindre ugyldig kommunenr og tekstverdi
 let statestikk_s = statistikk_sysselsatt(kommunenummer)
 let høy_ut = høyere_utdanning(kommunenummer)

//--------------------------Siste året--------------------------------
 let sisteAaret = document.getElementById("siste_aaret");

//Kommunenavn
 let kommunenavn = getNameKommune(befolkning.datasett, kommunenummer)
 let linavn = document.createElement("li")
 let textnavn = document.createTextNode("Kommunenavn: " + kommunenavn)
 linavn.appendChild(textnavn)
 sisteAaret.appendChild(linavn)

//Kommunenummer
 let linummer = document.createElement("li")
 let textnummer = document.createTextNode("Kommunenummer: " + kommunenummer)
 linummer.appendChild(textnummer)
 sisteAaret.appendChild(linummer)

//Siste måling befolkning
 let siste_mål = siste_måling_spes(kommunenummer)
 let lisismål = document.createElement("li")
 let textsismål = document.createTextNode("Siste måling befolkning: " + siste_mål)
 lisismål.appendChild(textsismål)
 sisteAaret.appendChild(lisismål)

 //Sysselsatte i tall
  let lisyst = document.createElement("li")
  let textsyst = document.createTextNode("Sysselsetting det siste året: " + statestikk_s.sisteAar.toFixed(0))
  lisyst.appendChild(textsyst)
  sisteAaret.appendChild(lisyst)

//Sysselsatte i prosent
 let lisys = document.createElement("li")
 let textsys = document.createTextNode("Prosentvis sysselsetting det siste året: " + statestikk_s.sisteAarpro)
 lisys.appendChild(textsys)
 sisteAaret.appendChild(lisys)

 //Utdanning i tall
  let liutdan = document.createElement("li")
  let textutdan = document.createTextNode("Høyere utdanning det siste året: " + høy_ut.sisteAar.toFixed(0))
  liutdan.appendChild(textutdan)
  sisteAaret.appendChild(liutdan)

//Utdanning i prosent
 let liutp = document.createElement("li")
 let textutp = document.createTextNode("Prosentvis utdanning det siste året: " + høy_ut.sisteAarpro)
 liutp.appendChild(textutp)
 sisteAaret.appendChild(liutp)



 //---------------------------Historisk data-------------------------------

 let ul_kjønn = document.getElementById("ul_kjønn");
 let ul_kvinner = document.getElementById("ul_kvinner");
 let ul_menn = document.getElementById("ul_menn");

 for (var x in statestikk_s.liste_beggekjønn){
   let li = document.createElement("li")
   let text = document.createTextNode(statestikk_s.liste_beggekjønn[x].aarstall +" Antall sysselsatte: "+ statestikk_s.liste_beggekjønn[x].antall_sysselsatte.toFixed(0)+" Prosent sysselsatte: "+statestikk_s.liste_beggekjønn[x].pro_sysselsatt)
   li.appendChild(text)
   ul_kjønn.appendChild(li)
 }
 for (var x in statestikk_s.liste_kvinner){
   let li = document.createElement("li")
   let text = document.createTextNode(statestikk_s.liste_kvinner[x].aarstall +" Antall sysselsatte: "+ statestikk_s.liste_kvinner[x].antall_sysselsatte.toFixed(0)+" Prosent sysselsatte: "+statestikk_s.liste_kvinner[x].pro_sysselsatt)
   li.appendChild(text)
   ul_kvinner.appendChild(li)
 }
 for (var x in statestikk_s.liste_menn){
   let li = document.createElement("li")
   let text = document.createTextNode(statestikk_s.liste_menn[x].aarstall +" Antall sysselsatte: "+ statestikk_s.liste_menn[x].antall_sysselsatte.toFixed(0)+" Prosent sysselsatte: "+statestikk_s.liste_menn[x].pro_sysselsatt)
   li.appendChild(text)
   ul_menn.appendChild(li)
 }

}

//-------------------SAMMENLIGNING--------------------------------------------------------------------------------------
//Gets info to the page sammenligning
function sammenligning() {
  document.getElementById("sammen_kvinner").innerHTML = ""
  document.getElementById("sammen_menn").innerHTML= ""
  document.getElementById("sammen_kvinner_to").innerHTML= ""
  document.getElementById("sammen_menn_to").innerHTML= ""

 const kommunenummer = hent_detj_kommune("kommune_1") //Må legge inn conditional statement for å forhindre ugyldig kommunenr og tekstverdi
 const kommunenummer_to = hent_detj_kommune("kommune_2")
 let statestikk_s = statistikk_sysselsatt(kommunenummer)
 let statestikk_syssel = statistikk_sysselsatt(kommunenummer_to)

 let ul_kvinner = document.getElementById("sammen_kvinner");
 let ul_kvinner_to = document.getElementById("sammen_kvinner_to");
 let ul_menn = document.getElementById("sammen_menn");
 let ul_menn_to = document.getElementById("sammen_menn_to");

 for (var x in statestikk_s.liste_kvinner){
   let li = document.createElement("li")
   let text = document.createTextNode(statestikk_s.liste_kvinner[x].aarstall +" Prosent sysselsatte: "+statestikk_s.liste_kvinner[x].pro_sysselsatt)
   li.appendChild(text)
   ul_kvinner.appendChild(li)
 }
 for (var x in statestikk_s.liste_menn){
   let li = document.createElement("li")
   let text = document.createTextNode(statestikk_s.liste_menn[x].aarstall +" Prosent sysselsatte: "+statestikk_s.liste_menn[x].pro_sysselsatt)
   li.appendChild(text)
   ul_menn.appendChild(li)
 }
 for (var x in statestikk_syssel.liste_kvinner){
   let li = document.createElement("li")
   let text = document.createTextNode(statestikk_syssel.liste_kvinner[x].aarstall +" Prosent sysselsatte: "+statestikk_syssel.liste_kvinner[x].pro_sysselsatt)
   li.appendChild(text)
   ul_kvinner_to.appendChild(li)
 }
 for (var x in statestikk_syssel.liste_menn){
   let li = document.createElement("li")
   let text = document.createTextNode(statestikk_syssel.liste_menn[x].aarstall +" Prosent sysselsatte: "+statestikk_syssel.liste_menn[x].pro_sysselsatt)
   li.appendChild(text)
   ul_menn_to.appendChild(li)
 }

 let navn_kommune = document.getElementById("navn_kommune");
 let navn_kommune_to = document.getElementById("navn_kommune_to")

//Kommunenavn
 let kommunenavn = getNameKommune(befolkning.datasett, kommunenummer)
 let kommunenavn_to = getNameKommune(befolkning.datasett, kommunenummer_to)
 let linavn = document.createElement("row")
 let linavn_to = document.createElement("row")
 let textnavn = document.createTextNode(kommunenavn)
 let textnavn_to = document.createTextNode(kommunenavn_to)
 linavn.appendChild(textnavn)
 linavn_to.appendChild(textnavn_to)
 navn_kommune.appendChild(linavn)
 navn_kommune_to.appendChild(linavn_to)
}
