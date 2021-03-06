
//-------------------Skjul--------------------------------------------------------------------------------------
// Skjuler sidene som ikke er aktive
function hide_info(id) {
  return document.getElementById(id);
}

function hide(tall) {
  let liste = [hide_info("introduksjon"), hide_info("oversikt"), hide_info("detaljer"), hide_info("sammenligning")];
  for (var i = 0; i < liste.length; i++) {
    liste[i].className = "hide";
  }
  if (tall != undefined) {
    liste[tall].className = "active";
  }
}

//-------------------Data--------------------------------------------------------------------------------------
// Linker fra alle datasettene
let beskrivelser = "http://wildboy.uib.no/~tpe056/folk/";
let befolkning_2 = "http://wildboy.uib.no/~tpe056/folk/104857.json";
let sysselsatte_2 = "http://wildboy.uib.no/~tpe056/folk/100145.json";
let utdanning_2 = "http://wildboy.uib.no/~tpe056/folk/85432.json";

// Henter ut data fra linkene
function getData(url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var info = JSON.parse(xhr.responseText);
      data.datasett = info;

     if (callback) {
        callback();
      }
    }
  };
  xhr.send();
}

// Lager lister med alle kommunenavn fra linkene
function getNames(data) {
  var kommunenavn = [];
    for (var kommune in data.elementer) {
      kommunenavn.push(kommune);
    }
  return kommunenavn;
}

// Henter navn på kommunene ved hjelp av kommunenummer
function getNameKommune(data, kommunenr) {
  for (var kommune in data.elementer) {
    if (data.elementer[kommune].kommunenummer == kommunenr) {

      return kommune;
    }
  }
}

// Finner alle kommunenummer fra linkene
function getIDs(data){
  var kommunenumre = [];
    for (var kommune in data.elementer) {
      kommunenumre.push(data.elementer[kommune].kommunenummer);
    }
    return kommunenumre;
}

// Finner all informasjon om hver enkelt kommune
function getInfo(data, kommunenr){
  for (var kommune in data.elementer) {
    if (data.elementer[kommune].kommunenummer == kommunenr) {
      return data.elementer[kommune];

    }
  }
}

//-------------------Konstruktør--------------------------------------------------------------------------------------
function Grensesnitt(url, onload) {
  this.url = url;
  this.getNames = function() {getNames(this.datasett)};
  this.getIDs = function() {getIDs(this.datasett)};
  this.load = function() {getData(this.url, this, this.onload)};
  this.getInfo = function() {getInfo(this.datasett, detaljer())};
  this.onload = onload;
}

var befolkning = new Grensesnitt(befolkning_2, function(){sysselsatte.load()});
var utdanning = new Grensesnitt(utdanning_2, function(){program()});
var sysselsatte = new Grensesnitt(sysselsatte_2, function(){utdanning.load(), console.log("done")});
befolkning.load();

function program(){
  oversikt();
}

//-------------------Sysselsatte--------------------------------------------------------------------------------------
// Finner siste statistikk for sysselsatte
function statistikk_sysselsatt(kommunenr) {
  let statistikk = getInfo(sysselsatte.datasett, kommunenr);
  let statistikk_liste_beggekjønn = [];
  let statistikk_liste_kvinner = [];
  let statistikk_liste_menn = [];
  var bef = siste_måling_spes(kommunenr);

// Finner sysselsatte siste året, både prosent og tall
  const sisteAarpro = statistikk["Begge kjønn"]["2018"];
  const sisteAar = bef/100 * statistikk["Begge kjønn"]["2018"];

// Finner historisk data for sysselsatte, prosent og tall
  for (var aarstall in statistikk["Begge kjønn"]) {
    let pro_sysselsatt = statistikk["Begge kjønn"][aarstall];
    let antall_sysselsatte = bef/100 * statistikk["Begge kjønn"][aarstall];
    statistikk_liste_beggekjønn.push({"aarstall": aarstall, "antall_sysselsatte": antall_sysselsatte, "pro_sysselsatt": pro_sysselsatt});
  }

  for (var aarstall in statistikk["Kvinner"]) {
    let pro_sysselsatt = statistikk["Kvinner"][aarstall];
    let antall_sysselsatte = bef/100 * statistikk["Kvinner"][aarstall];
    statistikk_liste_kvinner.push({"aarstall": aarstall, "antall_sysselsatte": antall_sysselsatte, "pro_sysselsatt": pro_sysselsatt});
  }

  for (var aarstall in statistikk["Menn"]) {
    let pro_sysselsatt = statistikk["Menn"][aarstall];
    let antall_sysselsatte = bef/100 * statistikk["Menn"][aarstall];
    statistikk_liste_menn.push({"aarstall": aarstall, "antall_sysselsatte": antall_sysselsatte, "pro_sysselsatt": pro_sysselsatt});
  }
  return {"sisteAar": sisteAar, "sisteAarpro": sisteAarpro, "liste_beggekjønn": statistikk_liste_beggekjønn, "liste_kvinner": statistikk_liste_kvinner, "liste_menn": statistikk_liste_menn};
}

//-------------------Utdanning--------------------------------------------------------------------------------------
function hoyere_utdanning(kommunenr) {
  let nivå = getInfo(utdanning.datasett, kommunenr);
  let nivå_liste_beggekjønn = [];
  let nivå_liste_kvinner_kort = [];
  let nivå_liste_kvinner_lang = [];
  let nivå_liste_menn_kort = [];
  let nivå_liste_menn_lang = [];
  var bef = siste_måling_spes(kommunenr);

  const sisteAarpro = (nivå["03a"]["Menn"]["2017"]+nivå["03a"]["Kvinner"]["2017"]+nivå["04a"]["Menn"]["2017"]+nivå["04a"]["Kvinner"]["2017"])/4;
  const sisteAar = bef/100 * (nivå["03a"]["Menn"]["2017"] + nivå["03a"]["Kvinner"]["2017"] + nivå["04a"]["Menn"]["2017"] + nivå["04a"]["Kvinner"]["2017"]);

  for (var aarstall in nivå["03a"]["Kvinner"]) {
    let pro_utdanning = nivå["03a"]["Kvinner"][aarstall];
    let antall_utdanning = bef/100 * nivå["03a"]["Kvinner"][aarstall];
    nivå_liste_kvinner_kort.push({"aarstall": aarstall, "antall_utdanning": antall_utdanning, "pro_utdanning": pro_utdanning});
  }

  for (var aarstall in nivå["04a"]["Kvinner"]) {
    let pro_utdanning = nivå["04a"]["Kvinner"][aarstall];
    let antall_utdanning = bef/100 * nivå["03a"]["Kvinner"][aarstall];
    nivå_liste_kvinner_lang.push({"aarstall": aarstall, "antall_utdanning": antall_utdanning, "pro_utdanning": pro_utdanning});
  }

  for (var aarstall in nivå["03a"]["Menn"]) {
    let pro_utdanning = nivå["03a"]["Menn"][aarstall];
    let antall_utdanning = bef/100 * nivå["03a"]["Menn"][aarstall];
    nivå_liste_menn_kort.push({"aarstall": aarstall, "antall_utdanning": antall_utdanning, "pro_utdanning": pro_utdanning});
  }

  for (var aarstall in nivå["04a"]["Menn"]) {
    let pro_utdanning = nivå["04a"]["Menn"][aarstall];
    let antall_utdanning = bef/100 * nivå["04a"]["Menn"][aarstall];
    nivå_liste_menn_lang.push({"aarstall": aarstall, "antall_utdanning": antall_utdanning, "pro_utdanning": pro_utdanning});
  }
  return {"sisteAarpro": sisteAarpro, "sisteAar": sisteAar, "liste_kvinner_kort": nivå_liste_kvinner_kort, "liste_kvinner_lang": nivå_liste_kvinner_lang, "liste_menn_kort": nivå_liste_menn_kort, "liste_menn_lang": nivå_liste_menn_lang};
}

//-------------------Siste måling--------------------------------------------------------------------------------------
// Finner total befolkning for begge kjønn
function siste_måling(){
  let måling = befolkning.datasett.elementer;
  let måling_liste = [];

  for (var kjønn in måling) {
    måling_liste.push(måling[kjønn].Kvinner["2018"] + måling[kjønn].Menn["2018"]);
  }
  return måling_liste;
}

function siste_måling_spes(kommunenr){
  let måling = befolkning.datasett.elementer;

  for (var kjønn in måling) {
    if (måling[kjønn].kommunenummer == kommunenr) {
      return måling[kjønn].Kvinner["2018"]+måling[kjønn].Menn["2018"];

    }
  }
}

//-------------------OVERSIKT--------------------------------------------------------------------------------------
// Sender informasjon til siden "Oversikt"
function oversikt() {

  let kommunenavnliste = getNames(befolkning.datasett);
  let kommunenummer = getIDs(befolkning.datasett);
  let måling = siste_måling();
  let ut_oversikt = document.getElementById("ul");


  for (var x in kommunenavnliste){
    let li = document.createElement("li");
    let text = document.createTextNode(kommunenavnliste[x] + " / " + kommunenummer[x] + " / " + måling[x]);
    li.appendChild(text);
    ut_oversikt.appendChild(li);
  }
}

//-------------------DETALJER--------------------------------------------------------------------------------------
// Sender informasjon til siden "Detaljer"
function hent_detj_kommune(iden) {
  let kommunenr = document.getElementById(iden).value;
  if (isValidKommune(kommunenr)) {
    return kommunenr;
  } else {
    return null;
  }
}

// Sender informasjon til siden "Detaljer"
function isValidKommune(str) {
  if (!isNaN(str) && str.length === 4 && getNameKommune(befolkning.datasett, str) !== undefined) {
    return true;
  } else {
    return false;
  }
}


function detaljer() {
  document.getElementById("kommuneErrorMessage").classList.add("hide");
  document.getElementById("siste_aaret").innerHTML = ""
  document.getElementById("ul_kjønn").innerHTML= ""
  document.getElementById("ul_kvinner").innerHTML = ""
  document.getElementById("ul_menn").innerHTML= ""
  document.getElementById("ul_kvinner_utdanning_kort").innerHTML = ""
  document.getElementById("ul_kvinner_utdanning_lang").innerHTML= ""
  document.getElementById("ul_menn_utdanning_kort").innerHTML = ""
  document.getElementById("ul_menn_utdanning_lang").innerHTML= ""

 const kommunenummer = hent_detj_kommune("kommune");
 if (kommunenummer !== null) {
   let statistikk_sysselsatte_kommune1 = statistikk_sysselsatt(kommunenummer);
   let hoy_utdanning = hoyere_utdanning(kommunenummer);

  //--------------------------Siste året--------------------------------
   let sisteAaret = document.getElementById("siste_aaret");

  // Kommunenavn
   let kommunenavn = getNameKommune(befolkning.datasett, kommunenummer);
   let linavn = document.createElement("li");
   let textnavn = document.createTextNode("Kommunenavn: " + kommunenavn);
   linavn.appendChild(textnavn);
   sisteAaret.appendChild(linavn);

  // Kommunenummer
   let linummer = document.createElement("li");
   let textnummer = document.createTextNode("Kommunenummer: " + kommunenummer);
   linummer.appendChild(textnummer);
   sisteAaret.appendChild(linummer);

  // Siste måling befolkning
   let siste_mål = siste_måling_spes(kommunenummer);
   let lisismål = document.createElement("li");
   let textsismål = document.createTextNode("Siste måling befolkning: " + siste_mål);
   lisismål.appendChild(textsismål);
   sisteAaret.appendChild(lisismål);

   // Sysselsatte i tall
    let lisyst = document.createElement("li");
    let textsyst = document.createTextNode("Sysselsetting det siste året: " + statistikk_sysselsatte_kommune1.sisteAar.toFixed(0));
    lisyst.appendChild(textsyst);
    sisteAaret.appendChild(lisyst);

  // Sysselsatte i prosent
   let lisys = document.createElement("li");
   let textsys = document.createTextNode("Prosentvis sysselsetting det siste året: " + statistikk_sysselsatte_kommune1.sisteAarpro + "%");
   lisys.appendChild(textsys);
   sisteAaret.appendChild(lisys);

   // Utdanning i tall
    let liutdan = document.createElement("li");
    let textutdan = document.createTextNode("Høyere utdanning det siste året: " + hoy_utdanning.sisteAar.toFixed(0));
    liutdan.appendChild(textutdan);
    sisteAaret.appendChild(liutdan);

  // Utdanning i prosent
   let liutp = document.createElement("li");
   let textutp = document.createTextNode("Gjennomsnitt høyere utdanning det siste året: " + hoy_utdanning.sisteAarpro.toFixed(0));
   liutp.appendChild(textutp);
   sisteAaret.appendChild(liutp);

   //---------------------------Historisk data-------------------------------

   let ul_kjønn = document.getElementById("ul_kjønn");
   let ul_kvinner = document.getElementById("ul_kvinner");
   let ul_menn = document.getElementById("ul_menn");
   let ul_kvinner_utdanning_kort = document.getElementById("ul_kvinner_utdanning_kort");
   let ul_kvinner_utdanning = document.getElementById("ul_kvinner_utdanning_kort");
   let ul_menn_utdanning_kort = document.getElementById("ul_menn_utdanning_kort");
   let ul_menn_utdanning_lang = document.getElementById("ul_menn_utdanning_lang");

   for (var x in statistikk_sysselsatte_kommune1.liste_beggekjønn){
     let li = document.createElement("li");
     let text = document.createTextNode(statistikk_sysselsatte_kommune1.liste_beggekjønn[x].aarstall +": Sysselsatte antall/prosent: "+ statistikk_sysselsatte_kommune1.liste_beggekjønn[x].antall_sysselsatte.toFixed(0)+" / "+statistikk_sysselsatte_kommune1.liste_beggekjønn[x].pro_sysselsatt + "%");
     li.appendChild(text);
     ul_kjønn.appendChild(li);
   }

   for (var x in statistikk_sysselsatte_kommune1.liste_kvinner){
     let li = document.createElement("li");
     let text = document.createTextNode(statistikk_sysselsatte_kommune1.liste_kvinner[x].aarstall +": Sysselsatte antall/prosent: "+ statistikk_sysselsatte_kommune1.liste_kvinner[x].antall_sysselsatte.toFixed(0)+" / "+statistikk_sysselsatte_kommune1.liste_kvinner[x].pro_sysselsatt + "%");
     li.appendChild(text);
     ul_kvinner.appendChild(li);
   }

   for (var x in hoy_utdanning.liste_kvinner_kort){
     let li = document.createElement("li");
     let text = document.createTextNode(hoy_utdanning.liste_kvinner_kort[x].aarstall +": Kort utdannelse antall/prosent: "+ hoy_utdanning.liste_kvinner_kort[x].antall_utdanning.toFixed(0)+" / "+hoy_utdanning.liste_kvinner_kort[x].pro_utdanning + "%");
     li.appendChild(text);
     ul_kvinner_utdanning_kort.appendChild(li);
   }

   for (var x in hoy_utdanning.liste_kvinner_lang){
     let li = document.createElement("li");
     let text = document.createTextNode(hoy_utdanning.liste_kvinner_lang[x].aarstall +": Lang utdannelse antall/prosent: "+ hoy_utdanning.liste_kvinner_lang[x].antall_utdanning.toFixed(0)+" / "+hoy_utdanning.liste_kvinner_lang[x].pro_utdanning + "%");
     li.appendChild(text);
     ul_kvinner_utdanning_lang.appendChild(li);
   }

   for (var x in statistikk_sysselsatte_kommune1.liste_menn){
     let li = document.createElement("li");
     let text = document.createTextNode(statistikk_sysselsatte_kommune1.liste_menn[x].aarstall +": Sysselsatte antall/prosent:"+ statistikk_sysselsatte_kommune1.liste_menn[x].antall_sysselsatte.toFixed(0)+" / "+statistikk_sysselsatte_kommune1.liste_menn[x].pro_sysselsatt + "%");
     li.appendChild(text);
     ul_menn.appendChild(li);
   }

   for (var x in hoy_utdanning.liste_menn_kort){
     let li = document.createElement("li");
     let text = document.createTextNode(hoy_utdanning.liste_menn_kort[x].aarstall +": Kort utdannelse antall/prosent: "+ hoy_utdanning.liste_menn_kort[x].antall_utdanning.toFixed(0)+" / "+hoy_utdanning.liste_menn_kort[x].pro_utdanning + "%");
     li.appendChild(text);
     ul_menn_utdanning_kort.appendChild(li);
   }

   for (var x in hoy_utdanning.liste_menn_lang){
     let li = document.createElement("li");
     let text = document.createTextNode(hoy_utdanning.liste_menn_lang[x].aarstall +": Lang utdannelse antall/prosent: "+ hoy_utdanning.liste_menn_lang[x].antall_utdanning.toFixed(0)+" / "+hoy_utdanning.liste_menn_lang[x].pro_utdanning + "%");
     li.appendChild(text);
     ul_menn_utdanning_lang.appendChild(li);
   }
 } else {
   document.getElementById("kommuneErrorMessage").classList.remove("hide");
 }
}

//-------------------SAMMENLIGNING--------------------------------------------------------------------------------------
// Sender informasjon til siden "Sammenligning"
function sammenligning() {
  document.getElementById("sammen_kvinner").innerHTML = ""
  document.getElementById("sammen_menn").innerHTML= ""
  document.getElementById("sammen_kvinner_to").innerHTML= ""
  document.getElementById("sammen_menn_to").innerHTML= ""
  document.getElementById("navn_kommune").innerHTML = ""
  document.getElementById("navn_kommune_to").innerHTML= ""
  document.getElementById("navn_kommune_tre").innerHTML= ""
  document.getElementById("navn_kommune_fire").innerHTML= ""

 const kommunenummer = hent_detj_kommune("kommune_1");
 const kommunenummer_to = hent_detj_kommune("kommune_2");
 let statistikk_sysselsatte_kommune1 = statistikk_sysselsatt(kommunenummer);
 let statistikk_sysselsatte_kommune2 = statistikk_sysselsatt(kommunenummer_to);

 let ul_kvinner = document.getElementById("sammen_kvinner");
 let ul_kvinner_to = document.getElementById("sammen_kvinner_to");
 let ul_menn = document.getElementById("sammen_menn");
 let ul_menn_to = document.getElementById("sammen_menn_to");

 let l01 = [0];
 let l02 = [0];
 let l03 = [0];
 let l04 = [0];

 let liste_prosent_sysselsatte_kvinner_kommune1 = [];
 let liste_prosentvekst_kvinner_kommune1 = [];
 let liste_prosent_sysselsatte_kvinner_kommune2 = [];
 let liste_prosentvekst_kvinner_kommune2 = [];
 let liste_prosent_sysselsatte_menn_kommune1 = [];
 let liste_prosentvekst_menn_kommune1 = [];
 let liste_prosent_sysselsatte_menn_kommune2 = [];
 let liste_prosentvekst_menn_kommune2 = [];

  //Regner ut prosentvekst
  for (var i = 0; i < statistikk_sysselsatte_kommune1.liste_kvinner.length-1; i++) {
    l01.push(statistikk_sysselsatte_kommune1.liste_kvinner[i+1].pro_sysselsatt - statistikk_sysselsatte_kommune1.liste_kvinner[i].pro_sysselsatt);
  }

  for (var i = 0; i < statistikk_sysselsatte_kommune2.liste_kvinner.length-1; i++) {
    l02.push(statistikk_sysselsatte_kommune2.liste_kvinner[i+1].pro_sysselsatt-statistikk_sysselsatte_kommune2.liste_kvinner[i].pro_sysselsatt);
  }

  for (var i = 0; i < statistikk_sysselsatte_kommune1.liste_menn.length-1; i++) {
    l03.push(statistikk_sysselsatte_kommune1.liste_menn[i+1].pro_sysselsatt-statistikk_sysselsatte_kommune1.liste_menn[i].pro_sysselsatt);
  }

  for (var i = 0; i < statistikk_sysselsatte_kommune2.liste_menn.length-1; i++) {
    l04.push(statistikk_sysselsatte_kommune2.liste_menn[i+1].pro_sysselsatt-statistikk_sysselsatte_kommune2.liste_menn[i].pro_sysselsatt);
  }

 for (var x = 0; x < statistikk_sysselsatte_kommune1.liste_kvinner.length; x++){
   let li = document.createElement("li");
   let text = document.createTextNode(statistikk_sysselsatte_kommune1.liste_kvinner[x].aarstall +" Prosent sysselsatte: "+statistikk_sysselsatte_kommune1.liste_kvinner[x].pro_sysselsatt);
   li.appendChild(text);
   if (l01[x] != l02[x]) li.style.color = (l01[x] > l02[x]) ? "green" : "";
   if (l01[x] != 0) li.innerHTML += (l01[x] > 0) ? " &#x2191;" : " &#x2193;";
   ul_kvinner.appendChild(li);
   liste_prosent_sysselsatte_kvinner_kommune1.push(statistikk_sysselsatte_kommune1.liste_kvinner[x].pro_sysselsatt);
 }

 for (var x = 0; x < statistikk_sysselsatte_kommune1.liste_menn.length; x++){
   let li = document.createElement("li");
   let text = document.createTextNode(statistikk_sysselsatte_kommune1.liste_menn[x].aarstall +" Prosent sysselsatte: "+statistikk_sysselsatte_kommune1.liste_menn[x].pro_sysselsatt);
   li.appendChild(text);
   if (l03[x] != l04[x]) li.style.color = (l03[x] > l04[x]) ? "green" : "";
   if (l03[x] != 0) li.innerHTML += (l03[x] > 0) ? " &#x2191;" : " &#x2193;";
   ul_menn.appendChild(li);
   liste_prosent_sysselsatte_menn_kommune1.push(statistikk_sysselsatte_kommune1.liste_menn[x].pro_sysselsatt);
 }

 for (var x = 0; x < statistikk_sysselsatte_kommune2.liste_kvinner.length; x++){
   let li = document.createElement("li");
   let text = document.createTextNode(statistikk_sysselsatte_kommune2.liste_kvinner[x].aarstall +" Prosent sysselsatte: "+statistikk_sysselsatte_kommune2.liste_kvinner[x].pro_sysselsatt);
   li.appendChild(text);
   if (l01[x] != l02[x]) li.style.color = (l01[x] < l02[x]) ? "green" : "";
   if (l02[x] != 0) li.innerHTML += (l02[x] > 0) ? " &#x2191;" : " &#x2193;";
   ul_kvinner_to.appendChild(li);
   liste_prosent_sysselsatte_kvinner_kommune2.push(statistikk_sysselsatte_kommune2.liste_kvinner[x].pro_sysselsatt);
 }
 for (var x = 0; x < statistikk_sysselsatte_kommune2.liste_menn.length; x++){
   let li = document.createElement("li");
   let text = document.createTextNode(statistikk_sysselsatte_kommune2.liste_menn[x].aarstall +" Prosent sysselsatte: "+statistikk_sysselsatte_kommune2.liste_menn[x].pro_sysselsatt);
   li.appendChild(text);
   if (l03[x] != l04[x]) li.style.color = (l03[x] < l04[x]) ? "green" : "";
   if (l04[x] != 0) li.innerHTML += (l04[x] > 0) ? " &#x2191;" : " &#x2193;";
   ul_menn_to.appendChild(li);
   liste_prosent_sysselsatte_menn_kommune2.push(statistikk_sysselsatte_kommune2.liste_menn[x].pro_sysselsatt);
 }

// Regner ut prosentveksten
 for (var i = 0; i < liste_prosent_sysselsatte_kvinner_kommune1.length-1; i++) {
   liste_prosentvekst_kvinner_kommune1.push(liste_prosent_sysselsatte_kvinner_kommune1[i+1]-liste_prosent_sysselsatte_kvinner_kommune1[i]);
 }

 for (var i = 0; i < liste_prosent_sysselsatte_kvinner_kommune2.length-1; i++) {
   liste_prosentvekst_kvinner_kommune2.push(liste_prosent_sysselsatte_kvinner_kommune2[i+1]-liste_prosent_sysselsatte_kvinner_kommune2[i]);
 }

 for (var i = 0; i < liste_prosent_sysselsatte_menn_kommune1.length-1; i++) {
   liste_prosentvekst_menn_kommune1.push(liste_prosent_sysselsatte_menn_kommune1[i+1]-liste_prosent_sysselsatte_menn_kommune1[i]);
 }

 for (var i = 0; i < liste_prosent_sysselsatte_menn_kommune2.length-1; i++) {
   liste_prosentvekst_menn_kommune2.push(liste_prosent_sysselsatte_menn_kommune2[i+1]-liste_prosent_sysselsatte_menn_kommune2[i]);
 }

// Sender ut navn til begge kommunene
 let kommunenavn = getNameKommune(befolkning.datasett, kommunenummer);
 let kommunenavn_to = getNameKommune(befolkning.datasett, kommunenummer_to);
 let kommunenavn_tre = getNameKommune(befolkning.datasett, kommunenummer);
 let kommunenavn_fire = getNameKommune(befolkning.datasett, kommunenummer_to);
 let linavn = document.createElement("row");
 let linavn_to = document.createElement("row");
 let linavn_tre = document.createElement("row");
 let linavn_fire = document.createElement("row");
 let textnavn = document.createTextNode(kommunenavn);
 let textnavn_to = document.createTextNode(kommunenavn_to);
 let textnavn_tre = document.createTextNode(kommunenavn_tre);
 let textnavn_fire = document.createTextNode(kommunenavn_fire);
 linavn.appendChild(textnavn);
 linavn_to.appendChild(textnavn_to);
 linavn_tre.appendChild(textnavn_tre);
 linavn_fire.appendChild(textnavn_fire);
 navn_kommune.appendChild(linavn);
 navn_kommune_to.appendChild(linavn_to);
 navn_kommune_tre.appendChild(linavn_tre);
 navn_kommune_fire.appendChild(linavn_fire);

}
