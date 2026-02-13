//You can edit ALL of the code here
const rootElem = document.getElementById("root");
function showLoading() {
  rootElem.innerHTML = "<p>Loading episodes, please wait...</p>";
}
showLoading()

function showError(message) {
  rootElem.innerHTML = `<p style="color:red;">Error: ${message}</p>`;
}

fetch("https://api.tvmaze.com/shows/82/episodes").then(response=>{
  if (!response.ok) {throw new Error("Network response was not OK");}
  return response.json()}).then((allEpisodes)=>{
  rootElem.innerHTML = "";
  setup(allEpisodes)
}).catch(error => {
    showError(error.message);})

function setup(allEpisodes) {
  makePageForEpisodes(allEpisodes);
  const filter = document.getElementById('filter');
  const epNum = document.createElement('p');
  epNum.classList.add('episode-number');
  epNum.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
  filter.append(epNum);
  
  search(allEpisodes, epNum);
  select(allEpisodes, epNum);
  //select(allEpisodes, epNum);
  
}


// search episode
function search(allEpisodes, epNum) {
  const showButton = filter.querySelector('button')
  if(showButton !== null) showButton.remove();
  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(episode => 
      episode.name.toLowerCase().includes(searchText) ||
      episode.summary.toLowerCase().includes(searchText));

    makePageForEpisodes(filteredEpisodes);
    const filter = document.getElementById('filter');
    epNum.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length}`;
    filter.append(epNum);
  })
}

 


// select episodes
function select(allEpisodes, epNum) {
  const selectEpisode = document.getElementById('select-episode');
  for(let episode of allEpisodes) {
    const option = document.createElement('option');
    const season=String(episode.season).padStart(2, '0');
    const number=String(episode.number).padStart(2, '0');
    const name=episode.name;
    option.value = name;
    option.textContent = `S${season}E${number} - ${name}`
    selectEpisode.append(option);
  }

  selectEpisode.addEventListener('change', (event) => {
      const showButton = filter.querySelector('button')
      if(showButton !== null) showButton.remove();

      const select = event.target.value;
      const selectedEpisode = allEpisodes.filter(episode => 
         episode.name === select
      );
      makePageForEpisodes(selectedEpisode);
      epNum.innerHTML = "";
      showAll(allEpisodes, epNum);
    })
}


// show all episodes
function showAll(allEpisodes, epNum) {
    const showButton = document.createElement('button');
    showButton.classList.add('showButton');
    showButton.textContent = 'Show All Episodes';
    filter.append(showButton);

    showButton.addEventListener('click', () => {
      showButton.remove();
      makePageForEpisodes(allEpisodes)
      epNum.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
      const filter = document.getElementById('filter');
      filter.append(epNum);
    })
}

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = '';
  for (let i = 0; i < episodeList.length; i++)
     {const episodeContainer = document.createElement('section');
      episodeContainer.classList.add('episode'); 
      const title=document.createElement('h3');
      const name=episodeList[i].name;
      const season=String(episodeList[i].season).padStart(2, '0');
      const number=String(episodeList[i].number).padStart(2, '0');
      title.textContent=`${name}-S${season}E${number}`;
      title.classList.add('title'); 
      const image=document.createElement('img');
      image.src=episodeList[i].image.medium
      const summary=document.createElement('p');
      summary.innerHTML = episodeList[i].summary || '';
      summary.classList.add('summary'); 
      episodeContainer.append(title,image,summary);

      rootElem.append(episodeContainer);

     }
}

