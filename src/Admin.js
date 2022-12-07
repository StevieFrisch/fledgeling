import { layout } from './Layout.js';
import React from 'react';
import './App.css';
import {root} from './index.js';
import { currentUser, setCurrentUser, Jason, setJason, App } from './App.js';

function login() {
    if (window.confirm("Are you sure you want to sign out?") === true) {
        setCurrentUser("");
        setJason("");
        root.render(<React.StrictMode>
            <App />
        </React.StrictMode>);
    } else {
        console.log("cancled")
    }
}

export function getAdminProjectsSign(){
  
    let json = {
      Email: document.getElementById("Email").value,
    }
  
    setCurrentUser(document.getElementById("Email").value);
  
    fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/loginAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).then((responseJson) => {
      
      responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {
  
        setJason(JSON.parse(obj.body.body));
        root.render(<React.StrictMode>
          <AdminDash />
        </React.StrictMode>);
  
      })
    });
  }

function AdminDash () {
    let adminStuff =  (
      <main style = {layout.Appmain}>
      <label style = {layout.proj}>All Projects</label>
      <table>
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Designer</th>
              <th>Deadline</th>
              <th>Genre</th>
              <th>Goal</th>
              <th>Status</th>
            </tr>
            {RenderProjectsAdmin(Jason)}
          </table>
          <button type="button" className="createProject" >Reap projects</button>
          <button type="button" className="signOut" onClick = {(e) => login()}>Sign Out</button>
      </main>
    )
    
    return adminStuff;
  }
  
  function RenderProjectsAdmin(json) {
    let projects = json;
    let result = [];
    projects.forEach(project => {
      let date = new Date().toJSON();
      let time = JSON.stringify(date);
      var status;
      let year = parseInt(time.substring(1,5), 10);
      let month = parseInt(time.substring(6,8), 10);
      let day = parseInt(time.substring(9,11), 10);
  
      let projyear = parseInt(project.Deadline.substring(0,4), 10);
      let projmonth = parseInt(project.Deadline.substring(5,7), 10);
      let projday = parseInt(project.Deadline.substring(8,10), 10);
      if(((year >= projyear && month >= projmonth && day >= projday) || (year === projyear && month > projmonth) || (year > projyear)) && parseInt(project.IsActive, 10) === 1){
        status = "Failed";
      } else if ( parseInt(project.IsActive, 10) === 0) {
        status = "Inactive";
      } else {
        status = "Active";
      }
      result.push(
        <tr>
          <td><button>{project.Name}</button></td>
          <td>{project.Description}</td>
          <td>{project.DesignerName}</td>
          <td>{project.Deadline.substring(0, 10)}</td>
          <td>{project.Genre}</td>
          <td>${project.Goal}</td>
          <th>{status}</th>
        </tr>
      )
    });
    return result;
  }
  
