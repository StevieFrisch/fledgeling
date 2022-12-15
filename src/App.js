import React from 'react';
import './App.css';
import {getDesProjectsSign, getDesProjectsReg} from './Designer.js'
import {getSupProjectsSign, getSupProjectsReg} from './Supporter.js'
import {getAdminProjectsSign} from './Admin.js'

export var Jason;
export var currentUser;

export function setJason(json){
  Jason = json
}

export function setCurrentUser(email){
  currentUser = email
}

export function App() {
  const appRef = React.useRef(null);
  let loginStuff =( 
    <main className="hero has-background-info-light is-fullheight is-justify-content-space-evenly" ref = {appRef}>
    <div className="is-flex is-justify-content-center">
      <div className="box"> 
        <label className="title is-1">Fledgeling</label>
      </div>
    </div>
    <div className="columns">
    <div className="column"></div>
      <div className="column is-half is-flex is-flex-direction-column">
        <div className="columns">
          <div className="column"></div>
          <div className="column is-two-thirds">
            <input type="email" id="Email" name="Email" className="input is-primary" placeholder="Email" maxlength = "44" minlength = "1"></input>
          </div>
          <div className="column"></div>
        </div>
        
        <div className="mt-3">
          <div className="is-flex is-justify-content-space-around is-flex-wrap-wrap">
            <button type="button" className="button is-large m-3" onClick = {(e) => getSupProjectsSign()}>Sign In Supporter</button>
            <button type="button" className="button is-large m-3" onClick = {(e) => getDesProjectsSign()}>Sign In Designer</button>
            <button type="button" className="button is-large m-3" onClick = {(e) => getSupProjectsReg()}>Register Supporter</button>
            <button type="button" className="button is-large m-3" onClick = {(e) => getDesProjectsReg()}>Register Designer</button>
            <button type="button" className="button is-large m-3" onClick = {(e) => getAdminProjectsSign()}>Sign In Admin</button>
          </div>
        </div>
      </div>
      <div className="column"></div>
    </div>
    </main>)

    return (loginStuff);
}

export default App;
