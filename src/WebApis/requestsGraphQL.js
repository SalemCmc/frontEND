


const endpointURL = 'https://vet-ord-api.herokuapp.com/graphql';


async function graphqlRequest(query, variables = {}) {
  const request = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables })
  };
  // console.log("requevariablesst: ", JSON.stringify({ variables}));            
  //console.log("request: ", request);
  const response = await fetch(endpointURL, request);
  const responseBody = await response.json();


  // Promise.all(response, responseBody);  /// await u jednoj liniji nece ici dalje dok se ne izvrse oba!

  if (responseBody.errors) {
    const message = responseBody.errors.map((error) => error.message).join('\n');
    throw new Error(message);
  }
  return responseBody.data;
}
// POGLEDAJ POSLIJE function sucess(){}
//function err(){}
//#region --------------------------------------------------------OBAVJESTI -----------------------------
//export async function getObavjestiGR(ss,sd,rr,ll)
export async function getObavjestiGR(searchString, searchDate, row, limit) {

  const query = `query nekiUpit($searchString: String, $searchDate: String , $row: Int, $limit: Int)
                           {
                                getObavjesti(searchString: $searchString, searchDate:$searchDate, row:$row, limit:$limit)
                                            { count items{ID:_id Naslov Sadrzaj Kreirao Datum Aktivno} 
                                            }
                            }`;
  let obavjesti = await graphqlRequest(query, { searchString, searchDate, row, limit });
  return obavjesti.getObavjesti;
}

export async function deleteObavjest(id) {
  const mutation = `mutation DeleteObavjest($id: ID!)
                     {
                        success:deleteObavjest (id:$id) 
                     }`;
  let obav = await graphqlRequest(mutation, { id });
  return obav.success;
}

export async function addObavjest(input) {
  const mutation = `mutation createObavjest($input: newObavjest) {
      addObavjest(input: $input) {
       _id
        Naslov
        KreiraoID
        Datum
      }
    }`;
  //console.log("sa PL-a: ", {input});
  let obav = await graphqlRequest(mutation, { input });
  return obav;
}
//#endregion 

//#region                                         KORISNICI
export async function getUsersG(searchString, role, active, row, limit) {
  //console.log("variables: ");
  const query = `query getKor ($input : searchParams)
        { 
          getKorisnici(input:$input)
          { count items{ _id Titula Ime Prezime Adresa Telefon Email Aktivan BrLicneKarte Slika Titula About Linkedin Facebook Twetter}
          }
        }`;
  let input = { searchString, role, active, row, limit };

  let resp = await graphqlRequest(query, { input });
  return resp.getKorisnici;
}


export async function getStatisticsData(id) {
  const query = `query getstat($id: ID!)
                  {
                    getStatisticsDataByID(id:$id)
                    {Pets TotalCosts IncomingAppointments DoneAppointments CanceledAppointments DoneAppointmentsCurrentYear DoneAppointmentsCurrentMonth}
                  }`;
  let kor = await graphqlRequest(query, { id });
  return kor.getStatisticsDataByID;
}

export async function getUserByIDG(id) {
  const query = `query getKor ($id: ID!)
                  {
                    getKorisnikByID(id:$id)
                    {_id Ime Prezime Username Email Adresa BrLicneKarte DatumUnosa Titula
                    RolaID Telefon Aktivan Slika About}
                  }`;
  let kor = await graphqlRequest(query, { id });
  return kor.getKorisnikByID;

}

//			export async function addKorisnik(input) {
//			  console.log("input: ", input);
//			  const query = `mutation addUpdateKor($input : newKorisnik)
//			                          {
//			                            addKorisnik(input: $input) 
//			                          }`;
//			  let kor = await graphqlRequest(query, { input }).catch(err => { console.log("ERROR: ", err); });
//			  return null; //kor.addKorisnik;}

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
export async function updateUserG(input) {

  let resultSet = Object.keys(input).toString();
  resultSet = resultSet.replace("NewPassword", " ");
  resultSet = resultSet.replace("Password", " ");
  resultSet = resultSet.replace("Avatar", " ");
  //resultSet = resultSet.replace("_id", " ");
  resultSet = resultSet.replace(/,/g, " ");
  let responseSet = "errorMsg errorStatus";

  const query = `mutation updateKor($input : updateKorisnik)
                          {
                            updateKorisnik(input: $input) { ${resultSet} ${responseSet} }
                          }`;
  let resp = await graphqlRequest(query, { input });
  console.log("API: ",resp.updateKorisnik);
  return resp.updateKorisnik;
}
// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
export async function getKorisniciShort(searchString, role) {
  const query = `query getShortKor($input: searchParams)
                    {
                      getKorisniciShort(input: $input)
                      {_id Ime Prezime}
                    }`;
  let input = { searchString: searchString, role: role };
  let kor = await graphqlRequest(query, { input });
  return kor.getKorisniciShort;


}

//#endregion


//#region                                         TERMINI


export async function getAppointments(id, row) {

  const query = `query getApp( $id: ID! , $row: String)
                              {getAppointmentsList(id:$id, row:$row)
                              {id Done Doctor Client Date Time DoctorID ClientID}}                 
  `;

  let resp = await graphqlRequest(query, { id, row });
  // console.log("priceList: ",resp.getTerminiByKlijent);
  return resp.getAppointmentsList;
}



export async function getTerminiByKlijent(id, row, limit) {

  const query = `query getTermByKl( $id: ID! , $row: String, $limit:String)
                                  {getTerminiByKlijent(id: $id, row:$row, limit:$limit)
                                  {count items{ID Date Vrijeme Doktor Vlasnik VlasnikID Obavljen}}
                                  }`;

  let resp = await graphqlRequest(query, { id, row, limit });
  // console.log("priceList: ",resp.getTerminiByKlijent);
  return resp.getTerminiByKlijent;
}
export async function getTerminiByDoktor(id, datum) {
  const query = `query getTermByDoktor( $id: ID! , $datum:String)
                            {getTerminiByDoktor(id: $id, datum:$datum)
                            {_id Datum  Vrijeme Vlasnik VlasnikID Obavljen}
                            }`;

  let resp = await graphqlRequest(query, { id, datum });
  // console.log("TERMS::: ",resp);
  return resp.getTerminiByDoktor;

}
export async function ukloniTermin(id) {
  const query = `mutation deleteTerm( $id: ID!)
                  {
                    deleteTermin(id:$id)
                  }`;
  let resp = await graphqlRequest(query, { id });
  return resp.deleteTermin;
}
export async function getTerminDetails(id) {
  const query = `query getTermDetailByID($id: ID!)
                  {getTermindetail(id: $id)
                                          {
                                            Termin{ID Date Vrijeme Vlasnik VlasnikSlika Napomena Aktivan Obavljen Doktor}
                                            Usluga{_id VrstaUsluge Datum Opis Cijena}
                                            Pacijent{_id Ime Rasa Slika}
                                          }
                  }`;
  let resp = await graphqlRequest(query, { id });
  if (resp.Termin === undefined) { resp.Termin = null; }
  if (resp.Pacijent === undefined) { resp.Pacijent = null; }
  console.log("Detalji termina: ", resp);
  return resp.getTermindetail;
}

export async function getFreeAppointmentTime(id, date) {
  const query = `query getFree($id :ID!, $date: String!)
                  {
                    getFreeAppointmentTime(id: $id, date: $date) 
                  }`;
  let resp = await graphqlRequest(query, { id, date });

  return resp.getFreeAppointmentTime;
}

export async function PostTermin(input) {
  const query = `mutation addTerm($input : newTermin)
  {
                 addTermin(input: $input) 
  {_id}
  }`;

  let kor = await graphqlRequest(query, { input });

  if (kor.addTermin != null)
    return true;
  return false;

}
export async function evidentirajTermin(input) {
  const query = `mutation addTerm($input : objectForInsert)
                  {
                                evidencijaUsluge(input: $input) 
                  }`;
  let evidentiraj = await graphqlRequest(query, { input });
  if (evidentiraj) return true;
  return false;  // treba hendlati ovo!!!
}

export async function getCommonApi(group) {
  const query = `query getCommApi($group: String! )
                  {getCommonApi(group:$group)
                  {_id Value}
                  }`;
  let resp = await graphqlRequest(query, { group });
  return resp.getCommonApi;

}
//#endregion


//#region   ---------------------------           PACIJENTI




export async function getPetDetails(id) {
  const query = `query getPetDet($id : ID!)
                                {getPetByID(id: $id)
                                {_id Ime Tezina Rasa DatumRodjenja VrstaPacijenta Slika}
                               
                                
                                  }`;

  let resp = await graphqlRequest(query, { id });
  //console.log("RESPO: ", resp.getPetServiceTimeline);
  return resp.getPetByID;
}

export async function getPacijentiByVlasnikShort(id) {
  const query = `query getShortPac($id: ID!)
                  {getPacijentiByVlasnikShort(id: $id)
                  {_id Ime}
                  }`;
  let resp = await graphqlRequest(query, { id });
  return resp.getPacijentiByVlasnikShort;
}



export async function getPetByOwnerID(ID1, row, limit) {
  const query = `query getPets($input: searchParams!)
                        {getPacijentiByVlasnikID(input: $input)
                        {count items{ _id Ime Rasa DatumRodjenja Tezina VrstaPacijenta VrstaPacijentaID VlasnikID Aktivan Slika}
                        }
                }`;
  let input = { ID1, row, limit };
  let resp = await graphqlRequest(query, { input });
  return resp.getPacijentiByVlasnikID;
}

export async function postPet(input) {
  const mutation = `mutation addPac($input: newPacijent)
                              {
                                updatePet(input: $input) {_id Ime errorMsg errorStatus}
                              }`;
  let resp = await graphqlRequest(mutation, { input });
  console.log("-----------SAVE PET API", resp);
  return resp.updatePet;
}
export async function deactivatePetG(id) {
  const mutation = `mutation deactPet($id: ID!)
                              {
                                deactivatePet(id: $id) 
                              }`;

  let resp = await graphqlRequest(mutation, { id });
  return resp.deactivatePet;
}

//#endregion

//#region  ----------------------------  P O R U K E

export async function getCountNewMessage(id) {
  const query = `query getCountMess( $id: ID!)
                      {getCountNewMessage(id: $id)  {Klijent Osoblje}
                      }`;
  let resp = await graphqlRequest(query, { id });
  return resp.getCountNewMessage;
}
export async function getPoruke(korID, sagovID, row1) {
  const query = `query getMsg ($korID: String, $sagovID: String, $row: String)
                          {getPoruke(korisnikID:$korID,
                            sagovornikID: $sagovID, row: $row){_id Sadrzaj PosiljaocID Procitano Aktivno Datum Vrijeme}
                          }`;
  let row = row1.toString();
  let resp = await graphqlRequest(query, { korID, sagovID, row });
  return resp.getPoruke;
}
export async function PostPoruke(input) {
  const mutation = `mutation addPor( $input: newPoruka!)
  {addPoruka(input: $input){ _id Sadrzaj Datum Vrijeme PosiljaocID Procitano Aktivno}
  }`;

  //console.log("input MSG: ",input);
  let resp = await graphqlRequest(mutation, { input });

  return resp.addPoruka;
}

export async function setProcitanoMsg(idPos, idPrim) {
  const mutation = `
  mutation setSnn($idPos: ID!, $idPrim: ID!)
  {setSeen(posiljaocID:$idPos, primaocID:$idPrim )
  }`;

  graphqlRequest(mutation, { idPos, idPrim });
  //return resp.addPoruka;
}
export async function delleteMessage(id) {
  const mutation = `mutation delMsg($id: ID!)
  {deleteMessage(id:$id)
  }`;

  graphqlRequest(mutation, { id });
  //return resp.addPoruka;
}

export async function getPosiljaociPoruka(ID1, role, row, searchString, limit) {
  const query = `query getPosPoruka($input: searchParams)
                      {getPosiljaociPoruka(input: $input)
                      {ID Message Datum SagovornikID Sagovornik SagovornikAvatar Procitano
                      }}`;
  let input = { ID1, searchString, role, row, limit }

  let resp = await graphqlRequest(query, { input });
  return resp.getPosiljaociPoruka;




}
//#endregion                        END        P O R U K E

export async function getMedicServices(id, row) {
  const query = `query getTimelinee($id : ID!, $row: String)
                                    {getPetServiceTimeline(id: $id, row:  $row)
                                    {id  Service Date Time Description}}`;

  let resp = await graphqlRequest(query, { id, row });
  //console.log("RESPO: ", resp.getPetServiceTimeline);

  return resp.getPetServiceTimeline;
}



export async function getTimelineItemDetails(id) {
  console.log("RESPO: ", id);
  const query = `query getTimelineDetail($id : ID!)
                                    {getPetServiceDetails(id: $id)
                                     { Service Date Time  Price Description Doctor DoctorAvatar
                                      Diagnosis Therapy TherapyDescription Medicaments{Name Quantity}
                                     }
                                  }`;

  let resp = await graphqlRequest(query, { id });

  return resp.getPetServiceDetails;
}


//#region------------------------------------   USLUGE



//#endregion                        END        U S L U G E
//#region                                     OTHER  price list, contacts...
export async function getPriceList() {
  const query = `{
                             PriceLists{_id Service Price CreatedDate Active}
                           }`;
  let resp = await graphqlRequest(query);
  //   console.log("priceList: ",priceList);
  return resp.PriceLists;
}
export async function getContacts() {
  const query = `{Contacts{_id Name Street City CityCode WorkingTime Phones Emails Coordinates{lat lng} }}`;

  let resp = await graphqlRequest(query);
  //console.log("resp.Contacts: ",resp.Contacts);
  return resp.Contacts;

}
//#endregion






//#region                 A D M I N  
export async function getAllPermissions() {
  const query = `{
                             Permissions{_id Group Name Desc}
                           }`;
  let resp = await graphqlRequest(query);
  //   console.log("priceList: ",priceList);
  return resp.Permissions;
}

export async function getPermissionsByRole(id) {
  const query = `query getperroll($id : ID!)
                                    {getPermissionsByRole(id: $id)  { _id RoleID PermisionID, Group Name }
                                  }`;

  let resp = await graphqlRequest(query, { id });
  return resp.getPermissionsByRole;

}
//#endregion



export default { getObavjestiGR, deleteObavjest, getFreeAppointmentTime };