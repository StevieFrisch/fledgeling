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
      <main className="hero has-background-info-light is-fullheight ">
        <div className="is-flex is-flex-direction-column is-justify-content-space-between is-flex-wrap-nowrap">
          <div className="is-flex is-justify-content-space-between is-align-items-center my-5 mx-6">
            <div> 
              <label className="box title is-1">All Projects</label>
            </div>
            <div className="columns">
              <div className="column">
                <button type="button" className="button has-background-danger-light has-text-danger-dark" onClick = {(e) => login()}>Sign Out</button>
              </div>
            </div>
          </div>
          <div>
            <button className="button is-large is-danger mx-6 my-5"> Reap Projects</button>
          </div>
          {RenderProjectsAdmin(Jason)}
        </div>
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
        <div className="columns mx-6">
          <div className="column is-three-fifths p-0 my-5">
            <div className="box">
              <div className="is-flex is-flex-direction-column">
              <p className="title is-3 is-spaced">
                {project.Name}
              </p>
              <p className="subtitle is-5">{project.Description}</p>
                  <div className="columns">
                    <div className="column">
                      <p className="subtitle is-6">
                       Deadline: {project.Deadline.substring(0, 10)}
                      </p>
                    </div>
                    <div className="column">
                      <p className="subtitle is-6">
                       Genre: {project.Genre}
                      </p>
                    </div>
                    <div className="column">
                      <p className="subtitle is-6">
                       Goal: ${project.Goal}
                      </p>
                    </div>
                    <div className="column">
                      <p className="subtitle is-6">
                       Status: {status}
                      </p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
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
  
