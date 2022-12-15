
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
                <button type="button" className="button has-background-success has-text-white-bis" onClick = {(e) => root.render(<React.StrictMode><CreateProject /></React.StrictMode>)}>Create Project</button>
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
        <div>
          <button className="button is-normal mx-3 my-3" onClick = {(e) => back()}>&lt; Back</button>
        </div>

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
      <main className="hero has-background-info-light is-fullheight is-justify-content-start">
        
        <div>
          <button className="button is-normal mx-3 my-3" onClick = {(e) => back()}>&lt; Back</button>
        </div>
        
        <div className="columns box m-5">
          <div className="column">
            <div className="is-flex is-justify-content-left">
              <div className="is-flex is-flex-direction-column mx-5">

                <div className="box has-background-grey-darker">
                  <div className="container">
                    <label className="title is-3 has-text-white-ter">Project: {Jason.Name}</label>
                  </div>
                </div>

                <button className="button is-large is-success" onClick = {(e) => launchProject()}>Launch Project</button>

                <div className="columns my-3">
                  <div className="column">
                    <button className="button is-info is-large" onClick = {(e) => root.render(<React.StrictMode><CreatePledge /></React.StrictMode>)}>Create Pledge</button>
                  </div>
                  <div className="column">
                    <button className="button is-danger is-large" onClick = {(e) => deleteProject()}>Delete Project</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="column mr-6 pr-5">
            <div className="is-flex is-flex-direction-column is-align-content-center">
              <div>
                <label className="is-size-7 mb-1 has-text-grey-light">&nbsp;&nbsp;<strong>Amount Raised: ${Jason.Amount} / ${Jason.Goal}</strong></label>
                <progress className="progress is-success mb-3" value={Jason.Amount} max={Jason.Goal}/>
              </div>
              {RenderNewProject()}
            </div>
          </div>
        </div>

        <div className="columns mx-5">
          <div className="column">
            <div className="box">
              <h3 className="title is-3">Direct Donations:</h3>
              {RenderNewDonation()}
            </div>
          </div>
          <div className="column">
            <div className="box">
              <h3 className="title is-3">Pledges:</h3>
              {RenderNewPledge()}
            </div>
          </div>
        </div>
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

  function RenderNewDonation() {
    let donations = Jason.Donations;
    let result = [];
    donations.forEach(donation => {
      result.push(
        <div className="columns">
          <div className="column">
            <h6 class="subtitle is-6"><strong>Donator:</strong> {donation.Email}</h6>
          </div>
          <div className="column">
            <h6 class="subtitle is-6"><strong>Amount:</strong> ${donation.Amount}</h6>
          </div>
        </div>
      )
    });
    return result;
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
        <h4 className="subtitle is-4 my-5">
          <div className="columns">
            <div className="column">
              <strong>Designer:</strong> {Jason.DesignerName}
            </div>
            <div className="column">
              <strong>Description:</strong> {Jason.Description}<br/>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <strong>Deadline:</strong> {Jason.Deadline.substring(0, 10)}<br/>
            </div>
            <div className="column">
              <strong>Genre:</strong> {Jason.Genre}<br/>
            </div>
          </div>
          <div className="columns">
            <div className="column">
              <strong>Goal:</strong> ${Jason.Goal}<br/>
            </div>
            <div className="column">
              <strong>Status:</strong> {status}
            </div>
          </div>
        </h4>
      )
    return result;
  }
  
  function RenderNewPledge() {
    let pledges = Jason.PledgeTiers;
    let result = [];
    pledges.forEach(pledge => {
      result.push(
        <div className="columns">
          <div className="column">
            <button className="button is-info is-light" onClick = {(e) => viewPledge(pledge)}>${pledge.Amount}</button>
          </div>
          <div className="column">
            <h6 className="subtitle is-6">{pledge.Description}</h6>
          </div>
          <div className="column">
            <h6 className="subtitle is-6">Maximum Supporters: {pledge.MaxSupporters}</h6>
          </div>
          <div className="column">
            <button className="button is-danger" onClick = {(e) => deletePledge(pledge)}>Delete Pledge</button>
          </div>
        </div>
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
    <main className="hero has-background-info-light is-fullheight is-justify-content-start">
      <div>
        <button className="button is-normal mx-3 mt-3" onClick = {(e) => backProj()}>&lt; Back</button>
      </div>

        <div className="is-flex is-flex-direction-column is-justify-content-left">
          <div className="columns">
            <div className="column is-one-third">

              <div className="box m-5">
                <h1 className="title is-3 m-3">Pledge: ${Jason.Amount}</h1>
                <h1 className="subtitle is-5 m-3">Description: {Jason.Description}</h1>
              </div>

            </div>
          </div>
          <div className="columns">
            <div className="column is-one-third">
              <div className="box mx-5">
                <h4 className="title is-4 is-spaced">Current Supporters:</h4>
                {RenderSupporters()}
              </div>
            </div>
          </div>

          
        </div>
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
        <h5 className="subtitle is-6">{email}</h5>
      );
    }
    
    return result;
  }
  
  let PledgeAmount = React.createRef();
  let PledgeDesc = React.createRef();
  let PledgeMax = React.createRef();
  
  function CreatePledge(){
    let PledgeStuff = (
    <main className="hero has-background-info-light is-fullheight is-justify-content-start">
      <div className="is-flex is-justify-content-center mt-6">
        <div className="is-flex is-flex-direction-column is-justify-content-center">

          <label className="title is-4">Create Pledge</label>

          <div className="field">
            <label className="label">Amount &#40;$&#41;</label>
            <div className="control">
              <input className="input" placeholder="e.g. 100" type="text" id="Name" name="Name" ref={PledgeAmount}></input>
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea className="textarea" id="PledgeDesc" name="PledgeDesc" ref={PledgeDesc}></textarea>
            </div>
          </div>

          <div className="field">
            <label className="label">Max Supporters &#40;Optional&#41;</label>
            <div className="control">
              <input className="input" placeholder="e.g. 5" id="PledgeMax" name="PledgeMax" ref={PledgeMax}></input>
            </div>
          </div>

          <button className="button is-success" onClick = {(e) => CreateNewPledge()}>Create Pledge</button>
      </div>
      </div>
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
    if(Jason.IsActive != 0){
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