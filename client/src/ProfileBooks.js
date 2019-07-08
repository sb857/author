import React, { Component } from 'react';

class ProfileBooks extends Component {
    render() {
        
        return (
          
            <React.Fragment>
                <div className="card" keyValue={this.props.keyValue} onClick={this.props.onClick}>
                    
                    <img className="image" alt="product" src={`https://ipfs.io/ipfs/${this.props.imag}`} align="middle"></img>
                    <div className="p-des">
                        <p><strong>Book Name: </strong></p>
                        <div>{this.props.pname}</div>
                        {/* <p><strong>Author: </strong></p>
                        <div>{this.props.author}</div> */}
                    </div>

                </div>
                {/* <style jsx="true">{`
                    
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
                </style> */}
            </React.Fragment>
        );
    }
}

export default ProfileBooks;