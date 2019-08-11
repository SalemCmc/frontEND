export async function getObavjesti(searchString, date, row, limit) {
  if (searchString === "") {
    searchString = " ";
  }
  if (date === undefined || date.toString() === "") {
    date = " ";
  }
  //const response = await fetch("http://salem-jahic.app.fit.ba/Api/Obavjesti/getObavjesti/"+searchString+"/"+date);

  const response = await fetch(
    "https://vet-ord-api.herokuapp.com/api/obavjesti/" +
    searchString +
    "/" +
    date +
    "/" +
    row +
    "/" +
    limit
  );

  const json = await response.json();
  //console.log("sa herokua: ", json);
  return json;
}


export async function getPriceList() {
  const response = await fetch(
    "https://vet-ord-api.herokuapp.com/api/pricelist"
  );
  const json = await response.json();
  //console.log(json);
  return json;
}



export async function getContacts() {
  const response = await fetch(
    "https://vet-ord-api.herokuapp.com/api/contacts"
  );
  const json = await response.json();
  //console.log(json);
  return json;
}


//--------CHANGE STATUS OBAVJESTI
export async function changeStatusObavjest(ID) {
  // console.log("pozvana deaktivacija ID=", ID);
  const response = await fetch(
    //    "http://salem-jahic.app.fit.ba/Api/Obavjesti/changeStatusObavjest/" + ID
    "https://vet-ord-api.herokuapp.com/api/obavjesti/" + ID.toString(),
    {
      method: "DELETE"
    }
  );
  const json = await response.json();
  return json;
}
///---------save obavjest------------
export async function saveObavjest(Obavjest) {
  let resStatus;
  fetch(
    //"http://salem-jahic.app.fit.ba/Api/Obavjesti/"
    "https://vet-ord-api.herokuapp.com/api/obavjesti/",
    {
      method: "POST", // or 'PUT'
      body: JSON.stringify(Obavjest),
      headers: { "Content-Type": "application/json" }
    }
  ).then(res => (resStatus = res));

  console.log("test errora: ", resStatus);
  return true;
}

//--------------------------   zajednicki api za sve dropdown liste
export async function getCommonApi(group) {
  const response = await fetch(
    "https://vet-ord-api.herokuapp.com/api/commonapi/" + group.toString()
  );
  const json = await response.json();
  //console.log(json);
  return json;
}
// ---------------------------------   K O R I S N I C I --------------------------------
// ---------------------------------   K O R I S N I C I -------------------------------->
// ---------------------------------   K O R I S N I C I --------------------------------
//https://vet-ord-api.herokuapp.com/api/korisnici//getKorisnici/ /Klijent/true/0/20
export async function getKorisnici(searchString, rola, aktivan, row, limit) {

  if (searchString === "") searchString = " ";
  const response = await fetch( //   "http://salem-jahic.app.fit.ba/Api/React/getKorisnici/" + searchString
    "https://vet-ord-api.herokuapp.com/api/korisnici/getKorisnici/" + searchString + "/" + rola.toString() + "/" + aktivan.toString() + "/" + row.toString() + "/" + limit.toString()
  );
  let json = await response.json();

  return json;
}
export async function getKorisniciShort(searchString, rola) {
  if (searchString === "") {
    searchString = " ";
  }
  //console.log("searchString=",searchString)
  const response = await fetch(//    "http://salem-jahic.app.fit.ba/Api/React/getKorisniciShort/" +
    "https://vet-ord-api.herokuapp.com/api/korisnici/getKorisniciShort/" +
    searchString +
    "/" +
    rola
  );
  const json = await response.json();
  // console.log(json);
  return json;
}
export async function getKorisnikByID(ID) {
  const response = await fetch(//  "http://salem-jahic.app.fit.ba/Api/React/getKorisnikByID/" + ID.toString()
    "https://vet-ord-api.herokuapp.com/api/korisnici/getKorisnikByID/" + ID.toString()
  );
  const json = await response.json();
  // console.log(json);
  return json;
}
export async function getRole() {
  const response = await fetch(
    "https://vet-ord-api.herokuapp.com/api/korisnici/getRole/"
  );
  const json = await response.json();
  // console.log(json);
  return json;
}




export async function getPacijentiByKorisnikID(ID) {
  const response = await fetch(//    "http://salem-jahic.app.fit.ba/Api/React/getPacijentiByKorisnikID/" +    ID.toString()
    "https://vet-ord-api.herokuapp.com/api/pacijenti/getPacijentiByKorisnikID/" + ID.toString()
  );
  const json = await response.json();
  // console.log(json);
  return json;
}
export async function getPacijentState(ID, Vrsta) {
  const response = await fetch(
    "http://salem-jahic.app.fit.ba/Api/React/getPacijentState/" +
    ID.toString() +
    "/" +
    Vrsta
  );
  const json = await response.json();
  // console.log(json);
  return json;
}
export async function getVrstePacijenata() {
  const response = await fetch(
    "http://salem-jahic.app.fit.ba/Api/React/getVrstePacijenata"
  );
  const json = await response.json();
  // console.log(json);
  return json;
}
export async function postKorisnikZZZ(Korisnik) {
  let ID;
  //fetch("http://salem-jahic.app.fit.ba/Api/React/PostKorisnik/", {
  fetch("http://localhost:5000//Api/React/PostKorisnik/", {
    method: "POST", // or 'PUT'
    body: JSON.stringify(Korisnik),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .catch(error => console.error("Error:", error))
    //.then(response => console.log('Success:', response));
    .then(response => (ID = response.KorisnikID));

  console.log("UNESENI:", ID);
  return true;
}
export async function postKorisnik(Korisnik) {
  // prije spasavanja slike potrebno je uraditi convert u byt array:
  //console.log("OBJEKAT  NO CONVERT je: ", Korisnik);
  if (Korisnik.Slika != null) {
    // Korisnik.Slika = await convertToByte(Korisnik.Slika);
    // console.log("OBJEKAT   JSON je: ", JSON.stringify(Korisnik));
  }
  let Respon = await fetch(//    "http://salem-jahic.app.fit.ba/Api/React/PostKorisnik/",
    "https://vet-ord-api.herokuapp.com/api/korisnici/",
    // "http://localhost:5000/api/korisnici/",
    {
      method: "POST",
      body: JSON.stringify(Korisnik),
      headers: { "Content-Type": "application/json" }
    }
  )
    .then(res => {
      return res.json();
    })
    .catch(err => err);
  return Respon;
}

export async function postPacijent(Pacijenti) {
  // prije spasavanja slike potrebno je uraditi convert u byt array:
  if (Pacijenti.Slika != null) {
    // Pacijent.Slika = await convertToByte(Pacijent.Slika);
  }

  //console.log("OBJEKAT   CONVERT je: ", Pacijenti);
  let Respon = await fetch(//"http://salem-jahic.app.fit.ba/Api/PacijentiR/",
    "https://vet-ord-api.herokuapp.com/api/pacijenti/",
    {
      method: "POST",
      body: JSON.stringify(Pacijenti),
      headers: { "Content-Type": "application/json" }
    }
  )
    .then(res => {
      return res.json();
    })
    .catch(err => err);
  return Respon;
}

export async function convertToByte(item) {
  // fanksn za konvertovanje slika u byte za spasavanje u bazu podataka!
  var myBuffer = [];
  var buffer = new Buffer(item, "base64");
  for (var i = 0; i < buffer.length; i++) {
    myBuffer.push(buffer[i]);
  }
  return myBuffer;
}
export async function getUsluge(searchString, date, doktorID) {
  //console.log("http://salem-jahic.app.fit.ba/Api/Obavjesti/getUsluge/"+ searchString.toString()+'/'+date.toString()+'/'+doktorID.toString());
  const response = await fetch(
    "http://salem-jahic.app.fit.ba/Api/Obavjesti/getUsluge/" +
    searchString.toString() +
    "/" +
    date.toString() +
    "/" +
    doktorID.toString()
  );
  const json = await response.json();
  // console.log(json);
  return json;
}
export async function getTerminiByKlijent(klijentID, row, limit) {

  const response = await fetch(//    "http://salem-jahic.app.fit.ba/Api/TerminiR/getTerminiByDoktor/" +
    " https://vet-ord-api.herokuapp.com/api/termini/getTerminiByKlijent/" + klijentID + '/' + row.toString() + '/' + limit.toString()

  );
  const json = await response.json();
  // console.log("TERMINI HEROKU: ",json);
  return json;
}
export async function getTerminiByDoktor(doktorID, date) {

  const response = await fetch(//    "http://salem-jahic.app.fit.ba/Api/TerminiR/getTerminiByDoktor/" +
    "https://vet-ord-api.herokuapp.com/api/termini/" + doktorID + "/" + date.toString()

  );
  const json = await response.json();
  console.log("TERMINI HEROKU: ", json);
  return json;
}
// get termini detalji : Api/TerminiR/getTerminDetails/{terminID}
export async function getTerminDetails(terminID) {
  //terminID="5cb85da2d879a40bf8fdea48";   // console.log("TERMINIJUM  ID: ",terminID);
  const response = await fetch(
    "https://vet-ord-api.herokuapp.com/api/termini/gettermindetail/" +
    terminID.toString() +
    "/"
  );
  const json = await response.json();
  //console.log("TERMINIJUM: ",json);
  return json;
}
export async function getVrsteUsluge() {
  const response = await fetch(
    "http://salem-jahic.app.fit.ba/Api/UslugeR/getVrsteUsluge/"
  );
  const json = await response.json();
  // console.log(json);
  return json;
}
export async function getPacijentiByVlasnikIDshort(vlasnikID) {
  const response = await fetch(
    "https://vet-ord-api.herokuapp.com/api/pacijenti/getPacijentiByKorisnikIDshort/" +
    vlasnikID.toString() +
    "/"
  );
  const json = await response.json();
  // console.log(json);
  return json;
}
export async function postUsluga(objectForInsert) {
  //console.log("OBJEKAT  NO CONVERT je: ", Korisnik);
  let Respon = await fetch(  //"http://salem-jahic.app.fit.ba/Api/UslugeR/"
    "https://vet-ord-api.herokuapp.com/api/usluge/evidencijaUsluge/", {
      method: "POST",
      body: JSON.stringify(objectForInsert),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      return res.json();
    })
    .catch(err => err);
  return Respon;
}



export async function checkInsertTermin(idDoktor, datum, sat) {
  // console.log("http://localhost:3947/Api/TerminiR/checkInsertTermin/"+idDoktor.toString()+"/"+datum.toString()+"/"+sat.toString());
  const response = await fetch(
    "http://salem-jahic.app.fit.ba/Api/TerminiR/checkInsertTermin/" +
    idDoktor.toString() +
    "/" +
    datum.toString() +
    "/" +
    sat.toString()
  );
  const json = await response.json();
  return json;
}
export async function ukloniTermin(id) {
  const response = await fetch(//    "http://salem-jahic.app.fit.ba/Api/TerminiR/otkaziTermin/" + id.toString()
    "https://vet-ord-api.herokuapp.com/api/termini/" + id.toString(),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }
  );
  const json = await response.json();
  console.log("uklon: ", json);
  return json;
}




export async function PostTermin(Termin) {

  let Respon = await fetch(//    "http://salem-jahic.app.fit.ba/Api/TerminiR/",
    // get test kodova: http://localhost:5000/api/termini/test vraca 405
    "https://vet-ord-api.herokuapp.com/api/termini/",
    {
      method: "POST",
      body: JSON.stringify(Termin),
      headers: { "Content-Type": "application/json" }
    }
  )
    .then(res => {
      return res.json();
    })
    .catch(err => err);

  console.log("TERMIN POST Respon: ", Respon);
  return Respon;
}

//// ----------------------------------------------------------------------
export async function getPosiljaociPoruka(korisnikID, rola, row, searchName, limit=2) {
  if (searchName === "" || searchName === null) {
    searchName = " ";
  }
  console.log("korisnikID: ", korisnikID); console.log("ROW: ", row); console.log("rola: ", rola); console.log("searchName: ", searchName);
  const response = await fetch(   // "http://salem-jahic.app.fit.ba/Api/PorukeR/getPosiljaociPoruka/" + korisnikID.toString() + "/" + rola.toString() +"/" + row.toString() +"/" + searchName.toString()
    "https://vet-ord-api.herokuapp.com/api/poruke/" + korisnikID + "/" + searchName + "/" + rola + "/" + row.toString() + "/"+limit+ "/"
  );
  const json = await response.json();
  // console.log("getPosiljaociPoruka: ",json);
  return json;
}
export async function getPoruke(korisnikID, sagovornikID, row) {
  const response = await fetch(
    //"http://salem-jahic.app.fit.ba/Api/PorukeR/getPoruke/" + korisnikID.toString() +"/" + sagovornikID.toString() +"/" + row.toString()
    "https://vet-ord-api.herokuapp.com/api/poruke/getPoruke/" + korisnikID.toString() + "/" + sagovornikID.toString() + "/" + row.toString()
  );
  const json = await response.json();
  return json;
}
export async function PostPoruke(Poruka) {
  // ne hendla errore ne valja
  let Respon = await fetch("https://vet-ord-api.herokuapp.com/api/poruke/" //""http://salem-jahic.app.fit.ba/Api/PorukeR/"
    , {
      method: "POST",
      body: JSON.stringify(Poruka),
      headers: { "Content-Type": "application/json" }
    })
    .then(res => {
      return res.json();
    })
    .catch(err => err);
  return Respon;
}

export async function getCountNewMessage(korisnikID) {
  const response = await fetch(
    //"http://salem-jahic.app.fit.ba/Api/PorukeR/getCountNewMessage/" + korisnikID.toString()
    "https://vet-ord-api.herokuapp.com/api/poruke/getCountNewMessage/" + korisnikID.toString()
  );
  const json = await response.json();
  console.log(json);
  return json;
}
// http://localhost:5000/api/poruke/dell/
export async function delleteMessage(id) {
  // ne hendla errore ne valja
  let Respon = await fetch("https://vet-ord-api.herokuapp.com/api/poruke/dell/" + id.toString()
    , {
      method: "DELETE",
      //body: JSON.stringify(id),
      headers: { "Content-Type": "application/json" }

    })
    .then(res => {
      return res.json();
    })
    .catch(err => err);
  return Respon;
}









export async function setProcitanoMsg(posiljaocID, primaocID) {
  await fetch(//    "http://salem-jahic.app.fit.ba/Api/PorukeR/setProcitanoMsg/" +
    "https://vet-ord-api.herokuapp.com/api/poruke/setProcitanoMsg/" +
    posiljaocID.toString() +
    "/" +
    primaocID.toString()
  );
  // const json = await response.json();
  // return json;
}
export async function Lograj(username, pass) {
  const response = await fetch(
    "http://salem-jahic.app.fit.ba/Api/Korisnici/LoginKorisnik/" +
    username +
    "/" +
    pass
  );
  //const json = await response.json();
  return response;
}

export default getObavjesti;
