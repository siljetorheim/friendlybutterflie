let beskrivelser = "http://wildboy.uib.no/~tpe056/folk/"
let befolkning = "http://wildboy.uib.no/~tpe056/folk/104857.json"
let sysselsatte = "http://wildboy.uib.no/~tpe056/folk/100145.json"
let utdanning = "http://wildboy.uib.no/~tpe056/folk/85432.json"


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


var mapping {

  "0101" : "Halden"

}

/*function getNames(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", utdanning);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var obj = JSON.parse(xhr.responseText);
      var obj1 = xhr.responseText;
      console.log('test', obj["elementer"]);
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
}*/

function getIDs(){
  var kommunenumre = [];
  var data = getData(utdanning, function (data) {
    for (kommune in data.elementer) {
      kommunenumre.push(data.elementer[kommune].kommunenummer);

      if (data.elementer[kommune].kommunenummer == '0101') {
        console.log(data.elementer[kommune]);
      }

    }
    console.log(kommunenumre);
  });
}
