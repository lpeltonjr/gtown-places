const appDbaseLocal = {
  titleText:    "Germantown Guide",
  location:     {lat: 35.0867577, lng: -89.8100858},
  myAPI:        ,
  places:   [
    { name:     "Kingsway Christian Church",
      address:  "7887 Poplar Avenue, Germantown, TN",
      category: "church"
    },
    { name:     "Germantown Baptist Church",
      address:  "9450 Poplar Avenue, Germantown, TN",
      category: "church"
    },   
  ]
};




//  given a string or string fragment, returns an array subset of appDbaseLocal
//  which lists all items containing the string/string fragment
//  if the input string is "all", all places in the database are returned
function getPlaces(fragment) {
    return (
        appDbaseLocal.places.filter(item=>{
            let dbStr1 = item.name.toLowerCase();
            let dbStr2 = item.category.toLowerCase();
            let inStr = fragment.toLowerCase();
            return ((inStr === "all") || dbStr1.includes(inStr) || dbStr2.includes(inStr));
        })
    );
}

export default appDbaseLocal;
export {getPlaces};
