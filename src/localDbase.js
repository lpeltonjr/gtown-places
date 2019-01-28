const appDbaseLocal = {
  titleText:    "38138: Forest Hill-Irene",
  location:     {lat: 35.065070, lng: -89.759450},
  myGoogleAPI:  'AIzaSyAnnR8DMA8u33ifzz7C2zJpyGFX8D5D8MM',
  myYelpAPI:    'e8n1PGHLhL2w6uGR5X1CzN-qFSDAin7FcePImRGsaOxLnC985IQb0V-IxvNHHaqKr7J4HGTVYEo4-OAla8XKSzf7n9hhecF0O01j9U8ORsT9RqE70xdeOabMFnA6XHYx',
  places:   [
    { name:     "Forest Hill Cinema",
      address:  "3180 Village Shops Drive, Germantown, TN",
      category: "movie theater"
    },
    {
      name:     "The Fresh Market",
      address:  "9375 Poplar Avenue, Germantown, TN",
      category: "grocery store"
    },
    {
      name:     "Forest Hill Grill",
      address:  "9102 Poplar Pike, Germantown, TN",
      category: "diner restaurant bar grill"
    },
    {
      name:     "Royal Panda",
      address:  "3120 Village Shops Drive, Germantown, TN",
      category: "Chinese Asian restaurant"
    },
    {
      name:     "Forest Hill Animal Hospital",
      address:  "3133 Forest Hill Irene Road, Germantown, TN",
      category: "veterinarian animal hospital"
    }
  ]
};




//  given a string or string fragment, returns an array subset of appDbaseLocal
//  which lists all items containing the string/string fragment
//  if the input string is "all", all places in the database are returned
function getPlaces(fragment) {
    if (fragment.length) {
      return (
        appDbaseLocal.places.filter(item=>{
            let dbStr1 = item.name.toLowerCase();
            let dbStr2 = item.category.toLowerCase();
            let inStr = fragment.toLowerCase();
            return ((inStr === "all") || dbStr1.includes(inStr) || dbStr2.includes(inStr));
        })
      );
    } else {
      return [];
    }
}

export default appDbaseLocal;
export {getPlaces};
