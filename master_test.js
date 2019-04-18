
//The links with the data
let beskrivelser = "http://wildboy.uib.no/~tpe056/folk/"
let befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
let sysselsatte = "http://wildboy.uib.no/~tpe056/folk/100145.json"
let utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"

//Gets the data from the link
function getData(url, callback) {
  var xhr = new XMLHttpRequest();
  console.log('url', url);
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);

      callback(data);

    };
  }
  xhr.send();
}

//Gets the names from the link
function getNames() {
  var url = utdanning;
  console.log(url);
  getData(url, function(obj){
    console.log('test', obj["elementer"]);
    let working_elem = document.getElementById("utdanning");

    //Insert liste
    working_elem.innerHTML += "<ul>" //+= betyr "adds a value to a variable."
    for (outpt in obj["elementer"]){
      working_elem.innerHTML += "<li>" + outpt + "</li>";
    }

    //Stop liste
    working_elem.innerHTML += "</ul>"

  })
}

//testing av mapping
/*var mapping {
  "0101" : "Halden"
}*/


//Gets the kommunenummer from the links
function getIDs(){
  var kommunenumre = [];
  var data = getData(utdanning, function (data) {
    for (kommune in data.elementer) {
      kommunenumre.push(data.elementer[kommune].kommunenummer);
//testing
      /*if (data.elementer[kommune].kommunenummer == '0101') {
        console.log(data.elementer[kommune]);
      }*/
    }
    console.log(kommunenumre);
  });
}

//Gets information about the kommuner
function getInfo(){

}
