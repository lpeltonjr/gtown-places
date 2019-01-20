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
        let address = place.address.split(', ');
        let requestStr = this.baseURL + `businesses/matches?name=${place.name}&address1=${address[0]}&city=${address[1]}&state=${address[2]}&country=US`;
        
        fetch(requestStr, {headers: this.yelpHeader})
        .then(res=>res.json())
        .then(res=>{
            console.log(`retrieved id ${res.businesses[0].id} for ${place.name}`);
            storeIDfunc(res.businesses[0].id);
        })
        .catch(e=>{
            console.log(`Error fetching ID for ${place.name}`);
        });
    }

    //  returns a promise which resolves when the details have been stored via
    //  the storeDetailsFunc provided by the caller; thus, the caller should wait
    //  till the promise resolves to do anything with the details
    getYelpData(id, params) {
        return (new Promise((resolve)=>{
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
                    console.log(`Error fetching reviews for ${id}`)
                } else {
                    console.log(`Error fetching details for ${id}`);
                }
            });
        }));
    }
}

export default yelpHelper;

