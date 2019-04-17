let beskrivelser = "http://wildboy.uib.no/~tpe056/folk/"
let befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
let sysselsatte = "http://wildboy.uib.no/~tpe056/folk/100145.json"
let utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"

//Bør ha en callback funksjon.
//Lage klasse/konstruktør

function getNames(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", utdanning);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var obj = JSON.parse(xhr.responseText);
      var obj1 = xhr.responseText
      console.log(obj["elementer"]);
      let working_elem = document.getElementById("utdanning");

      //Insert liste
      working_elem.innerHTML += "<ul>" //+= betyr "adds a value to a variable."
      for (outpt in obj["elementer"]){
        working_elem.innerHTML += "<li>" + outpt + "</li>";
      }

      //Stop liste
      working_elem.innerHTML += "</ul>"
    }
  };
  xhr.send();
}

function getIDs(){
  var kommunenumre = [];
  var kommuner = getNames();
  for (kommune in kommuner) {
    kommunenumre.push(kommune.navn.kommunenummer)
  }
}
