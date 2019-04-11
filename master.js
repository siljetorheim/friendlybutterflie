function getInfo(id) {
  return document.getElementById(id)
}
function hide() {
  let liste = [getInfo("intro"), getInfo("oversikt"), getInfo("details"), getInfo("sammenligning")]
  console.log(liste);
}
