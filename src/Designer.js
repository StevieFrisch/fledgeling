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

export function getDesProjectsReg(){

    let json = {
      Email: document.getElementById("Email").value,
    }

     setCurrentUser(document.getElementById("Email").value);

    fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/registerDesigner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).then((responseJson) => {
      
      responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {

        setJason(JSON.parse(obj.body.body));
        root.render(<React.StrictMode>
          <DesDash />
        </React.StrictMode>);

      })
    });
    
  }

  export function getDesProjectsSign(){

    let json = {
      Email: document.getElementById("Email").value,
    }

    setCurrentUser(document.getElementById("Email").value);

    fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/loginDesigner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).then((responseJson) => {
      
      responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {

        setJason(JSON.parse(obj.body.body));
        root.render(<React.StrictMode>
          <DesDash />
        </React.StrictMode>);

      })
    });

  }

  function DesDash () {
    let designerStuff =  (
      <main className="hero has-background-info-light is-fullheight ">
        <div className="is-flex is-flex-direction-column is-justify-content-space-between is-flex-wrap-nowrap">
          <div className="is-flex is-justify-content-space-between is-align-items-center my-5 mx-6">
            <div> 
              <label className="box title is-1">Your Projects</label>
            </div>
            <div className="columns">
              <div className="column">
                <button type="button" className="button has-background-success has-text-white-bis" onClick = {(e) => root.render(<React.StrictMode><CreateProject /></React.StrictMode>)}>Create project</button>
              </div>
              <div className="column">
                <button type="button" className="button has-background-danger-light has-text-danger-dark" onClick = {(e) => login()}>Sign Out</button>
              </div>
            </div>
          </div>
          {RenderProjects(Jason)}
        </div>
      </main>
    )
    
    return designerStuff;
  }

  function RenderProjects(json) {
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
        <div className="columns mx-6">
          <div className="column is-three-fifths p-0 my-5">
            <div className="box is-clickable" onClick = {(e) => ViewProject(project)}>
              <div className="is-flex is-flex-direction-column">
              <p className="title is-3 is-spaced">
                <u>{project.Name}</u>
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

  function ViewProject(project) {
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

    let Name = React.createRef();
    let Desc = React.createRef();
    let Deadline = React.createRef();
    let Goal = React.createRef();
    let Genre = React.createRef();

  function CreateProject(){
    let projectStuff = (
      <main className="hero has-background-info-light is-fullheight is-justify-content-space-evenly">
      <div className="is-flex is-justify-content-center">
        <div className="is-flex is-flex-direction-column is-justify-content-center">

          <label className="title is-4">Create Project</label>

          <div className="field">
            <label className="label">Project Name</label>
            <div className="control">
              <input className="input" type="text" id="Name" name="Name" ref={Name}></input>
            </div>
          </div>

          <div className="field">
            <label className="label">Project Description</label>
            <div className="control">
              <textarea className="textarea" id="Desc" name="Desc" ref={Desc}></textarea>
            </div>
          </div>

          <div className="field">
            <label className="label">Project Deadline</label>
            <div className="control">
              <input className="input" type="date" placeholder="Project Deadline" id="Deadline" name="Deadline" ref={Deadline}></input>
            </div>
          </div>

          <div className="field">
            <label className="label">Goal</label>
            <div className="control">
              <input className="input" type="text" placeholder="e.g. 1000" id="Goal" name="Goal" ref={Goal}></input>
            </div>
          </div>

          <div className="field">
            <label className="label">Genre</label>
              <div class="select">
                <select ref={Genre} id = "myList">
                  <option> Choose Genre </option>
                  <option> Game </option>
                  <option> Food </option>
                  <option> Music </option>
                  <option> Movie </option>
                </select>
              </div>
          </div>

          <button className="button is-success" onClick = {(e) => CreateNewProject()}>Create Project</button>

        </div>
      </div>
    </main>)
  
  
  
    return projectStuff;
    
  }
  
  function CreateNewProject(){
  
    if(Goal.current.value.substring(0,1) === "$"){
      Goal.current.value = Goal.current.value.substring(1);
    }
  
    let json = {
      Email: currentUser,
      Name: Name.current.value,
      Description: Desc.current.value,
      Deadline: Deadline.current.value + "T00:00:00.000Z",
      Genre: Genre.current.value,
      Goal: Goal.current.value,
    }
  
    fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/createProject", {
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
      <label style = {layout.raised}>${Jason.Amount} / ${Jason.Goal}</label>
      <table>
            <tr>
              <th>Designer</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Genre</th>
              <th>Goal</th>
              <th>Status</th>
            </tr>
            {RenderNewProject()}
      </table>
      <table style = {layout.table}>
            <tr>
              <th>Pledge</th>
              <th>Description</th>
              <th>Max Supporters</th>
              <th>Delete?</th>
            </tr>
            {RenderNewPledge()}
      </table>
          <button type="button" className="createPledge" onClick = {(e) => root.render(<React.StrictMode><CreatePledge /></React.StrictMode>)}>Create Pledge</button>
          <button type="button" className="deleteProject" onClick = {(e) => deleteProject()}>Delete Project</button>
          <button type="button" className="launchProject" onClick = {(e) => launchProject()}>Launch Project</button>
          <button type="button" className="back" onClick = {(e) => back()}>Back</button>
      </main>)
      return projectStuff;
  }

  function back() {
    let json = {
        Email: currentUser,
      }
    
      fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/loginDesigner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        }).then((responseJson) => {
          
          responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {
    
            setJason(JSON.parse(obj.body.body));
            root.render(<React.StrictMode>
              <DesDash />
            </React.StrictMode>);
          })
        });
  }

  
  function RenderNewProject() {
    let result = [];

      let date = new Date().toJSON();
      let time = JSON.stringify(date);
      var status;
      let year = parseInt(time.substring(1,5), 10);
      let month = parseInt(time.substring(6,8), 10);
      let day = parseInt(time.substring(9,11), 10);
  
      let projyear = parseInt(Jason.Deadline.substring(0,4), 10);
      let projmonth = parseInt(Jason.Deadline.substring(5,7), 10);
      let projday = parseInt(Jason.Deadline.substring(8,10), 10);
      if(((year >= projyear && month >= projmonth && day >= projday) || (year === projyear && month > projmonth) || (year > projyear)) && parseInt(Jason.IsActive, 10) === 1){
        status = "Failed";
      } else if ( parseInt(Jason.IsActive, 10) === 0) {
        status = "Inactive";
      } else {
        status = "Active";
      }

      result.push(
        <tr>
          <td>{Jason.DesignerName}</td>
          <td>{Jason.Description}</td>
          <td>{Jason.Deadline.substring(0, 10)}</td>
          <td>{Jason.Genre}</td>
          <td>${Jason.Goal}</td>
          <td>{status}</td>
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
          <td><button onClick = {(e) => viewPledge(pledge)}>${pledge.Amount}</button></td>
          <td>{pledge.Description}</td>
          <td>{pledge.MaxSupporters}</td>
          <td><button onClick = {(e) => deletePledge(pledge)}>Delete</button></td>
        </tr>
      )
    });
    return result;
  }

  var projID;

  function viewPledge(pledge) {
    projID = Jason.ID

    let json = {
      ID: pledge.ID,
    }

    fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/designerViewPledge", {
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

  function PledgeView () {
    let pledgeStuff =  (
      <main style = {layout.Appmain}>
      <label style = {layout.proj}>Pledge: ${Jason.Amount}</label>
      <label style = {layout.description}>Description: {Jason.Description}</label>
      <table style = {layout.table}>
            <tr>
              <th>Supporters</th>
            </tr>
            {RenderSupporters()}
      </table>
      <button type="button" className="back" onClick = {(e) => backProj()}>Back</button>
      </main>)
  
      return pledgeStuff;
  }

  function backProj() {
    let json = {
      ID: projID,
    }

    projID = "";
  
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

  function RenderSupporters() {
    let supporters = Jason.CurrentSupporters;
    let result = [];
    for(let email of supporters){
      result.push(
        <tr>
          <td>{email}</td>
        </tr>
      );
    }
    
    return result;
  }
  
  let PledgeAmount = React.createRef();
  let PledgeDesc = React.createRef();
  let PledgeMax = React.createRef();
  
  function CreatePledge(){
    let PledgeStuff = (
    <main style = {layout.Appmain}>
        <label style = {layout.name} htmlFor="Amount">Amount:</label>
        <input style = {layout.nametextBox} type="text" id="PledgeAmount" name="PledgeAmount" ref={PledgeAmount}></input>
        <label style = {layout.desc} htmlFor="Desc">Description:</label>
        <input style = {layout.desctextBox} type="text" id="PledgeDesc" name="PledgeDesc" ref={PledgeDesc}></input>
        <label style = {layout.deadline} htmlFor="PledgeMax">Max Supporters:</label>
        <input style = {layout.maxtextBox} type="PledgeMax" id="PledgeMax" name="PledgeMax" ref={PledgeMax}></input>
        <button id = "btn" type="button" className="createProject2" onClick = {(e) => CreateNewPledge()}>Submit</button>
    </main>)
  
    return PledgeStuff;
  }
  
  function CreateNewPledge(){
  
    if(PledgeAmount.current.value.substring(0,1) === "$"){
      PledgeAmount.current.value = PledgeAmount.current.value.substring(1);
    }
  
    let json = {
      Email: currentUser,
      Amount: PledgeAmount.current.value,
      Description: PledgeDesc.current.value,
      ProjectID: Jason.ID,
      MaxSupporters: PledgeMax.current.value,
    }
  
    fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/createPledge", {
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

  function deleteProject() {
    if (window.confirm("Are you sure you want to delete this project?") === true) {
        let json = {
            Email: currentUser,
            ID: Jason.ID,
          }
        
          fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/deleteProject", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(json),
            }).then((responseJson) => {
              
              responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {
        
                setJason(JSON.parse(obj.body.body));
                root.render(<React.StrictMode>
                  <DesDash />
                </React.StrictMode>);
        
              })
            });
      } else {
        console.log("Cancled");
      }

  }

  function deletePledge(pledge) {
    if (window.confirm("Are you sure you want to delete this pledge?") === true) {
        let json = {
            ID: pledge.ID,
            ProjectID: Jason.ID
          }
          
          fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/deletePledge", {
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
      } else {
        console.log("Cancled");
      }
  }

  function launchProject() {
    if(Jason.IsActive === 1){
        alert("Project is already lauched");
    } else {
        if (window.confirm("Launch Project?") === true) {
            let json = {
                ID: Jason.ID
              }
              
              fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/launchProject", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(json),
                }).then((responseJson) => {
                  
                  responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {
            
                    setJason(JSON.parse(obj.body.body));
                    root.render(<React.StrictMode>
                      <ProjectView />
                    </React.StrictMode>);
                    alert("Project Launched");
                  })
                });
          } else {
            console.log("Cancled");
          }
    }
    
  }