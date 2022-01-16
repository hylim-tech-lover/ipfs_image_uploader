import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, ipfsHash: '' };

  captureFile = this.captureFile.bind(this);
  onSubmit = this.onSubmit.bind(this);

  componentDidMount = async () => {
    // try {
    //   // Get network provider and web3 instance.
    //   const web3 = await getWeb3();

    //   // Use web3 to get the user's accounts.
    //   const accounts = await web3.eth.getAccounts();

    //   // Get the contract instance.
    //   const networkId = await web3.eth.net.getId();
    //   const deployedNetwork = SimpleStorageContract.networks[networkId];
    //   const instance = new web3.eth.Contract(
    //     SimpleStorageContract.abi,
    //     deployedNetwork && deployedNetwork.address,
    //   );

    //   // Set web3, accounts, and contract to the state, and then proceed with an
    //   // example of interacting with the contract's methods.
    //   this.setState({ web3, accounts, contract: instance }, this.runExample);
    // } catch (error) {
    //   // Catch any errors for any of the above operations.
    //   alert(
    //     `Failed to load web3, accounts, or contract. Check console for details.`,
    //   );
    //   console.error(error);
    // }
  };

  captureFile(event) {
    event.preventDefault()
    // Get loaded file and stored in file
    const file = event.target.files[0]
    // Node API to read file
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    // Function in ES6
    reader.onloadend = () => {
      // Store buffer to state in React
      this.setState({ buffer: Buffer(reader.result) })
      console.log('result of raw buffer:', this.state.buffer)
    }
  }

  onSubmit(event) {
    // Prevent default behavior of on submit to auto refresh page
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if (error) {
        console.log(error)
        return
      }
      this.setState({ ipfsHash: result[0].hash })
      console.log('ipfs hash:',this.state.ipfsHash)
    })
  }

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    // img src with string manipulation with {`{react_state}`}
    return (
      <div className="App">
        <h1>Your Image</h1>
        <p>This image is stored on IPFS and the Ethereum Blockchain.</p>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="picture" />
        <h2>Upload Image</h2>
        <form onSubmit={this.onSubmit} >
          <input type='file' onChange={this.captureFile} />
          <input type='submit' />
        </form>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
