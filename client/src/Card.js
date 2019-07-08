import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
    render() {
        
        return (
          
            <React.Fragment>
                <div className="card" >
                    
                    <img className="image" alt="product" src={`https://ipfs.io/ipfs/${this.props.imag}`} align="middle"></img>
                    <div className="p-des">
                        <p><strong>Book Name : </strong>{this.props.author}</p>
                        {/* <div></div> */}
                        <p><strong>Author : </strong>{this.props.pname}</p>
                        {/* <div></div> */}
                        <p><strong>Purchase Price : </strong>{this.props.price}</p>
                        {/* <div></div> */}
                        <p><strong>Rent Price : </strong>{this.props.rentPrice}</p>
                        {/* <div></div> */}
                        <p><strong>Rent Duration : </strong>{this.props.days}</p>

                        <div className="button-grp">
                            <button onClick={this.props.buyClick}>Buy</button>
                            <button onClick={this.props.rentClick}>Rent</button>
                        </div>
                        {/* <button onClick={this.props.viewClick}>View</button> */}
                    </div>

                </div>
                
            </React.Fragment>
        );
    }
}


                //                 <style jsx="true">{`
                //                 .ui stackable grid {
                //                     text-align: center;
                //                     margin:auto;
                //                 }
                                
                //                 div.content {
                //                     padding: 0 1em;
                //                     margin: 5px 0;
                //                 }   
                //                 .content .heading {
                //                     font-size: 15px;
                //                     width: 100%;
                //                     padding: 15px 0 0 15px;
                //                     margin:auto;

                //                 }   
                //                 .content div strong {
                //                     font-size: 20px;
                //                 }
                //                 .content .sort {
                //                     font-size: 15px;
                //                     margin: 3rem 0 2rem 0;
                //                     padding: 0 8px;
                //                 } 
                //                 select {
                //                     width: 200px;
                //                     height: 25px;
                //                     background: #e8e8e8;
                //                     font-weight: 500;
                //                     padding: 0 10px;
                //                     margin-left: 15px;
                //                     border-radius: 5px;
                //                     border: none;
                //                     outline: none;
                //                 }                  
                //                 .content .column {
                //                     padding: 0.5em !important;
                //                     margin:auto;

                //                 }  
                //                 @media screen and (max-width: 700px) {
                //                     div.three {
                //                         display: none !important;
                //                     }
                //                     .sidebar {
                //                         display: none;
                //                         width: 0;
                //                         height: 300px;
                //                         position: relative;
                //                     }
                //                     div.content {
                //                         padding: 0;
                //                         margin-left: 0;
                //                     }
                //                 }             
                // `}
                // </style>
                //             </React.Fragment>   
                //             );
                //         }

                                          
export default Card;