//You can edit ALL of the code here
import { getAllEpisodes } from "./episodes.js";


function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  const epNum = document.createElement('p');
  epNum.classList.add('episode-number');
  epNum.innerHTML = `Displaying ${allEpisodes.length}/${allEpisodes.length}`;
  filter.append(epNum);

  search(allEpisodes, epNum);
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
    epNum.innerHTML = `Displaying ${filteredEpisodes.length}/${allEpisodes.length}`;
    const filter = document.getElementById('filter');
    filter.append(epNum);
  })
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
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

window.onload = setup;
