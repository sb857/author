import React, { Component } from "react";
import OwnershipContract from "./contracts/Ownership.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from "./ipfsCall";

import "./App.css";

class App extends Component {

  state = { storageValue: [], web3: null, accounts: null, contract: null, buffer: null, ipfsHash: null };

  constructor(props){
    super(props)

    this.getFile = this.getFile.bind(this);
    this.submitFile = this.submitFile.bind(this);    
  }


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = OwnershipContract.networks[networkId];
      const instance = new web3.eth.Contract(
        OwnershipContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runTransaction = async () => {
    const { accounts, contract, ipfsHash} = this.state;

    await contract.methods.set(accounts[0], ipfsHash).send({ from: accounts[0] });

    const response = await contract.methods.get(ipfsHash).call();

    this.setState({ storageValue: response });
  };

  getFile(event) {
    // console.log("Get File..")
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result)})
        console.log('buffer', this.state.buffer)
    }
  }

  submitFile(event){
    event.preventDefault();
    ipfs.files.add(this.state.buffer, (error,result) => {
      if(error)
      {
        console.error(error)
        return
      }
      this.setState({ipfsHash: result[0].hash}, this.runTransaction)
      console.log('IPFS Hash Value: ', this.state.ipfsHash)
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Decentralized File System </h1>
        <p>Upload to IPFS and Secure by Ethereum</p>
        <h2>Select your file</h2>
        <form onSubmit = {this.submitFile}>
          <input type='file' onChange = {this.getFile}/> 
          <input type = 'submit'/>
        </form>
        <p><strong>IPFS Hash:</strong> {this.state.ipfsHash}</p>
        <p><strong>Owner: </strong> {this.state.storageValue[1]}</p>
        <p><strong>Time Stamp: </strong> {this.state.storageValue[0]}</p>
        {/* <image src= {'https://ipfs.io/ipfs/${this.state.ipfsHash}'} alt=""></image> */}
      </div>
    );
  }
}



export default App;
