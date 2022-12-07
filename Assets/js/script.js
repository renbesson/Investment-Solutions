/////////// Defines the HTML elements /////////
var toggleEl = document.getElementById("cryptoStockToggle");
var dropDownEl = document.getElementById("dropDownCategory");
var contentEl = document.getElementById("content");
var mainModal = document.getElementById("main-modal");
var modalTitle = document.getElementById("modal-title");
var modalText = document.getElementById("modal-text");
var modalSave = document.getElementById("modal-check");

function showStockResults(resultObj) {
  clearDropDown();
  resultObj.forEach((element) => {
    var result = document.createElement("option");
    result.innerHTML = element.description;
    result.setAttribute("value", element.code);

    dropDownEl.appendChild(result);
  });
}

function showCryptoResults(resultObj) {
  clearDropDown();
  for (var i = 0; i < resultObj.length; i++) {
    var result = document.createElement("option");
    result.innerHTML = resultObj[i].name;
    result.setAttribute("value", resultObj[i].category_id);

    dropDownEl.appendChild(result);
  }
}

function clearContent() {
  contentEl.innerHTML = "";
}

function clearDropDown() {
  dropDownEl.innerHTML = `<option disabled selected>
      Please select an option...
    </option>`;
}

function updateModal(title, text) {
  modalTitle.innerHTML = title ? title : "";
  modalText.innerHTML = text ? text : "";
  mainModal.checked = true;
}

var printCryptoCards = (data) => {
  clearContent();
  data.slice(0, 20).forEach((element) => {
    var card = document.createElement("div");
    card.innerHTML = `
      <div class="card w-64 bg-white shadow-xl m-5">
        <figure class="m-3">
          <img src="${element.image}" alt="Shoes" />
        </figure>
        <div class="card-body">
          <p>${element.name}</p>
          <div class="card-actions justify-end">  
            <label for="main-modal" class="btn btn-primary w-full" id=${element.id}>See More</label>
          </div>
        </div>
      </div>
  `;
    contentEl.append(card);
  });
};

var printStockCards = (data) => {
  clearContent();
  data.slice(0, 20).forEach((element) => {
    var card = document.createElement("div");
    card.innerHTML = `
    <div class="card w-64 bg-white shadow-xl m-5">
      <div class="card-body">
        <h3 class="card-title">${element.name}</h3>
        <p>Ticker: ${element.ticker}</p>
        <div class="card-actions justify-end">  
          <label for="main-modal" class="btn btn-primary w-full" id=${element.ticker}>See More</label>
        </div>
      </div>
    </div>`;
    contentEl.append(card);
  });
};

function getStockNews(ticker) {
  var getNewsApi = `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=UAmJhIVKMGMQmJfv7Tja6hKiWkViJV6z`;

  fetch(getNewsApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if (data.results.length > 0) {
            updateModal(
              `<a href=${data.results[0].article_url} target= "_blank">${data.results[0].title}<a/>`,
              data.results[0].description
            );
            saveInfo(data);
          } else {
            updateModal("No News Found", "No news found for this specific ticker");
          }
        });
      } else {
        updateModal("Error fetching news", `Code: ${response.status}`);
      }
    })
    .catch(function () {
      updateModal("Unable To Fetch API");
    });
}

function getCryptoInfo(ticker) {
  var getCryptoInfo = `https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

  fetch(getCryptoInfo)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var dataArr = Object.keys(data)[0];
          updateModal(
            `<p> Name: ${ticker} <br> Price: ${data[dataArr].usd} <br> Market Cap: ${data[dataArr].usd_market_cap} <br> 24h Change: ${data[dataArr].usd_24h_change} <br> 24h Volume: ${data[dataArr].usd_24h_vol} </p>`
          );
        });
      } else {
        updateModal("Error Fetching News", `Code: ${response.status}`);
      }
    })
    .catch(function () {
      updateModal("Unable to connect to GitHub");
    });
}

function getCryptoApi(value) {
  var coinGeckoApi = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${value}&order=market_cap_desc&per_page=10&page=1&sparkline=false`;

  fetch(coinGeckoApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          printCryptoCards(data);
        });
      } else {
      }
    })
    .catch(function () {
      updateModal("Unable to connect to GitHub");
    });
}

///////// Query "value" from stock API /////////
function getStockApi(ticker) {
  coinPolygonReference = `https://api.polygon.io/v3/reference/tickers?type=${ticker}&market=stocks&active=true&apiKey=UAmJhIVKMGMQmJfv7Tja6hKiWkViJV6z`;

  fetch(coinPolygonReference)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          printStockCards(data.results);
        });
      } else {
        updateModal("Error Fetching News", `Code: ${response.status}`);
      }
    })
    .catch(function () {
      updateModal("Unable to connect to GitHub");
    });
}

function getCryptoCategories() {
  var coinGeckoApi = "https://api.coingecko.com/api/v3/coins/categories/list";

  fetch(coinGeckoApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          showCryptoResults(data);
        });
      } else {
        updateModal("Error Fetching News", `Code: ${response.status}`);
      }
    })
    .catch(function () {
      updateModal("Unable to connect to GitHub");
    });
}

///////// Query "value" from stock API /////////
function getStockCategories() {
  polygonReference = `https://api.polygon.io/v3/reference/tickers/types?asset_class=stocks&locale=us&apiKey=UAmJhIVKMGMQmJfv7Tja6hKiWkViJV6z`;

  fetch(polygonReference)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          showStockResults(data.results);
        });
      } else {
        updateModal("Error Fetching News", `Code: ${response.status}`);
      }
    })
    .catch(function () {
      updateModal("Unable to connect to GitHub");
    });
}

///////// Add the Search button event listener /////////
dropDownEl.addEventListener("change", () => {
  if (!toggleEl.checked) getCryptoApi(dropDownEl.value);
  if (toggleEl.checked) getStockApi(dropDownEl.value);
});

toggleEl.addEventListener("change", (event) => {
  isChecked = event.target.checked;

  clearContent();

  if (!isChecked) getCryptoCategories();
  else getStockCategories();
});

/* function makeOptions(data) {
  //needs STYLING AND CHANGE TO OTHER INPUT FEILD
  var makeOption = [];
  if (toggleEl.checked) {
    for (var i = 0; i < data.results.length; i++) {
      makeOption = makeOption.concat(data.results[i].ticker);
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      makeOption = makeOption.concat(data[i].name);
    }
    $(function () {
      $("#searchInput").autocomplete({
        source: makeOption,
      });
    });
  }
}
 */
/* function makeCatagories(cataData){
 for (var i = 0; i < resultObj.results.length; i++) {
    var result = document.createElement("div");
    result.innerHTML = resultObj.results[i].ticker;

    .appendChild(result);
  }
 } */

document.querySelector("#resetBtn").addEventListener("click", () => {
  window.location.reload(true);
});

contentEl.addEventListener("click", (event) => {
  if (toggleEl.checked) getStockNews(event.target.id);
  if (!toggleEl.checked) getCryptoInfo(event.target.id);
});

function saveInfo(data) {
  console.log(data);
  newItem = data.results[0].ticker;
  localStorage.setItem(newItem, JSON.stringify(data));
}

////////// Starts the application by loading crypto categories //////////
getCryptoCategories();
