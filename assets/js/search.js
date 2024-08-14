var seachOpnBtn = null;
var closeBtn = null;
var searchCntr = null;
var resultCntr = null;
var searchBtn = null;
var searchTxt = null;
var isSearchOpen = false;
var isJsonIndexed = false;
var fuse;

function fetchJSON(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
}

function buildIndex() {
  var baseURL = searchCntr.getAttribute("data-url");
  baseURL = baseURL.replace(/\/?$/, '/');
  fetchJSON(baseURL + "index.json", function (data) {
    var options = {
      shouldSort: true,
      ignoreLocation: true,
      threshold: 0.0,
      includeMatches: true,
      keys: [
        { name: "title", weight: 0.8 },
        { name: "section", weight: 0.2 },
        { name: "summary", weight: 0.6 },
        { name: "content", weight: 0.4 },
      ],
    };
    fuse = new Fuse(data, options);
    isJsonIndexed = true;
  });
}

function openSearch() {
  if (!isJsonIndexed) {
    buildIndex();
  }
  if (!isSearchOpen) {
    searchCntr.style.display = "flex";
    document.body.style.overflow = "hidden";
    isSearchOpen = true;
    searchTxt.focus();
  }
}

function closeSearch() {
  if (isSearchOpen) {
    searchCntr.style.display = "none";
    document.body.style.overflow = "";
    isSearchOpen = false;
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  seachOpnBtn = document.getElementById("search-open");
  searchBtn = document.getElementById("search-btn");
  closeBtn = document.getElementById("search-close");
  searchCntr = document.getElementById("search-container");
  resultCntr = document.getElementById("search-results");
  searchTxt = document.getElementById("search-query");

  seachOpnBtn.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);
});

document.addEventListener("keydown", function (event) {
  // Forward slash to open search
  if (event.key == "/") {
    event.preventDefault();
    openSearch();
  }
  // Esc to close search
  if (event.key == "Escape") {
    event.preventDefault();
    closeSearch();
  }
});
