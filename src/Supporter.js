import { layout } from './Layout.js';
import React from 'react';
import './App.css';
import {root} from './index.js';
import { currentUser, setCurrentUser, Jason, setJason } from './App.js';







// Register a Supporter
export function getSupProjectsReg(){

  let json = {
    Email: document.getElementById("Email").value,
  }

  setCurrentUser(document.getElementById("Email").value);

  fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/registerSupporter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  }).then((responseJson) => {
    
    responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {

      setJason(JSON.parse(obj.body.body));
      root.render(<React.StrictMode>
        <SupDash />
      </React.StrictMode>);

    })
  });

//Testing JSON


}







//Sign in a supporter
export function getSupProjectsSign(){

  let json = {
    Email: document.getElementById("Email").value,
  }

  setCurrentUser(document.getElementById("Email").value);

  fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/loginSupporter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  }).then((responseJson) => {
    
    responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {

      setJason(JSON.parse(obj.body.body));
      root.render(<React.StrictMode>
        <SupDash />
      </React.StrictMode>);

    })
  });

  //Test JSON 
}







//Search Projects by Genre

//export function searchProjects(genre){


//}








//Supporter Dashboard Renderer
function SupDash () {
  let designerStuff =  (
    <main style = {layout.Appmain}>
    <label style = {layout.proj}>Projects</label>
    <label style = {layout.funds}>Funds</label>
    <table>
          <tr>
            <th>Project Name</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Genre</th>
            <th>Goal</th>
          </tr>
          {renderProjects(Jason)}
        </table>
    </main>
  )
  
  return designerStuff;
}



//render a list of projects in json file
function renderProjects(json) {
  let projects = json;
  let result = [];
  projects.forEach(project => {
    result.push(
      <tr>
        <td><button onClick = {(e) => viewProject(project)}>{project.Name}</button></td>
        <td>{project.Description}</td>
        <td>{project.Deadline.substring(0, 10)}</td>
        <td>{project.Genre}</td>
        <td>${project.Goal}</td>
      </tr>
    )
  });
  return result;
}




// view project when clicked on 
function viewProject(project) {
  let json = {
    ID: project.ID,
  }
 
  fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/viewProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).then((responseJson) => {
      
      responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {

        setJason(JSON.parse(obj.body.body));
        root.render(<React.StrictMode>
          <ProjectView />
        </React.StrictMode>);

      })
    });
}

function ProjectView() {
  let projectStuff =  (
    <main style = {layout.Appmain}>
    <label style = {layout.proj}>Project: {Jason.Name}</label>
    <label style = {layout.raised}>{Jason.Amount} / ${Jason.Goal}</label>
    <table>
          <tr>
            <th>Designer</th>
            <th>Description</th>
            <th>Deadline</th>
            <th>Genre</th>
            <th>Goal</th>
          </tr>
          {RenderNewProject()}
    </table>
    <table style = {layout.table}>
          <tr>
            <th>Pledge</th>
            <th>Description</th>
            <th>Max Supporters</th>
          </tr>
          {RenderNewPledge()}
    </table>
    </main>)

    return projectStuff;
}

function RenderNewProject() {
  let result = [];
    result.push(
      <tr>
        <td>{Jason.DesignerName}</td>
        <td>{Jason.Description}</td>
        <td>{Jason.Deadline.substring(0, 10)}</td>
        <td>{Jason.Genre}</td>
        <td>${Jason.Goal}</td>
      </tr>
    )
  return result;
}

function RenderNewPledge() {
  let pledges = Jason.PledgeTiers;
  let result = [];
  pledges.forEach(pledge => {
    result.push(
      <tr>
        <td><button onClick = {(e) => viewPledge(pledge)}>{pledge.Amount}</button></td>
        <td>{pledge.Description}</td>
        <td>{pledge.MaxSupporters}</td>
      </tr>
    )
  });
  return result;
}


//View Pledge
function viewPledge(pledge){

  let json = {
    Email: currentUser,
    ID: pledge.ID,
  }
  fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/viewPledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).then((responseJson) => {
      
      responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {

        setJason(JSON.parse(obj.body.body));
        root.render(<React.StrictMode>
          <PledgeView />
        </React.StrictMode>);

      })
    });
}



function PledgeView() {
    let pledgeStuff =  (
      <main style = {layout.Appmain}>
      <label style = {layout.proj}>Pledge: ${Jason.Amount}</label>
      <label style = {layout.description}>Description: {Jason.Description}</label>
      <button className = "claim" onClick = {(e) => ClaimPledge()}>{Jason.Amount}>Claim</button>
      </main>)
  
      return pledgeStuff;
  }


function ClaimPledge() {
    let json = {
        Email: currentUser,
        ID: Jason.ID,
      }
      fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/claimPledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        }).then((responseJson) => {
          
          responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {
    
            setJason(JSON.parse(obj.body.body));
            root.render(<React.StrictMode>
              <ProjectView />
            </React.StrictMode>);
    
          })
        });
}

