
const rootElem = document.getElementById("root");
const filterShows = document.querySelector(".searchShow");
const showPage = document.querySelector(".showPage");
const showNum = document.createElement("p");
showNum.classList.add("searchShow");
filterShows.append(showNum);
const selectEpisode = document.getElementById("select-episode");
const episodeBar = document.querySelector("#episodeBar");

//fetch data from url
const getData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch failed:", error);
  }
};

//make a show list front page
let allShows = [];
function setup() {
  getData("https://api.tvmaze.com/shows").then((showList) => {
    makePageForShows(showList);
    searchShowList(showList);
    selectShowList(showList);
    allShows = showList;
  });
}

function createShowElements() {
  const searchShow=document.createElement("div");
  searchShow.classList.add("searchShow");
  searchShow.innerHTML=` 
       <label for="searchAShow">Filtering for</label>
       <input type="text" id="searchAShow">
     
      <select name="selectAShow" id="selectAShow">
        <option value="Select">Select a show...</option>
      </select>
      <p id="showNum">Found ${allShows.length} shows</p>`;
  const showContainer = document.createElement("div");
  showContainer.classList.add("showContainer");
  showPage.append(searchShow,showContainer);
}

//create show cards for show list page
function makePageForShows(showList) {
  const showContainer = document.querySelector(".showContainer");
  showNum.innerHTML = `Found ${showList.length} shows`;
  showContainer.innerHTML = "";
  showList.forEach((show) => {
    // to create show card
    const showCard = document.createElement("div");
    showCard.classList.add("showCard");

    const showTitle = document.createElement("h1");
    showTitle.classList.add("showTitle");
    showTitle.innerHTML = `${show.name}`;

    const showRow = document.createElement("div");
    showRow.classList.add("showRow");

    const showImg = document.createElement("img");
    const showSum = document.createElement("p");
    const showInfo = document.createElement("p");
    showInfo.classList.add("showInfo");

    showImg.src = show.image.medium;
    showImg.alt = show.name;
    showSum.innerHTML = `${show.summary}`;
    showInfo.innerHTML = `
      <div class="infoItem">Rated: ${show.rating.average}</div>
      <div class="infoItem">Genre: ${show.genres.join(", ")}</div>
      <div class="infoItem">Status: ${show.status}</div>
      <div class="infoItem">Runtime: ${show.runtime}</div>
    `;
    showRow.append(showImg, showSum, showInfo);
    showCard.append(showTitle, showRow);
    showContainer.append(showCard);
  });
}

//make a search-show bar
function searchShowList(showList) {
  const searchInput = document.getElementById("searchAShow");
  searchInput.addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredShows = showList.filter(
      (show) =>
        show.name.toLowerCase().includes(searchText) ||
        show.summary.toLowerCase().includes(searchText),
    );

    makePageForShows(filteredShows);
  });
}

//make a select bar for shows
let showUrl = [];
const epNum = document.createElement("p");
episodeBar.append(epNum);

function selectShowList(showList) {
  const selectAShow = document.querySelector("#selectAShow");
  selectAShow.innerHTML = `<option value="" disabled selected>Select a show...</option>`;
  showList.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );
  showList.forEach((show) => {
    const option = document.createElement("option");
    option.textContent = show.name;
    option.value = show.id;
    selectAShow.append(option);
    const episodeUrl = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    showUrl.push(episodeUrl);
  });

  selectAShow.addEventListener("change", (event) => {
    showPage.innerHTML = "";
    episodeBar.innerHTML = ""; 
    const index = Number(event.target.value);
    getData(showUrl[index]).then((episodeList) => {
      makePageForEpisodes(episodeList);
      selectAnEpisode(episodeList);
      searchAnEpisode(episodeList);
      goBackToShowList();
    });});
}

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = "";
  for (let i = 0; i < episodeList.length; i++) {
    const episodeContainer = document.createElement("section");
    episodeContainer.classList.add("episode");
    const title = document.createElement("h3");
    const name = episodeList[i].name;
    const season = String(episodeList[i].season).padStart(2, "0");
    const number = String(episodeList[i].number).padStart(2, "0");
    title.textContent = `${name}-S${season}E${number}`;
    title.classList.add("title");
    const image = document.createElement("img");
    image.src = episodeList[i].image.medium;
    const summary = document.createElement("p");
    summary.innerHTML = episodeList[i].summary || "";
    summary.classList.add("summary");
    episodeContainer.append(title, image, summary);
    rootElem.append(episodeContainer);
  }
  epNum.innerHTML = `Displaying ${episodeList.length} episodes`;
}

// make a go back to the show page button
function goBackToShowList() {
  const oldBtn = document.querySelector(".backAllButton");
  if (oldBtn) {
    oldBtn.remove();
  }
  const backAllButton = document.createElement("button");
  backAllButton.classList.add("backAllButton");
  backAllButton.textContent = "Show List";
  episodeBar.append(backAllButton);

  backAllButton.addEventListener("click", () => {
    episodeBar.innerHTML="";
    rootElem.innerHTML="";
    createShowElements();
    setup();
    console.log("Go back to show list");
    searchAnEpisode(allShows);
    selectAnEpisode(allShows);
  });
}

//search episode
function searchAnEpisode(allEpisodes) {
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search";
  searchInput.placeholder = "Search episode";
  episodeBar.append(searchInput);
  searchInput.after(epNum);
  searchInput.addEventListener("input", (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchText) ||
        episode.summary.toLowerCase().includes(searchText),
    );
    makePageForEpisodes(filteredEpisodes);
    epNum.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length}`;
    showAll(allEpisodes);
    goBackToShowList();
  });
}

// select episodes
function selectAnEpisode(allEpisodes) {
  const selectEpisode = document.createElement("select");
  selectEpisode.id = "select-episode";
  const placeholder = document.createElement("option");
  placeholder.textContent = "Select an episode";
  placeholder.disabled = true;
  placeholder.selected = true;
  selectEpisode.append(placeholder);
  episodeBar.append(selectEpisode);
  selectEpisode.after(epNum);
  for (let episode of allEpisodes) {
    const option = document.createElement("option");
    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");
    const name = episode.name;
    option.value = name;
    option.textContent = `S${season}E${number} - ${name}`;
    selectEpisode.append(option);
  }

  selectEpisode.addEventListener("change", (event) => {
    const select = event.target.value;
    const selectedEpisode = allEpisodes.filter(
      (episode) => episode.name === select,
    );
    episodeBar.innerHTML = "";
    makePageForEpisodes(selectedEpisode);
    selectAnEpisode(allEpisodes);
    searchAnEpisode(allEpisodes);
    showAll(allEpisodes);
    goBackToShowList();
  });
}

// make a show all episodes button
function showAll(allEpisodes) {
  const oldBtn = document.querySelector(".showButton");
  if (oldBtn) oldBtn.remove();
  const showButton = document.createElement("button");
  showButton.classList.add("showButton");
  showButton.textContent = "Show All Episodes";
  episodeBar.append(showButton);

  showButton.addEventListener("click", () => {
    showButton.remove();
    makePageForEpisodes(allEpisodes);
    const selectEp = document.querySelector("#select-episode");
    selectEp.selectedIndex = 0;
    const searchInput = document.querySelector("#search");
    searchInput.value = "";
  });
}
window.onload = setup;