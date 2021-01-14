import React, { Component } from "react";
import Scholarship from "./contracts/Scholarship.json";
import Apply from "./Apply";
import getWeb3 from "./getWeb3";
import Web3 from 'web3';
import {
  BrowserRouter as Router,
  Link,
  Route,
} from 'react-router-dom';

import "./App.css";

class Verify extends Component {

  constructor(props) {
  super(props)
  this.state = {
    contract:'',
    account: '',
    address:'',
    result:[],
    check:false,
    ClassCordinator:'',
    hod:'',
    ExaminationCell:'',
    AccountDepartment:'',
    checkClassCordinator:false,
    checkhod:false,
    checkAccountDepartment:false,
    checkExaminationCell:false,
    checkverification:false,
    payCheck:false,
    payResult:[],
    showApprovedRecords:true,
    checkResult:[],
    checkshow:{
      Name:'',
      UniversityRollno:'',
      Course:'',
      Branch:'',
      sgpa:'',
      Credits:'',
      AmountPayed:'',
      Addr:''
    },
    checkShow:false
  }
  this.addressChange = this.addressChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.ClassCordinatorSubmit = this.ClassCordinatorSubmit.bind(this);
  this.HODSubmit = this.HODSubmit.bind(this);
  this.ExaminationCellSubmit = this.ExaminationCellSubmit.bind(this);
  this.AccountDepartmentSubmit = this.AccountDepartmentSubmit.bind(this);
  this.verifySubmit = this.verifySubmit.bind(this);
  this.PaySubmit = this.PaySubmit.bind(this);
  this.handlePaySubmit = this.handlePaySubmit.bind(this);
  this.checkApprove = this.checkApprove.bind(this);
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
  addressChange(event){
    this.setState({address: event.target.value});
  }
  async handleSubmit(){
    if(this.state.address!=''){
      const result=await this.state.contract.methods.records(this.state.address).call();
      this.setState({result: result});
      console.log(this.state.result);
      this.setState({check: true});
    }
    else{
      alert("Please Enter The Account");
    }
    // const check=await this.state.contract.methods.records(this.state.address).signatures[this.state.account].call();
    // this.setState({checkverification:check})
    // console.log(this.state.result.signatures[this.state.account]);
  }
  async handlePaySubmit(){
    if(this.state.address!=''){
      const payresult=await this.state.contract.methods.records(this.state.address).call();
      this.setState({payResult: payresult});
      console.log(this.state.payResult);
      this.setState({payCheck: true});
    }
    else{
      alert("Please Enter The Account");
    }
  }
  async verifySubmit(){
    if(this.state.result.isApplied){
      await this.state.contract.methods.signRecord(this.state.address).send({ from: this.state.account });
    }
    else{
      alert("Not Valid!!");
    }
    // console.log("Verify Clicked");
  }
  ClassCordinatorSubmit(){
    if(this.state.account==this.state.ClassCordinator){
      this.setState({checkClassCordinator:true});
      this.setState({checkhod:false});
      this.setState({checkAccountDepartment:false});
      this.setState({checkExaminationCell:false});
      this.setState({showApprovedRecords:false});
      this.setState({checkShow:false});
    }
    else{
      alert("please Login with your Account");
    }
  }
  HODSubmit(){
    if(this.state.account==this.state.hod){
      this.setState({checkClassCordinator:false});
      this.setState({checkhod:true});
      this.setState({checkAccountDepartment:false});
      this.setState({checkExaminationCell:false});
      this.setState({showApprovedRecords:false});
      this.setState({checkShow:false});
    }
    else{
      alert("please Login with your Account");
    }
  }
  ExaminationCellSubmit(){
    if(this.state.account==this.state.ExaminationCell){
      this.setState({checkClassCordinator:false});
      this.setState({checkhod:false});
      this.setState({checkAccountDepartment:false});
      this.setState({checkExaminationCell:true});
      this.setState({showApprovedRecords:false});
      this.setState({checkShow:false});
    }
    else{
      alert("please Login with your Account");
    }
  }
  AccountDepartmentSubmit(){
    if(this.state.account==this.state.AccountDepartment){
      this.setState({checkClassCordinator:false});
      this.setState({checkhod:false});
      this.setState({checkAccountDepartment:true});
      this.setState({checkExaminationCell:false});
      this.setState({showApprovedRecords:false});
      this.setState({checkShow:false});
    }
    else{
      alert("please Login with your Account");
    }
  }
  async PaySubmit(){
    if(this.state.payResult.AmountPayed==false && this.state.payResult.isApplied==true && this.state.payResult.signatureCount==3){
      //const web3 = window.web3;
      let value=5;
      const price=window.web3.utils.toWei(value.toString(),'Ether');
      await this.state.contract.methods.payAmount(this.state.address).send({ from: this.state.account, value:price });
    }
    else{
      alert("Amount Cannot be payed");
    }
    //alert("PaySubmit clicked");
  }
  async checkApprove(){
    let showres=this.state.checkshow;
    const count=await this.state.contract.methods.RecordsCount().call();
    console.log(count);
    for(var i=0;i<count;i++){
      const  array=await this.state.contract.methods.recordsArr(i).call();
      console.log(array);
      const checkresult=await this.state.contract.methods.records(array).call();
      if(checkresult.AmountPayed==true){
        showres={
          Name:checkresult.StudentName,
          UniversityRollno:checkresult.UniversityRollno,
          Course:checkresult.Course,
          Branch:checkresult.Branch,
          sgpa:checkresult.SGPA,
          Credits:checkresult.Credits,
          AmountPayed:checkresult.AmountPayed,
          Addr:checkresult.Addr
        }
        this.state.checkResult.push(showres);
        //console.log(checkresult);
      }
    }
    console.log(this.state.checkResult);
    this.setState({checkShow:true});
    this.setState({showApprovedRecords:false});
    // const checkresult=await this.state.contract.methods.records(this.state.address).call();
    // this.setState({result: result});
    // console.log(this.state.result);
    // this.setState({check: true});
    //alert("Check");
  }
  render() {
    var res=this.state.result;
    let show;
    if(this.state.check){
      show=<div className="result-div">
              <table className="result-table">
                  <tr>
                  <th>Student Name</th>
                  <th>{res.StudentName}</th>
                  </tr>

                  <tr>
                  <th>University Roll Number</th>
                  <th>{res.UniversityRollno}</th>
                  </tr>

                  <tr>
                  <th>Class Roll Number</th>
                  <th>{res.ClassRollno}</th>
                  </tr>

                  <tr>
                  <th>Course</th>
                  <th>{res.Course}</th>
                  </tr>

                  <tr>
                  <th>Branch</th>
                  <th>{res.Branch}</th>
                  </tr>

                  <tr>
                  <th>SGPA</th>
                  <th>{res.SGPA}</th>
                  </tr>

                  <tr>
                  <th>Credits</th>
                  <th>{res.Credits}</th>
                  </tr>

                  <tr>
                  <th>Total Verification</th>
                  <th>{res.signatureCount}</th>
                  </tr>

                  <tr>
                  <th>Amount Payed</th>
                  <th>{res.AmountPayed.toString()}</th>
                  </tr>
              </table>
              <button className="verify-button" onClick={this.verifySubmit}>APPROVE</button>
           </div>
    }
    let payShow;
    if(this.state.payCheck){
      payShow=<div className="result-div">
              <table className="result-table">
                  <tr>
                  <th>Student Name</th>
                  <th>{this.state.payResult.StudentName}</th>
                  </tr>

                  <tr>
                  <th>University Roll Number</th>
                  <th>{this.state.payResult.UniversityRollno}</th>
                  </tr>

                  <tr>
                  <th>Class Roll Number</th>
                  <th>{this.state.payResult.ClassRollno}</th>
                  </tr>

                  <tr>
                  <th>Course</th>
                  <th>{this.state.payResult.Course}</th>
                  </tr>

                  <tr>
                  <th>Branch</th>
                  <th>{this.state.payResult.Branch}</th>
                  </tr>

                  <tr>
                  <th>SGPA</th>
                  <th>{this.state.payResult.SGPA}</th>
                  </tr>

                  <tr>
                  <th>Credits</th>
                  <th>{this.state.payResult.Credits}</th>
                  </tr>

                  <tr>
                  <th>Total Verification</th>
                  <th>{this.state.payResult.signatureCount}</th>
                  </tr>

                  <tr>
                  <th>Amount Payed</th>
                  <th>{this.state.payResult.AmountPayed.toString()}</th>
                  </tr>
              </table>
              <button className="verify-pay-button" onClick={this.PaySubmit}>Pay Amount</button>
           </div>
    }
    let inputshow;
      if(this.state.checkClassCordinator==true || this.state.checkhod==true || this.state.checkExaminationCell==true){
        inputshow=<div>
                    <input type="text" className="search-input-account" placeholder="Enter The Account number" value={this.state.address} onChange={this.addressChange} />
                    <button className="search-button" onClick={this.handleSubmit}>SUBMIT</button>
                    {show}
                  </div>
      }
      else if(this.state.checkAccountDepartment==true){
        inputshow=<div>
                    <input type="text" value={this.state.address} placeholder="Enter The Account number" onChange={this.addressChange} />
                    <button className="search-button" onClick={this.handlePaySubmit}>SUBMIT</button>
                    {payShow}
                  </div>
      }
      let verifyshow;
      if(this.state.checkShow){
        verifyshow=<div className="result-div">
                        {this.state.checkResult.map(ob=>(
                          <table className="result-table">
                              <tr>
                              <th>Student Name</th>
                              <th>{ob.Name}</th>
                              </tr>

                              <tr>
                              <th>University Roll Number</th>
                              <th>{ob.UniversityRollno}</th>
                              </tr>

                              <tr>
                              <th>Course</th>
                              <th>{ob.Course}</th>
                              </tr>

                              <tr>
                              <th>Branch</th>
                              <th>{ob.Branch}</th>
                              </tr>

                              <tr>
                              <th>SGPA</th>
                              <th>{ob.sgpa}</th>
                              </tr>

                              <tr>
                              <th>Credits</th>
                              <th>{ob.Credits}</th>
                              </tr>

                              <tr>
                              <th>Amount Payed</th>
                              <th>{ob.AmountPayed.toString()}</th>
                              </tr>

                              <tr>
                              <th>Address</th>
                              <th>{ob.Addr.toString()}</th>
                              </tr>
                          </table>
                        ))}
                    </div>
      }
      let showApprovedRecords;
      if(this.state.showApprovedRecords){
        showApprovedRecords=<button className="click-button" onClick={this.checkApprove}>Approved Records</button>
      }
    return (
      <div className="App">
          <header className="Verify-header">
            <h1>Verify The Scholarship</h1>
          </header>
          <div className="Buttons">
            <button className="click-button" onClick={this.ClassCordinatorSubmit}>Class Cordinator</button>
            <button className="click-button" onClick={this.HODSubmit}>HOD</button>
            <button className="click-button" onClick={this.ExaminationCellSubmit}>Examination Cell</button>
            <button className="click-button" onClick={this.AccountDepartmentSubmit}>Accounts Department</button>
            {showApprovedRecords}
          </div>
          {inputshow}
          {verifyshow}
      </div>
    );
  }
}

export default Verify;
