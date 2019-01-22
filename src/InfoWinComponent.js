import React from 'react';
import './App.css';
import small_0 from './img/small_0.png';
import small_1 from './img/small_1.png';
import small_2 from './img/small_2.png';
import small_3 from './img/small_3.png';
import small_4 from './img/small_4.png';
import small_5 from './img/small_5.png';
import small_1_half from './img/small_1_half.png';
import small_2_half from './img/small_2_half.png';
import small_3_half from './img/small_3_half.png';
import small_4_half from './img/small_4_half.png';
import small_0_2x from './img/small_0@2x.png';
import small_1_2x from './img/small_1@2x.png';
import small_2_2x from './img/small_2@2x.png';
import small_3_2x from './img/small_3@2x.png';
import small_4_2x from './img/small_4@2x.png';
import small_5_2x from './img/small_5@2x.png';
import small_1_half_2x from './img/small_1_half@2x.png';
import small_2_half_2x from './img/small_2_half@2x.png';
import small_3_half_2x from './img/small_3_half@2x.png';
import small_4_half_2x from './img/small_4_half@2x.png';
import small_0_3x from './img/small_0@3x.png';
import small_1_3x from './img/small_1@3x.png';
import small_2_3x from './img/small_2@3x.png';
import small_3_3x from './img/small_3@3x.png';
import small_4_3x from './img/small_4@3x.png';
import small_5_3x from './img/small_5@3x.png';
import small_1_half_3x from './img/small_1_half@3x.png';
import small_2_half_3x from './img/small_2_half@3x.png';
import small_3_half_3x from './img/small_3_half@3x.png';
import small_4_half_3x from './img/small_4_half@3x.png';



function InfoWinComponent(props) {
    let ratingAltStr;
    let ratingLR;
    let ratingMR;
    let ratingHR;
    
    const photoLR = props.details.photos[0].replace(/o\.jpg/, "ss.jpg");
    const photoMR = props.details.photos[0].replace(/o\.jpg/, "ms.jpg");
    const photoHR = props.details.photos[0].replace(/o\.jpg/, "ms.jpg");
    let imgRspSet = `${photoLR} 40w, ${photoMR} 100w, ${photoHR} 600w`;
    let imgRspSiz = '(max-width: 100px) 40px, (max-width: 500px) 100px, 600px';
    let imgAlt = `Yelp user photo of ${props.details.name}`;

    
    switch (props.details.rating)
    {
        case 1:
            ratingLR = small_1;
            ratingMR = small_1_2x;
            ratingHR = small_1_3x;
            ratingAltStr = "Yelp one star rating";
            break;
        case 1.5:
            ratingLR = small_1_half;
            ratingMR = small_1_half_2x;
            ratingHR = small_1_half_3x;            
            ratingAltStr = "Yelp one and a half star rating";
            break;
        case 2.0:
            ratingLR = small_2;
            ratingMR = small_2_2x;
            ratingHR = small_2_3x;            
            ratingAltStr = "Yelp two star rating";
            break;
        case 2.5:
            ratingLR = small_2_half;
            ratingMR = small_2_half_2x;
            ratingHR = small_2_half_3x;            
            ratingAltStr = "Yelp two and a half star rating";
            break;
        case 3.0:
            ratingLR = small_3;
            ratingMR = small_3_2x;
            ratingHR = small_3_3x;    
            ratingAltStr = "Yelp three star rating";
            break;
        case 3.5:
            ratingLR = small_3_half;
            ratingMR = small_3_half_2x;
            ratingHR = small_3_half_3x;             
            ratingAltStr = "Yelp three and a half star rating";
            break;
        case 4.0:
            ratingLR = small_4;
            ratingMR = small_4_2x;
            ratingHR = small_4_3x;
            ratingAltStr = "Yelp four star rating";
            break;
        case 4.5:
            ratingLR = small_4_half;
            ratingMR = small_4_half_2x;
            ratingHR = small_4_half_3x;           
            ratingAltStr = "Yelp four and a half star rating"; 
            break;
        case 5.0:
            ratingLR = small_5;
            ratingMR = small_5_2x;
            ratingHR = small_5_3x;
            ratingAltStr = "Yelp five star rating";
            break;
        default:
            ratingLR = small_0;
            ratingMR = small_0_2x;
            ratingHR = small_0_3x;    
            ratingAltStr = "Yelp zero star rating";
            break;
    }
    let ratingSet = `${ratingLR} 1x, ${ratingMR} 2x, ${ratingHR} 3x`;
    console.log(ratingSet);

    return (
        <div className="iwin-container">
            <header className="iwin-header">{props.details.name}</header>
            <div className="iwin-body">
                <div className="iwin-picframe">
                    <img src={photoHR} srcSet={imgRspSet} sizes={imgRspSiz} alt={imgAlt} className="iwin-photo"></img>
                </div>
                <div className="iwin-details">
                <img src={ratingHR} srcSet={ratingSet} alt={ratingAltStr} className="iwin-photo"></img>
                </div> 
            </div>
            <footer className="iwin-footer"></footer>
        </div>
    );
}


export default InfoWinComponent;
