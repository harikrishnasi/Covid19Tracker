//DOM MANIPULATION
const countryNameElement = document.querySelector('.country .name');
const totalCasesElement = document.querySelector('.total-cases .total-value');
const newCasesElement = document.querySelector('.total-cases .new-value');
const totalRecoveredElement = document.querySelector('.recovered-cases .total-value');
const newRecoveredCasesElement = document.querySelector('.recovered-cases .new-value');
const totalDeathsElement = document.querySelector('.deaths .total-value');
const newDeathsElement = document.querySelector('.deaths .new-value');
const ctx = document.getElementById("axes_line_chart").getContext("2d");

//VARIABLES
let appData= [], 
    casesList= [],
    casesListTwenty= [],
    recoveredList = [],
    recoveredListTwenty = [],
    deathsList = [],
    deathsListTwenty = [],
    deaths = [];
    datesLoop = [];
    dates= [];
    formattingDates=[];
    formatedDates = [];

// GETS USER GEO CODE
let userCountryCode = geoplugin_countryCode();
let userCountry;

country_list.forEach(country =>{
    if(userCountryCode == country.code){
        userCountry = country.name;
    }
})



function fetchData(country){
  (casesList =[]) , (recoveredList =[]) , (deathsList = []), (dates=[]), (formatedDates=[]), (datesLoop=[]);
    userCountry = country;
    countryNameElement.innerHTML = "<h1>Loading..</h1>";
    const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const api_fetch = async (country) => {
        await fetch(
          "https://api.covid19api.com/total/country/" +
            country +
            "/status/confirmed",
          requestOptions
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            data.forEach((entry)=>{
              datesLoop.push(entry.Date);
              dates = datesLoop.slice(Math.max(datesLoop.length - 30, 0));
            })
            data.forEach((entry) => {
              casesList.push(entry.Cases);
              casesListTwenty = casesList.slice(Math.max(casesList.length - 30, 0))
            });
          });
    
        await fetch(
          "https://api.covid19api.com/total/country/" +
            country +
            "/status/recovered",
          requestOptions
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            data.forEach((entry) => {
              recoveredList.push(entry.Cases);
              recoveredListTwenty = recoveredList.slice(Math.max(recoveredList.length - 30, 0));
            });
          });
    
        await fetch(
          "https://api.covid19api.com/total/country/" + country + "/status/deaths",
          requestOptions
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            data.forEach((entry) => {
              deathsList.push(entry.Cases);
              deathsListTwenty =deathsList.slice(Math.max(deathsList.length - 30, 0))
            });
          });
          
        updateUI();
      };
    
      api_fetch(country);
    }
fetchData(userCountry);

//UPDATE UI
function updateUI() {
  updateStats();
  axesLinearChart();
}
//updateStatus
function updateStats(){
  countryNameElement.innerHTML = `<h1>${userCountry.toUpperCase()}</h1>`;

  let lastConfirmedCases = casesList[casesList.length-1];
  totalCasesElement.innerHTML = lastConfirmedCases;

  let newConfirmedCases = casesList[casesList.length-1] - casesList[casesList.length-2];
  newCasesElement.innerHTML = `+ ${newConfirmedCases}` || 0;

  let lastRecoveredCases = recoveredList[recoveredList.length-1]
  totalRecoveredElement.innerHTML = lastRecoveredCases;

  let newRecoveredCases = recoveredList[recoveredList.length-1] - recoveredList[recoveredList.length-2];
  newRecoveredCasesElement.innerHTML = `+ ${newRecoveredCases}` || 0;

  let lastDeaths = deathsList[deathsList.length-1]
  totalDeathsElement.innerHTML = lastDeaths;

  let newDeaths = deathsList[deathsList.length-1] - deathsList[deathsList.length-2]
  newDeathsElement.innerHTML = `+ ${newDeaths}` || 0;
}


// UPDATE CHART
let myChart;
function axesLinearChart() {
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: casesListTwenty,
          fill: false,
          borderColor: " blueviolet",
          backgroundColor: " blueviolet",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recoveredListTwenty,
          fill: false,
          borderColor: "#009688",
          backgroundColor: "#009688",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deathsListTwenty,
          fill: false,
          borderColor: "#f44336",
          backgroundColor: "#f44336",
          borderWidth: 1,
        },
      ],
      labels: dates,
      
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}