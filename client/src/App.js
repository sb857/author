import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import OwnershipContract from "./contracts/Ownership.json"
import ipfs from "./ipfsCall";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Modal from 'react-awesome-modal';
import Card from './Card.js';
import ProfileBooks from './ProfileBooks.js';

import "./App.css";

class App extends Component {

  state = { earnings: null, totalSold: null, imageBuffer: null, bookImage: null, exists: false, visibleTimer: false, rentedBooks: [], rentHash: null,rent: null, rentDays: null,booksBoughtName: [], booksBought: [],wallet: null, current: [], visibleBook: false, bookDetails: [], prnt: false, render: true, visible: false, bookName: null, clientName: "utsav", token: 0, ownerName: null, price: 0, contentName: null, viewText: 'Show Preview', showPreview: false, fileMetadata: [], storageValue: [], web3: null, accounts: null, contract: null, buffer: null, ipfsHash: "hash" };

  constructor(props) {
    super(props)

    this.getFile = this.getFile.bind(this);
    this.getImage = this.getImage.bind(this);
    this.submitFile = this.submitFile.bind(this);
    this.calcTime = this.calcTime.bind(this);
    this.loadHtml = this.loadHtml.bind(this);
    this.toggle = this.toggle.bind(this);
    this.buyToken = this.buyToken.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.checkView = this.checkView.bind(this);//view timer
    this.viewHandler = this.viewHandler.bind(this);
    this.viewTimerHandler = this.viewTimerHandler.bind(this);
  }


  componentDidMount = async () => {

    var self = this;
    window.addEventListener("keyup", function (e) {
      if (e.keyCode == 44) {
        self.setState({ prnt: true });
        console.log("pressed!")
      }
    });
    setInterval(() => this.checkView(), 1000);//view timer

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
      instance.address = "0x10becf31e352882847b553404ed7c7daf858eb2f";
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
  
  checkView() { //view timer
    if (this.state.render == false) {
      this.closeModal();
    }
  }

  uploadTransaction = async () => {
    const { accounts, contract, ipfsHash, contentName, ownerName, price, rent, rentDays, bookImage } = this.state;

    await contract.methods.uploadContent(ipfsHash, contentName, ownerName, price, rent, rentDays, bookImage).send({ from: accounts[0] });

    console.log("storage Value: ", this.state.storageValue);
  };


  buyTokenTransaction = async () => {
    const { contract, accounts, clientName, token } = this.state
    await contract.methods.buyTokens(token).send({ from: accounts[0] });
  };

  purchaseTransaction = async () => {
    console.log("Working");
    const { ipfsHash, contract, accounts} = this.state;
    await contract.methods.purchase(ipfsHash).send({from: accounts[0]});
    console.log("Transaction Successful !");
  };

  getCustomerCall = async () => {
    const { contract, accounts, clientName } = this.state;
    const response = await contract.methods.getCustomer(accounts[0]).call();
    this.setState({ wallet: response[0]._hex, booksBought: response[1], rentedBooks: response[2]});
    console.log("Books Bought : ", response);
  };

  getAll = async () => {
    const { contract } = this.state;
    const response = await contract.methods.getAllBooks().call();
    this.setState({ bookDetails: response });
    console.log("books: ", this.state.bookDetails);
  };

  rentTranact = async () => {
    const { contract, accounts, rentHash} = this.state;
    await contract.methods.rentTransaction(rentHash).send({from: accounts[0]});
  };

  getTotal = async () => {
    const { contract, accounts } = this.state;
    const total = await contract.methods.getUploads(accounts[0]).call();
    console.log(total);
    this.setState({totalSold: total[0], earnings: total[1] });
  }

  loadHtml() {
    return (`https://ipfs.io/ipfs/${this.state.ipfsHash}`);
    // return (`https://wix.com`);
  }

  openModal(hash) {
    if (this.state.render) {
      this.setState({
        visible: true,
        ipfsHash: hash
      });
      // setTimeout(
      //   function () {
      //     this.setState({ render: false });
      //   }.bind(this), 100000);
    }
    else {
      this.setState({
        visible: false
      });
    }
  }

  openViewModal(hash) {
    if (this.state.render) {
      this.setState({
        visibleTimer: true,
        ipfsHash: hash
      });
      setTimeout(
        function () {
          this.setState({ render: false });
        }.bind(this), 10000);
    }
  }

  closeViewModal() {
    this.setState({
      visibleTimer: false
    });
  }

  
  closeModal() {
    this.setState({
      visible: false
    });
  }

  getFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file);
    console.log('buffer', this.state.buffer)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)

      ipfs.files.add(this.state.buffer, (error, result) => {
        if (error) {
          console.error(error)
          return
        }
        this.setState({ ipfsHash: result[0].hash })
        console.log("Book Details: ",this.state.bookDetails);
        Object.values(this.state.bookDetails).map((key, index) => {
          console.log(key[3])
          if(key[3] == this.state.ipfsHash) {
            console.log("exists" + this.state.exists)
            return(this.setState({exists: true}))
          }
        });
        if(this.state.exists) {
          alert("This book already exists!")
        }
      })

    }
  }

  getImage(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file);
    console.log('Image buffer', this)

    reader.onloadend = () => {
      this.setState({ imageBuffer: Buffer(reader.result) })
      console.log('Image buffer', this.state.imageBuffer)

      ipfs.files.add(this.state.imageBuffer, (error, result) => {
        if (error) {
          console.error(error)
          return
        }
        this.setState({bookImage: result[0].hash})
        console.log("Image Hash:", this.state.bookImage)
      })

    }
  }

  submitFile(event) {
    event.preventDefault();
    console.log("BUFFER ", this.state.imageBuffer);
    this.setState(this.uploadTransaction)  
  }

  calcTime(timestamp) {
    if (timestamp) {
      var date = new Date(timestamp * 1000);
      return date.toLocaleTimeString;
    }
  }

  toggle() {
    this.setState({
      shown: !this.state.shown,
      viewText: 'Hide Preview'
    });
  }

  buyToken(event) {
    event.preventDefault();
    this.setState(this.buyTokenTransaction);
  }

  viewTimerHandler(value) {
    console.log(value);
    this.openViewModal(value);
  }

  viewHandler(value) {
    console.log(value);
    this.openModal(value);
  }

  rentHandler(hash) {
    console.log(hash);
    this.setState({rentHash: hash}, this.rentTranact);
  }

  buyHandler(hash) {
    this.setState({ ipfsHash: hash }, this.purchaseTransaction);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    // var hidden = {
    // 	display: this.state.shown ? "block" : "none"
    // }

    const coins = Object.values(this.state.bookDetails).map((key, index) => (
      <Card days={key[6]} rentPrice={key[5]} imag={key[4]} pname={key[0]} author={key[1]} price={key[2]} rentClick={()=> this.rentHandler(key[3])}  buyClick={() => this.buyHandler(key[3])} />
    ));

    const booksList = Object.values(this.state.booksBought).map((key, index) => (
      <ProfileBooks imag={key[2]} pname={key[1]} onClick={()=> this.viewHandler(key[0])}/>
    ));
    
    const rentList = Object.values(this.state.rentedBooks).map((key, index) => (
      <ProfileBooks imag={key[2]} pname={key[1]} onClick={()=> this.viewHandler(key[0])}/>
    ));
    return (
      <div className="App">
        <div className="Header">
          <h1>auth.or</h1>
          <p><strong>My Address: </strong>{this.state.accounts[0]}</p>
          <p>Upload to IPFS and Secure by Ethereum</p>
        </div>

        <Tabs>
          <TabList className="tabs">
            <Tab>
              Upload
            </Tab>
            <Tab>
              Find Content
            </Tab>
            <Tab>
              Buy Tokens
            </Tab>
            <Tab>
              Profile
            </Tab>
            <Tab>
              Author Insights
            </Tab>
          </TabList>

          <TabPanel >

            <form className="form" onSubmit={(e) => this.submitFile(e)}>
              <h3>Select your file</h3>
              <label>Select Book: </label>
              <input type='file' onChange={this.getFile} accept='application/pdf' />
              <label>Select Book Image: </label>
              <input type='file' onChange={this.getImage} accept='image/*'/>
              <br></br>
              <label>Title: </label>
              <input className="text" type='text' onInput={e => this.setState({ contentName: e.target.value })} />
              <label>Author: </label>
              <input className="text" type='text' onInput={e => this.setState({ ownerName: e.target.value })} />
              <label>Purchase Price: </label>
              <input className="text" type='text' onInput={e => this.setState({ price: e.target.value })} />
              <label>Rent Price: </label>
              <input className="text" type='text' onInput={e => this.setState({ rent: e.target.value })} />
              <label>Rent Duration: </label>
              <input className="text" type='text' onInput={e => this.setState({ rentDays: e.target.value })} />
              <button className="button"><span>Upload </span></button><br></br>
              
              <div className="hash-div">
                <strong>IPFS Hash: </strong>
                <span className="hashLink" onClick={() => this.openModal(this.state.ipfsHash)}>{this.state.ipfsHash}</span>
              </div>
            </form>

            <Modal visible={this.state.visible} width="600" height="600" effect="fadeInUp" onClickAway={() => this.closeModal()}>
              <p><strong>Preview</strong></p>
              <iframe className="preview" src={this.loadHtml()} ></iframe>
            </Modal>

          </TabPanel>

          <TabPanel >
            <div>
              <button className="refresh" onClick={this.getAll}>Refresh</button>
            </div>
            <div className="coins">
              {coins}
            </div>
            <Modal visible={this.state.visible} width="600" height="600" effect="fadeInUp" onClickAway={() => this.closeModal()}>
              <p><strong>Book Review</strong></p>
              <iframe className="preview" src={this.loadHtml()} ></iframe>
            </Modal>
          </TabPanel>

          <TabPanel className="tab">
            
            <form className="form" onSubmit={this.buyToken}>
              <h3>Buy Tokens</h3>
              <label>Tokens: </label>
              <input className="text" type='text' onInput={e => this.setState({ token: e.target.value })} />
              <button className="buy button"><span>Buy </span></button>
            </form>
          </TabPanel>

          <TabPanel>
            <h3>Profile</h3>
            <div>
              <button className="refresh" onClick={this.getCustomerCall}>Refresh</button>
            </div>
            <p><strong>Wallet Balance: </strong>{parseInt(this.state.wallet)} </p>
            <p><strong>BOOKS BOUGHT</strong></p>
            {booksList}
            <Modal visible={this.state.visible} width="600" height="600" effect="fadeInUp" onClickAway={() => this.closeModal()}>
              <p><strong>Book </strong></p>
              <iframe className="preview" src={this.loadHtml()} ></iframe>
            </Modal>

            <p className="rentLabel"><strong>BOOKS RENTED</strong></p>
            {rentList}
          </TabPanel>
          <TabPanel className="insights">
          <div>
            <button className="refresh" onClick={this.getTotal}>Refresh</button>
          </div>
            <section>
              <h3>Total Books Sold / Rented</h3>
              <h1 className="head">{parseInt(this.state.totalSold)}</h1>
            </section>
            <section>
              <h3>Total Earnings</h3>
              <h1 className="head">{parseInt(this.state.earnings) + " ATC"}</h1>
            </section>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
export default App;