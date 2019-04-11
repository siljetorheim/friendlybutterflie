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

let beskrivelser = "http://wildboy.uib.no/~tpe056/folk/"
let befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
let sysselsatte = "http://wildboy.uib.no/~tpe056/folk/100145.json"
let utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"

var url = "http://wildboy.uib.no/~tpe056/folk/85432.json";

function lastNed0() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var obj = JSON.parse(xhr.responseText);
      var obj1 = xhr.responseText
      console.log(obj);
      //document.getElementById("demo").innerHTML = obj1;
    }
  };
  xhr.send();
}
window.onload = lastNed0;
