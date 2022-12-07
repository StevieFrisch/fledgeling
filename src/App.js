import { layout } from './Layout.js';
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
    <main style = {layout.Appmain} ref = {appRef}>
    <label style = {layout.title}>Fledgeling</label>
    <div style = {layout.box}>
        <label style = {layout.text} htmlFor="Email">Email:</label>
        <input style = {layout.textBox} type="text" id="Email" name="Email"></input>
        <button type="button" className="signSupporter" onClick = {(e) => getSupProjectsSign()}>Sign In Supporter</button>
        <button type="button" className="signDesigner" onClick = {(e) => getDesProjectsSign()}>Sign In Designer</button>
        <button type="button" className="regSupporter" onClick = {(e) => getSupProjectsReg()}>Register Supporter</button>
        <button type="button" className="regDesigner" onClick = {(e) => getDesProjectsReg()}>Register Designer</button>
        <button type="button" className="signAdmin" onClick = {(e) => getAdminProjectsSign()}>Sign In Admin</button>
    </div>
    <label style = {layout.fill}>Put like a picture here or something?</label>
    </main>)

    return (loginStuff);
}

export default App;
