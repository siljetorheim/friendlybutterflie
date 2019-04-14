//HTML topp navigasjons feltet.
function getInfo(id) {
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
}


//URL til JSON filene
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
      console.log(obj["elementer"]);

      let working_elem = document.getElementById("kommune_liste");

      for (outpt in obj["elementer"]){
        working_elem.innerHTML += "<option value='" + outpt + "'>" + outpt + "</option>"
      }

    }
  };
  xhr.send();
}
window.onload = getNames;

/*getIDs returnerer listen av alle kommunenummerene.*/

/*getInfo tar kommunenummerene som argument og returnerer informasjonen om denne
kommunen fra datasettet. */
