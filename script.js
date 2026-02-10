//You can edit ALL of the code here
import { getAllEpisodes } from "./episodes.js";
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);

  const filter = document.getElementById('filter');
  const epNum = document.createElement('p');
  epNum.classList.add('episode-number');
  epNum.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
  filter.append(epNum);

  select(allEpisodes, epNum);

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
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = '';
  for (let i = 0; i <episodeList.length; i++)
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

window.onload = setup;
