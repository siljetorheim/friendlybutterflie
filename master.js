
function getInfo(id) {
  return document.getElementById(id)
}

function hide(tall) {
  let liste = [getInfo("intro"), getInfo("oversikt"), getInfo("details"), getInfo("sammenligning")]
  for (var i = 0; i < liste.length; i++) {
    liste[i].className = "hide"
  }
  if (tall != undefined) {
    liste[tall].className = "active"
  }

}
