import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import OwnershipContract from "./contracts/Ownership.json"
import ipfs from "./ipfsCall";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

import "./App.css";
import { runInThisContext } from "vm";

class App extends Component {

  state = {viewText: 'Show Preview', showPreview: false, fileMetadata: [], storageValue: [], web3: null, accounts: null, contract: null, buffer: null, ipfsHash: null };

  constructor(props){
    super(props)

    this.getFile = this.getFile.bind(this);
    this.submitFile = this.submitFile.bind(this);  
    this.calcTime = this.calcTime.bind(this);  
    this.loadHtml = this.loadHtml.bind(this);
    this.toggle = this.toggle.bind(this);

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
      instance.address = "0x4333a77a024e8a3b0a1c1bb9f993a1955e42f37b";

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

    await contract.methods.uploadContent(accounts[0], ipfsHash, ).send({ from: accounts[0] });

    const response = await contract.methods.get(ipfsHash).call();

    this.setState({ storageValue: response });
  };

  // buyTokenTransaction = async () => {

  //   await contract.methods.
  // }

  searchForFile = async () => {
    const { accounts, contract, ipfsHash} = this.state;

    const response = await contract.methods.get(ipfsHash).call();

    this.setState({ fileMetadata: response });
  };

  loadHtml() {
    return (`https://ipfs.io/ipfs/${this.state.ipfsHash}`);
  }

  searchFile(event) {
    event.preventDefault()
    console.log("ACCOUNT: ")
  }


  getFile(event) {
    // console.log("Get File..")
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file);
    console.log('buffer', this.state.buffer)

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
      console.log('IPFS Hash Value: ', this.state.ipfsHash);  
    })
  }

  calcTime(timestamp) {
    if(timestamp)
    {
      var date = new Date(timestamp*1000);
      return date.toUTCString();
    }
  }

  toggle() {
		this.setState({
      shown: !this.state.shown,
      viewText: 'Hide Preview'
		});
	}

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    var hidden = {
			display: this.state.shown ? "block" : "none"
		}
    return (
      <div className="App">
        {/* <img src={require("./capgemini.png")} width={650} height={150} ></img> */}
        <h1>Decentralized Content Sharing </h1>
        <p><strong>My Address: </strong>{this.state.accounts[0]}</p>
        <p>Upload to IPFS and Secure by Ethereum</p>
        <Tabs>
          <TabList>
            <Tab>
              Upload
            </Tab>
            <Tab>
              Find Content
            </Tab>
          </TabList>
          <TabPanel>
            <h2>Select your file</h2>
            <form onSubmit = {this.submitFile}>
              <input type='file' onChange = {this.getFile}/> 
              <input type='text' />
              <br></br>
              <br></br>
              <input type = 'submit'/>
            </form>
            <p><strong>IPFS Hash:</strong> {this.state.ipfsHash}</p>
            {/* <p><strong>Owner: </strong> {this.state.storageValue[1]}</p> */}
            <p><strong>Time Stamp: </strong> {this.calcTime(this.state.storageValue[0])}</p>
            {/* <object type='text/html' data = {this.loadHtml() }></object> */}
            <object style={ hidden } width="400" height="400" data= {this.loadHtml()} ></object>
            <br></br>
				    <button onClick={this.toggle}>{this.state.viewText}</button>
            
          </TabPanel>  

          <TabPanel>
            <h2> Search With IPFS Hash</h2>
            <form onSubmit = {this.searchFile}>
              <input type = 'text'/>
              <input type = 'submit'/>
            </form>
            <p><strong>Owner</strong> OWNER </p>
            <p><strong>Time Stamp</strong> TIME STAMP </p>
          </TabPanel>

        </Tabs>
      </div>
    );
  }
}
export default App;
