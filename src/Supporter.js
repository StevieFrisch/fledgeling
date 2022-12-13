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

let search= React.createRef();
let finalgenre = "";

//Supporter Dashboard Renderer
function SupDash () {
  let designerStuff =  (
    <main style = {layout.Appmain}>
    <label style = {layout.proj}>Projects</label>
    <label style = {layout.genreLabel}>Genres</label>
    <button style = {layout.c1} type="button" name="genre" value="Game" id="c1" onClick = {(e) => searchProjectsGenre("Game")}>Game</button>
    <button style = {layout.c2} type="button" name="genre" value="Food" id="c2" onClick = {(e) => searchProjectsGenre("Food")}>Food</button> 
    <button style = {layout.c3} type="button" name="gnere" value="Movie" id="c3" onClick = {(e) => searchProjectsGenre("Movie")}> Movie</button>
    <button className = "genreButton" onClick = {(e) => searchProjectsGenre("Reset")}>Reset</button>
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
        <input style = {layout.addfundstextBox} type="AddFundsAmount" id="AddFundsAmount" name="AddFundsAmount" ref={AddFundsAmount}></input>
        <button type="button" className="addFunds" onClick = {(e) => addFunds()}>Add Funds</button>
        <button type="button" className="signOut" onClick = {(e) => login()}>Sign Out</button>
        <input style = {layout.addfundtextBox} type="search" id="search" name="search" ref={search}></input>
        <button type="button" style = {layout.search} onClick = {(e) => searchProjects()}>Search</button>
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

let directSupportAmmount= React.createRef();

function ProjectView() {
  let projectStuff =  (
    <main style = {layout.Appmain}>
    <label style = {layout.proj}>Project: {Jason.Name}</label>
    <label style = {layout.raised}>${Jason.Amount} / ${Jason.Goal}</label>
    <label style = {layout.goal} htmlFor="Goal">Direct Support:</label>
    <input style = {layout.supporttextBox} type="text" id="directSupport" name="directSupport" ref={directSupportAmmount}></input>
    <button type="button" className="directSupport" onClick = {(e) => directSupport()}>Submit</button>
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
    <button type="button" className="back" onClick = {(e) => back()}>Back</button>
    </main>)

    return projectStuff;
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


let AddFundsAmount= React.createRef();
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
    result.push(
      <tr>
        <td><button onClick = {(e) => viewPledge(pledge)}>${pledge.Amount}</button></td>
        <td>{pledge.Description}</td>
        <td>{pledge.MaxSupporters}</td>
      </tr>
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



function PledgeView() {
    let pledgeStuff =  (
      <main style = {layout.Appmain}>
      <label style = {layout.proj}>Pledge: ${Jason.Amount}</label>
      <label style = {layout.description}>Description: {Jason.Description}</label>
      <label style = {layout.funds}>Funds: {Jason.CurrentSupporterBudget}</label>
      <button className = "claim" onClick = {(e) => ClaimPledge()}>Claim</button>
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
              <PledgeView />
            </React.StrictMode>);
            alert("Pledge Claimed");
    
          })
        });
}

