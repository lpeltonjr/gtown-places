//  for creating an object to access Yelp API using AJAX
class yelpHelper {
    constructor(APIkey) {
        this.key = APIkey;
        this.baseURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/";
        
        this.yelpHeader = new Headers();
        this.yelpHeader.append("Authorization", "Bearer " + this.key);
    }

    
    //  given reference to a "place" object from the database and
    //  reference to a callback to store the Yelp ID of that place,
    //  this method initiates the AJAX request and executes the callback
    //  when a response is received
    getYelpID(place, storeIDfunc) {
        return (new Promise((resolve, reject)=>{
            let address = place.address.split(', ');
            let requestStr = this.baseURL + `businesses/matches?name=${place.name}&address1=${address[0]}&city=${address[1]}&state=${address[2]}&country=US`;
            fetch(requestStr, {headers: this.yelpHeader})
            .then(res=>res.json())
            .then(res=>{
                if (res.businesses && (res.businesses.length > 0))
                {
                    storeIDfunc(res.businesses[0].id);
                    resolve();
                } else {
                    console.log(`Error YH002 fetching ID for ${place.name}} in getYelpID`);
                    reject();
                }
            })
            .catch(e=>{
                console.log(`Error YH001, ${e} fetching ID for ${place.name} in getYelpID`);
                reject(e);    
            });
        }));    
    }

    //  returns a promise which resolves when the details have been stored via
    //  the storeDetailsFunc provided by the caller; thus, the caller should wait
    //  till the promise resolves to do anything with the details
    getYelpData(id, params) {
        return (new Promise((resolve, reject)=>{
            let requestStr = this.baseURL + "businesses/" + id;
            if (params.reviews === true) {
                requestStr = requestStr + "/reviews";
            }

            fetch(requestStr, {headers: this.yelpHeader})
            .then(res=>res.json())
            .then(res=>{
                //console.log(`retrieved details ${res} for ${id}`);
                params.callback(res);
                resolve();
            })
            .catch(e=>{
                if (params.reviews === true) {
                    console.log(`Error YH002, ${e} fetching reviews for ${id} in getYelpData`)
                } else {
                    console.log(`Error YH003, ${e} fetching details for ${id} in getYelpData`);
                }
                reject(e);
            });
        }));
    }
}

export default yelpHelper;

