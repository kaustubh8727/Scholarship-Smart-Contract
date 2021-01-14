import React, { Component } from "react";
import Scholarship from "./contracts/Scholarship.json";
import Verify from "./Verify";
import getWeb3 from "./getWeb3";
import Web3 from 'web3';
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom';

import "./App.css";

class Apply extends Component {

  constructor(props) {
  super(props)
  this.state = {
    creator:'',
    contract:'',
    account: '',
    UniversityRollno:'',
    ClassRollno:'',
    Credits:'',
    Name:'',
    sgpa:'',
    Course:'',
    Branch:'',
    RecordsCount:'',
    apply:false,
    checkForApply:false
  }
    this.UniversityChange = this.UniversityChange.bind(this);
    this.classChange = this.classChange.bind(this);
    this.creditsChange = this.creditsChange.bind(this);
    this.nameChange = this.nameChange.bind(this);
    this.sgpaChange = this.sgpaChange.bind(this);
    this.courseChange = this.courseChange.bind(this);
    this.branchChange = this.branchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

async componentWillMount() {
  await this.loadWeb3();
  await this.loadBlockchainData();
}
async componentDidMount() {
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

    const networkId = await web3.eth.net.getId()
    const networkData = Scholarship.networks[networkId]
    if(networkData) {
      const contract = await new web3.eth.Contract(Scholarship.abi, networkData.address);
      this.setState({contract:contract});

      // const respons = await contract.methods.RecordsCount().call();
      // this.setState({RecordsCount:respons});
      // console.log(respons);
      // console.log(this.state.UniversityRollno);
      let recordsAre=await this.state.contract.methods.records(this.state.account).call();
      //console.log(recordsAre);
      this.setState({apply:recordsAre.isApplied});
      console.log(this.state.apply);
      this.setState({AmountPayed:recordsAre.AmountPayed});
      console.log(this.state.AmountPayed);

    } else {
      window.alert('Selling contract not deployed to detected network.')
    }
  }
    UniversityChange(event) {
      this.setState({UniversityRollno: event.target.value});
    }
    classChange(event) {
        this.setState({ClassRollno: event.target.value});
    }
    creditsChange(event) {
        this.setState({Credits: event.target.value});
    }
    nameChange(event) {
        this.setState({Name: event.target.value});
    }
    sgpaChange(event) {
        this.setState({sgpa: event.target.value});
    }
    courseChange(event) {
        this.setState({Course: event.target.value});
    }
    branchChange(event) {
        this.setState({Branch: event.target.value});
    }

    async handleSubmit(event) {
      const univ=await this.state.contract.methods.checkForApply(this.state.UniversityRollno).call();
      if(!univ){
        this.state.contract.methods.newRecord(this.state.UniversityRollno,this.state.ClassRollno,this.state.ClassRollno,this.state.Name,this.state.sgpa,this.state.Course,this.state.Branch).send({ from: this.state.account });
        console.log(this.state.UniversityRollno);
        console.log(this.state.ClassRollno);
        console.log(this.state.Name);
        console.log(this.state.sgpa);
      }
      else{
        alert("This University All ready exist");
      }
    }

  render() {
    let show;
    if(this.state.AmountPayed){
      show=<h2>Congratulations <br /> You Have Got Scholarship</h2>
    }
    else{
      if(this.state.apply){
        show=<h2>Thanks for Applying <br /> Your Application Has Been Submitted</h2>
      }
      else{
        show=
        <div className="apply-form">
              <div className="sub-apply-form">
                <label>University Roll Number  :</label><br />
                <input type="text" value={this.state.UniversityRollno} onChange={this.UniversityChange} /><br />

                <label>Class Roll Number  :</label><br />
                <input type="text" value={this.state.ClassRollno} onChange={this.classChange} /><br />

                <label>Credits  :</label><br />
                  <input type="text" value={this.state.Credits} onChange={this.creditsChange} /><br />

                <label>Name  :</label><br />
                  <input type="text" value={this.state.Name} onChange={this.nameChange} /><br />

                <label>SGPA  :</label><br />
                  <input type="text" value={this.state.sgpa} onChange={this.sgpaChange} /><br />

                <label>Course  :</label><br />
                  <input type="text" value={this.state.Course} onChange={this.courseChange} /><br />

                <label>Branch  :</label><br />
                  <input type="text" value={this.state.Branch} onChange={this.branchChange} /><br />

                <button className="apply-button" onClick={this.handleSubmit}>SUBMIT</button>
              </div>
       </div>
      }
    }
    return (
      <div className="App">
          <header className="Apply-header">
            <h1>Apply For Scholarship</h1>
          </header>
            {show}
      </div>
    );
  }
}

export default Apply;
