import { layout } from './Layout.js';
import React from 'react';
import './App.css';
import {root} from './index.js';
import { currentUser, setCurrentUser, Jason, setJason, App } from './App.js';

let directSupportAmmount= React.createRef();
let AddFundsAmount= React.createRef();
let search = React.createRef();

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



// Register a Supporter
export function getSupProjectsReg(){
  if(document.getElementById("Email").value === ""){
    alert("Please enter an email");
  } else {
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
  }


}


//Sign in a supporter
export function getSupProjectsSign(){
  if(document.getElementById("Email").value === ""){
    alert("Please enter an email");
  } else {
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
  }

  
}

//Supporter Dashboard Renderer
function SupDash () {
  let designerStuff =  (
    <main className="hero has-background-info-light is-fullheight ">
        <div className="is-flex is-flex-direction-column is-justify-content-space-between is-flex-wrap-nowrap">
          <div className="is-flex is-justify-content-space-between is-align-items-center my-5 mx-6">
            <div> 
              <label className="box title is-1">Projects</label>
            </div>
            <div className="columns">
              <div className="column">
                  <div className="field has-addons">
                  <div className="control">
                    <input className="input" type="text" placeholder="e.g. 1000" id="AddFundsAmount" name="AddFundsAmount" ref={AddFundsAmount}></input>
                  </div>
                  <div className="control">
                    <a className="button is-success" onClick = {(e) => addFunds()}>
                      Add Funds
                    </a>
                  </div>
                  </div>  
              </div>
              <div className="column is-3">
                <button className="button is-info" onClick = {(e) => viewActivity()}>View Profile</button>
              </div>
              <div className="column is-3">
                <button type="button" className="button has-background-danger-light has-text-danger-dark mr-0" onClick = {(e) => login()}>Sign Out</button>
              </div>
            </div>
          </div>
          <div className="field has-addons mx-6">
            <div className="control">
              <input className="input" type="text" placeholder="Search here" id="AddFundsAmount" name="AddFundsAmount" ref={search}></input>
            </div>
            <div className="control">
              <a className="button is-success" onClick = {(e) => searchProjects()}>
                Search
              </a>
            </div>
          </div>
          <p className="subtitle is-7 mx-6 my-1">Sort by Genre:</p>
          <div className="field has-addons mx-6">
            <p className="control">
              <button className="button" name="genre" value="Game" id="c1" onClick = {(e) => searchProjectsGenre("Game")}>
                <span>Game</span>
              </button>
            </p>
            <p className="control">
              <button className="button" name="genre" value="Food" id="c2" onClick = {(e) => searchProjectsGenre("Food")}>
                <span>Food</span>
              </button>
            </p>
            <p className="control">
              <button className="button" name="genre" value="Movie" id="c3" onClick = {(e) => searchProjectsGenre("Movie")}>
                <span>Movie</span>
              </button>
            </p>
            <p className="control">
              <button className="button" name="genre" value="Music" id="c4" onClick = {(e) => searchProjectsGenre("Music")}>
                <span>Music</span>
              </button>
            </p>
          </div>
          <div>
            <button className="button is-small is-danger is-outlined mx-6 mt-0 mb-5 py-1" onClick = {(e) => searchProjectsGenre("Reset")}>Reset Search</button>
          </div>
          {renderProjects(Jason)}
        </div>
      </main>
  )
  
  return designerStuff;
}

function directSupport() {
  let json = {
    Email: currentUser,
    ID: Jason.ID,
    Amount: directSupportAmmount.current.value
  }

  fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/directSupport", {
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

//render a list of projects in json file
function renderProjects(json) {
  let projects = json;
  let result = [];
  projects.forEach(project => {
    result.push(
      <div className="columns mx-6">
          <div className="column is-three-fifths p-0 my-5">
            <div className="box is-clickable" onClick = {(e) => viewProject(project)}>
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
                  </div>
              </div>
            </div>
          </div>
        </div>
    )
  });
  return result;
}

function searchProjectsGenre(genre) {
  finalgenre = genre;
  if(genre === "Reset") {
    finalgenre = "";
    let json = {
      Email: currentUser,
    }
  
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
  } else {
    searchProjects();
  }

}

var finalgenre;

function searchProjects() {

  let json = {
    Genre: finalgenre,
    Keyword: search.current.value
  }
 
  fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/searchProjects", {
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
    <main className="hero has-background-info-light is-fullheight is-justify-content-start">

        <div>
          <button className="button is-normal mx-5 my-3" onClick = {(e) => back()}>&lt; Back</button>
        </div>
        
        <div className="columns box m-5">
          <div className="column">
            <div className="is-flex is-justify-content-left">
              <div className="is-flex is-flex-direction-column is-justify-content-space-between mx-5">

                <div className="box has-background-grey-darker">
                  <div className="container">
                    <label className="title is-3 has-text-white-ter">Project: {Jason.Name}</label>
                  </div>
                </div>
                <div>
                  <h3 className="title is-5 mb-1">Directly Support:</h3>
                  <div className="field has-addons">
                    <div className="control">
                      <input className="input" type="text" placeholder="e.g. 1000" id="directSupport" name="directSupport" ref={directSupportAmmount}></input>
                    </div>
                    <div className="control">
                      <a className="button is-success" onClick = {(e) => directSupport()}>
                        Donate!
                      </a>
                    </div>
                  </div> 
                </div>
              </div>

            </div>
          </div>
          <div className="column mr-6 pr-5">
            <div className="is-flex is-flex-direction-column is-align-content-center">
              <div>
                <label className="is-size-6 mb-4 has-text-grey-light">&nbsp;&nbsp;<strong>Amount Raised: ${Jason.Amount} / ${Jason.Goal}</strong></label>
                <progress className="progress is-success mb-3" value={Jason.Amount} max={Jason.Goal}/>
              </div>
              {RenderNewProject()}
            </div>
          </div>
        </div>

        <div className="columns mx-3">
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
}

function RenderNewProject() {
  let result = [];
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
        </h4>
    )
  return result;
}



var funds;

function addFunds(money) {

  let json = {
    Email: currentUser,
    Amount: AddFundsAmount.current.value,
  }
  fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/addFunds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(json),
        }).then((responseJson) => {
          
          responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {
    
            funds=(JSON.parse(obj.body.body));
            
            alert("Funds Added");
    
          })
        });
}




function RenderNewPledge() {
  let pledges = Jason.PledgeTiers;
  let result = [];
  pledges.forEach(pledge => {
    var maxSupp;
      if(pledge.MaxSupporters === -1){
        maxSupp = "None";
      } else {
        maxSupp = pledge.MaxSupporters;
      }
    result.push(
      <div className="columns">
          <div className="column">
            <button className="button is-info is-light" onClick = {(e) => viewPledge(pledge)}>${pledge.Amount}</button>
          </div>
          <div className="column">
            <h6 className="subtitle is-6">{pledge.Description}</h6>
          </div>
          <div className="column">
            <h6 className="subtitle is-6"><strong>Maximum Supporters: </strong>{maxSupp}</h6>
          </div>
      </div>
    )
  });
  return result;
}

var projID;

//View Pledge
function viewPledge(pledge){
  projID = Jason.ID;

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

function viewActivity() {
  let json = {
    Email: currentUser
  }
 
  fetch("https://eh3q636qeb.execute-api.us-east-1.amazonaws.com/Prod/viewSupporterActivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json),
    }).then((responseJson) => {
      
      responseJson.json().then(data => ({status: responseJson.status, body: data})).then(obj => {

        setJason(JSON.parse(obj.body.body));
        console.log("printing supporter profile")
        root.render(<React.StrictMode>
          <SupporterProfile />
        </React.StrictMode>);

      })
    });
}

function SupporterProfile() {
  let supporterStuff = (
    <main className="hero has-background-info-light is-fullheight is-justify-content-start">

        <div>
          <button className="button is-normal mx-5 my-3" onClick = {(e) => back()}>&lt; Back</button>
        </div>
        
        <div className="columns m-5">
          <div className="column">
            <div className="is-flex is-justify-content-center">
              <div className="is-flex is-flex-direction-column is-justify-content-space-between mx-5">

                <div className="box">
                  <div className="container">
                    <h3 className="title is-2 is-spaced">Recent Supporter Activity</h3>
                  </div>
                  <h3 className="subtitle is-5 mt-3">Email: {currentUser}</h3>
                  <h3 className="tag is-primary is-light is-large mt-0">Available Funds: ${Jason.Funds}</h3>
                </div>
                <div className="columns">
                  <div className="column">
                    <div className="box">
                      <div className="container">
                        <h2 className="title is-4">Recent Donations:</h2>
                      </div>
                      <h4 className="subtitle is-5 my-5">
                        <div className="columns">
                          <div className="column">
                            <strong>Project Name:</strong>
                          </div>
                          <div className="column">
                            <strong>Donation Amount:</strong><br/>
                          </div>
                        </div>
                        {RenderSupportedDonations()}
                      </h4>
                    </div>
                  </div>
                  <div className="column">
                    <div className="box">
                      <div className="container">
                        <h2 className="title is-4">Recent Pledges:</h2>
                      </div>
                      <h4 className="subtitle is-6 my-5">
                        <div className="columns">
                          <div className="column">
                            <strong>Project Name:</strong>
                          </div>
                          <div className="column">
                            <strong>Pledge Amount:</strong>
                          </div>
                          <div className="column">
                            <strong>Pledge Description:</strong>
                          </div>
                          <div className="column">
                            <strong>Project Status:</strong><br/>
                          </div>
                        </div>
                        {RenderSupportedPledges()}
                      </h4>
                    </div>
                  </div>
                </div>
                

              </div>
            </div>
          </div>
        </div>
  </main>
  )

  return supporterStuff;
}

function RenderSupportedPledges() {
  let pledges = Jason.Pledges;
  let result = [];
  pledges.forEach(pledge => {
    var status;
      if(parseInt(pledge.ProjectIsActive, 10) === 3){
        status = "Failed";
      } else if (parseInt(pledge.ProjectIsActive, 10) === 0) {
        status = "Inactive";
      } else if (parseInt(pledge.ProjectIsActive, 10) === 1){
        status = "Active";
      } else if (parseInt(pledge.ProjectIsActive, 10) === 2){
        status = "Succesful";
      }
      result.push(
        <h4 className="subtitle is-5 my-5">
            <div className="columns">
              <div className="column">
                {pledge.ProjectName}
              </div>
              <div className="column">
                ${pledge.Amount}
              </div>
              <div className="column">
                {pledge.Description.substring(0, 10)}
              </div>
              <div className="column">
                {status}<br/>
              </div>
            </div>
        </h4>
      )
  });
return result;
}

function RenderSupportedDonations() {
  let donations = Jason.Donations;
  let result = [];
  donations.forEach(donation => {
      result.push(
        <h4 className="subtitle is-5 my-5">
          <div className="columns">
            <div className="column">
              {donation.ProjectName}
            </div>
            <div className="column">
              ${donation.Amount}<br/>
            </div>
          </div>
        </h4>
      )
  });
return result;
}

function PledgeView() {
    let pledgeStuff =  (
      <main className="hero has-background-info-light is-fullheight is-justify-content-start">
        <div>
          <button className="button is-normal mx-5 my-3" onClick = {(e) => backProj()}>&lt; Back</button>
        </div>
        <div className="is-flex is-justify-content-center">
        <div className="is-flex is-flex-direction-column is-justify-content-space-between is-flex-wrap-nowrap">
          <div className="is-flex is-justify-content-space-between is-align-items-center my-5 mx-5">
            <div className="box"> 
              <h1 className="title is-2 is-spaced">Pledge: ${Jason.Amount}</h1>
              <h4 className="subtitle is-5"><strong>Description:</strong> {Jason.Description}</h4>
            </div>
          </div>
          <div className="is-flex is-justify-content-space-between is-align-items-center mx-5">
          <div className="box">
            <h3 className="title is-3">Funds: {Jason.CurrentSupporterBudget}</h3>
            <button className="button is-large is-success mx-5" onClick = {(e) => ClaimPledge()}>Claim This Pledge</button>
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
            console.log(Jason);
            if (Jason.error != null){
              alert("Error claiming pledge")
            } else {
              root.render(<React.StrictMode>
                <PledgeView />
              </React.StrictMode>);
              alert("Pledge Claimed");
            }
    
          })
        });
}

