var dataPoints = [];

fetch("https://data.princegeorgescountymd.gov/resource/sk5x-gxv7.json")
  .then((response) => response.json())
  .then((data) => {
    localStorage.setItem("agency", JSON.stringify(agency));
    var groupedData = data.reduce((result, currentValue) => {
      (result[currentValue.agency] = result[currentValue.agency] || []).push(
        currentValue
      );
      return result;
    }, {});

    var agencyAmount = [];
    for (var agency in groupedData) {
      var total = 0;
      groupedData[agency].forEach((item) => (total += parseFloat(item.amount)));
      agencyAmount.push({ agency: agency, amount: total });
    }

    agencyAmount.sort((a, b) => a.amount - b.amount);

    for (var i = 0; i < agencyAmount.length; i++) {
      dataPoints.push({
        label: agencyAmount[i].agency,
        y: agencyAmount[i].amount,
      });
    }

    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Agency and Amount",
      },
      axisY: {
        title: "Amount (USD)",
      },
      data: [
        {
          type: "bar",
          dataPoints: dataPoints,
        },
      ],
    });
    chart.render();
  })
  .catch((error) => {
    console.log(error);
  });

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#agency");
  target.innerHTML = "";

  list.forEach((item) => {
    const str = "<li>${item.name}</li>";
    target.innerHTML += str;
  });
}

function agencyList(list) {
  console.log("fired cutList");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function markerPlace(array, map) {
  console.log("array for markers", array);

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    console.log("markerPlace", item);
    const { coordinates } = item.geocoded_column_1;
    L.marker([coordinates[1], coordinates[0]]).addTo(map);
  });
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const mainForm = document.querySelector(".main_form");
  const loadDataButton = document.querySelector("#data_load");
  const clearDataButton = document.querySelector("#data_clear");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#resto");

  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  let storedList = [];
  let currentList = [];

  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something

    console.log("loading data");
    loadAnimation.style.display = "inline-block";

    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/sk5x-gxv7.json"
    );

    const storedList = await results.json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    if (storedList > 0) {
      generateListButton.classList.remove("hidden");
    }
    loadAnimation.style.display = "none";
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = agencyList(storedList);
    console.log(currentList);
    injectHTML(currentList);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newlist);
  });

  clearDataButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear;
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
