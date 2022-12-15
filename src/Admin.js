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
              <th>Delete?</th>
            </tr>
            {RenderProjectsAdmin(Jason)}
          </table>
          <button type="button" className="createProject" onClick = {(e) => reapProjects()}>Reap projects</button>
          <button type="button" className="signOut" onClick = {(e) => login()}>Sign Out</button>
      </main>
    )
    
    return adminStuff;
  }
  
  function RenderProjectsAdmin(json) {
    let projects = json;
    let result = [];
    projects.forEach(project => {
      var status;
      if(parseInt(project.IsActive, 10) === 3){
        status = "Failed";
      } else if (parseInt(project.IsActive, 10) === 0) {
        status = "Inactive";
      } else if (parseInt(project.IsActive, 10) === 1){
        status = "Active";
      } else if (parseInt(project.IsActive, 10) === 2){
        status = "Succesful";
      }
      result.push(
        <tr>
          <td>{project.Name}</td>
          <td>{project.Description}</td>
          <td>{project.DesignerName}</td>
          <td>{project.Deadline.substring(0, 10)}</td>
          <td>{project.Genre}</td>
          <td>${project.Goal}</td>
          <th>{status}</th>
          <td><button onClick = {(e) => deleteProject(project)}>Delete</button></td>
        </tr>
      )
    });
    return result;
  }

  function deleteProject(project) {
    if (window.confirm("Are you sure you want to delete this project?") === true) {
        let json = {
            Email: currentUser,
            ID: project.ID,
          }
        
          fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/deleteProject", {
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
      } else {
        console.log("Cancled");
      }

  }

  function reapProjects() {
    if (window.confirm("Are you sure you want to reap projects?") === true) {
    let json = {
      Email: currentUser,
    }
  
    fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/reapProjects", {
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
  } else {
    console.log("Cancled");
  }
  }
  
