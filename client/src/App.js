import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import OwnershipContract from "./contracts/Ownership.json"
import ipfs from "./ipfsCall";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Modal from 'react-awesome-modal';

import "./App.css";

class App extends Component {

  state = { visible : false, bookName: null, clientName: null, token: 0, ownerName: null, price: 0, contentName: null, viewText: 'Show Preview', showPreview: false, fileMetadata: [], storageValue: [], web3: null, accounts: null, contract: null, buffer: null, ipfsHash: null };

  constructor(props){
    super(props)

    this.getFile = this.getFile.bind(this);
    this.submitFile = this.submitFile.bind(this);  
    this.calcTime = this.calcTime.bind(this);  
    this.loadHtml = this.loadHtml.bind(this);
    this.toggle = this.toggle.bind(this);
    this.buyToken = this.buyToken.bind(this);
    this.searchFile = this.searchFile.bind(this);
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
      instance.address = "0xf6924e212d098baef0899c9f1614d280411daf8c";

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
    const { accounts, contract, ipfsHash, contentName, ownerName, price} = this.state;

    await contract.methods.uploadContent(ipfsHash, contentName, ownerName, price).send({ from: accounts[0] });

    const response = await contract.methods.search(ipfsHash).call();

    this.setState({ storageValue: response });
  };

  buyTokenTransaction = async () => {

    const {contract, accounts, clientName, token } = this.state
    await contract.methods.buyTokens(clientName, token).send({from: accounts[0]});
  };

  searchForFile = async () => {
    const { contract, bookName} = this.state;

    const response = await contract.methods.search(bookName).call();

    this.setState({ fileMetadata: response });
  };

  loadHtml() {
    return (`https://ipfs.io/ipfs/${this.state.ipfsHash}`);
  }

  searchFile(event) {
    event.preventDefault()
    this.setState(this.searchForFile);
    console.log("Data: ", this.state.fileMetadata);
  }

  openModal() {
    this.setState({
        visible : true
    });
  }

  closeModal() {
    this.setState({
        visible : false
    });
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
    if(this.state.viewText === 'Hide Preview')
    {
      this.setState({viewText: 'Show Preview'})
    }
  }

  buyToken(event) {
    event.preventDefault();
    this.setState(this.buyTokenTransaction);
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
        <div className="Header">
          <h1>Decentralized Content Sharing </h1>
          <p><strong>My Address: </strong>{this.state.accounts[0]}</p>
          <p>Upload to IPFS and Secure by Ethereum</p>
        </div>
        <Tabs>
          <TabList>
            <Tab>
              Upload
            </Tab>
            <Tab>
              Find Content
            </Tab>
            <Tab>
              Buy Tokens
            </Tab>
          </TabList>
          
          <TabPanel>

            <h2>Select your file</h2>
            <form onSubmit = {this.submitFile}>
              <input type='file' onChange = {this.getFile}/> 
              <br></br>
              <label>Name: </label>
              <input id= 'name' type='text' onInput= {e => this.setState({ownerName: e.target.value})}/>
              <br></br>
              <label>Book Name: </label>
              <input type='text' onInput= {e => this.setState({contentName: e.target.value})}/>              
              <br></br>
              <label>Price: </label>
              <input type='text' onInput= {e => this.setState({price: e.target.value})}/>              

              <br></br>
              <br></br>
              <button className="button"><span>Upload </span></button><br></br>
            
              <p onClick={()=> this.openModal()}><strong>IPFS Hash:</strong> {this.state.ipfsHash}</p>
              <button className="pre-btn" onClick={() => this.openModal()}>{this.state.viewText}</button>

            </form>
            
            <Modal visible={this.state.visible} width="600" height="600" effect="fadeInUp" onClickAway={() => this.closeModal()}>
              <p>Preview</p>
              {/* <img src=  height= "400" width= "400"></img> */}
              <object width="400" height="400" data= {this.loadHtml()} ></object>
            </Modal>
            
          </TabPanel>  

          <TabPanel>
            <h2><strong>Search</strong></h2>
            <form onSubmit = {this.searchFile}>
            <label>Book Name: </label>
            <input type = 'text' onInput= {e => this.setState({bookName: e.target.value})}/>
            <p> <strong>OR</strong></p><br></br>
            <label>Author Name: </label>
            <input type = 'text' onInput= {e => this.setState({authorSearchName: e.target.value})}/><br></br>
            
            <button className="button"><span>Search </span></button>

            </form>
          </TabPanel>

          <TabPanel>
            <h2>Buy Tokens</h2>
            <form onSubmit = {this.buyToken}>
              <label>Name: </label>
              <input type = 'text' onInput= {e => this.setState({clientName: e.target.value})}/><br></br>
              <label>Tokens: </label>
              <input type = 'text' onInput= {e => this.setState({token: e.target.value})}/><br></br>
              <button className="button"><span>Buy </span></button>
            </form>
          </TabPanel>

        </Tabs>
      </div>
    );
  }
}
export default App;
