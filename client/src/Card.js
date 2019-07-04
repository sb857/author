import React, { Component } from 'react';

class Card extends Component {
    render() {
        
        return (
          
            <React.Fragment>
                <div className="card" >
                    
                    <img className="image" alt="product" src={`https://ipfs.io/ipfs/${this.props.imag}`} align="middle"></img>
                    <div className="p-des">
                        <p><strong>Book Name: </strong></p>
                        <div>{this.props.author}</div>
                        <p><strong>Author: </strong></p>
                        <div>{this.props.pname}</div>
                        <p><strong>Price: </strong></p>
                        <div>{this.props.price}</div>
                        <button onClick={this.props.buyClick}>Buy</button>
                        <button onClick={this.props.rentClick}>Rent</button>
                        {/* <button onClick={this.props.viewClick}>View</button> */}
                    </div>

                </div>
                <style jsx="true">{`
                    
                    .image {
                        width: 203px;
                        border-bottom: 1px solid #e8e8e8;
                        height: 230px;  
                        align-items: center;
                    }
                    .p-des {
                        padding: 15px;
                        radius: 10px;
                    }
                    .p-des div {
                        font-size: 15px;
                        padding-bottom: 10px;
                        color: white;
                    }
                    
                    .card {
                        box-shadow: 0 1px 1px 1px rgba(0,0,0,.25);
                        float: left;
                        flex-direction: column;
                        display: flex;
                        margin: 15px;
                        margin-bottom: 25px;
                        radius: 10px;
                        background-color: rgb(91, 94, 99);
                        
                    }
                    .card:hover {
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,845);
                        cursor: pointer;
                        transition: 0.4s;
                    }
                `}
                </style>
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