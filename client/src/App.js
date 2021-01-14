import React, { Component } from "react";
import Scholarship from "./contracts/Scholarship.json";
import Apply from "./Apply";
import Verify from "./Verify";
import getWeb3 from "./getWeb3";
import Web3 from 'web3';
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom';

import "./App.css";

class App extends Component {

  constructor(props) {
  super(props)
  this.state = {
    creator:'',
    contract:'',
    account: '',
    ClassCordinator:'',
    hod:'',
    ExaminationCell:'',
    AccountDepartment:''
  }
}

async componentWillMount() {
  await this.loadWeb3();
  await this.loadBlockchainData();
}

async loadWeb3() {
  if (window.ethereum) {
    window.web3 = await new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = await new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

async loadBlockchainData() {
  let candi;
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] });
    console.log(this.state.account);
    const networkId = await web3.eth.net.getId()
    const networkData = Scholarship.networks[networkId]
    if(networkData) {
      const contract = await new web3.eth.Contract(Scholarship.abi, networkData.address);
      this.setState({contract:contract});
      console.log(contract);
      console.log(contract._address);
      const respons = await contract.methods.ClassCordinator().call();
      this.setState({ClassCordinator:respons});
      const hod = await contract.methods.HOD().call();
      this.setState({hod:hod});
      const exam = await contract.methods.ExaminationCell().call();
      this.setState({ExaminationCell:exam});
      const accountdept = await contract.methods.AccountDepartment().call();
      this.setState({AccountDepartment:accountdept});

    } else {
      window.alert('Selling contract not deployed to detected network.')
    }
  }

  render() {
    let approve;
    if(this.state.account==this.state.ClassCordinator || this.state.account==this.state.hod || this.state.account==this.state.ExaminationCell || this.state.account==this.state.AccountDepartment){
      approve=
              <div>
                <h3>Welcome Please Verify the Scholarship</h3>
                <Link className='sub-link2' to="/Verify">Verify The Scholarship</Link>
                <Route path="/Verify" component={Verify}/>
              </div>
    }
    else{
      approve=
            <div>
              <h3>Welcome Please Verify the Scholarship</h3>
              <Link className='sub-link1' to="/Apply">Apply For Scholarship</Link>
              <Route path="/Apply" component={Apply}/>
            </div>
    }
    return (
      <div className="App">
          <header className="App-header">
            <h1>Scholarship Smart Contract</h1>
          </header>
          <div className="links">
              <Router>
                  {approve}
             </Router>
          </div>
     </div>
    );
  }
}

export default App;
