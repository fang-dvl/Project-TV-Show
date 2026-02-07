//You can edit ALL of the code here
import { getAllEpisodes } from "./episodes.js";
function setup() {
  const allEpisodes = getAllEpisodes();
  console.log(allEpisodes);
  makePageForEpisodes(allEpisodes);

  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter(episode => 
      episode.name.toLowerCase().includes(searchText) ||
      episode.summary.toLowerCase().includes(searchText));

    makePageForEpisodes(filteredEpisodes);
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
