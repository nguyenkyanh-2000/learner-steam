let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
const ulGamesList = document.getElementById("ul-games-list");
const searchQuery = document.getElementById("search-query");
const actionsBtn = document.getElementById("actions-btn");

const ulTopicsList = document.getElementById("ul-topics-list");
const Topiclist = document.getElementById("topiclist");
const toipcsBtn = document.getElementById("topics-btn");

let page = 1;
let limit = 6;
const element = document.querySelector(".pagination ul");
let totalPages = 20;

let genre = "";

closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  menuBtnChange();
});

function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  }
}

async function getGamesList(query) {
  let url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/games?limit=6&page=${page}`;
  if (genre) url += `&genres=${genre}`;
  if (query) url += `&q=${query}`;
  const response = await fetch(url);
  let result = await response.json();
  return result;
}

async function getSingleGame(appId) {
  const res = await fetch(
    `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/single-game/${appId}`
  );
  const result = await res.json();
  return result.data;
}

async function renderSingleGame(appId) {
  const game = await getSingleGame(appId);
  ulGamesList.innerHTML = `
  <div class="showing_game show_detail">
    <div class="title_contain ">
    <div class="title"><b>${game.name}</b></div>
    <div class="price">${game.price}</div>
    </div>
    <div class="img_detail">
    <img src="${game.header_image}" alt="${game.name}">
    <div class="game_details">
    <div class="game_description">English :${game.english} Platforms : ${game.platforms} Categories : ${game.categories} Age appropriate : ${game.required_age} Achievements : ${game.achievements} Positive ratings : ${game.positive_ratings}</div>
    <div class="game_informations">
    <p>RECENT REVIEWS: Mostly Positive</p>
    <p>RELEASE DATE:  ${game.release_date}</p>
    <p>DEVELOPER:  <a href="">${game.developer}</a></p>
    <p>PUBLISHER:  <a href="">${game.developer}</a></p>
    </div>
    </div>
    </div>
    <div class="tags_contain">
    Popular user-defined tags for this product:
    <div class="tags">
      <div class="tag"><a href="">${game.steamspy_tags}</a></div>
      <div class="tag"><a href="">${game.genres}</a></div>
    </div>
    </div>
    </div>
    </div>`;
  const pagination = document.querySelector(".pagination");
  pagination.style.display = "none";
}

// async function renderSingleGame(appId) {
//   const game = await getSingleGame(appId);
//   ulGamesList.innerHTML = `
//   <div class="game">
//             <img src="${game.header_image}" alt="Game 1">
//             <h3>${game.name}</h3>
//             <h3>${game.positive_ratings}</h3>
//             <h3>${game.steamspy_tags}</h3>
//         </div>`;
// }

async function renderGamesList(genre, query) {
  const gamesList = await getGamesList(genre, query);
  const data = gamesList.data;
  const totalGame = gamesList.total;
  ulGamesList.innerHTML = "";
  data.forEach((game, index) => {
    const gameLi = document.createElement("li");
    gameLi.innerHTML = `
    <div class="game">
              <img src="${game.header_image}" alt="Game 1">
              <h3>${game.name}</h3>
          </div>`;
    gameLi.addEventListener("click", () => renderSingleGame(game.appid));
    ulGamesList.appendChild(gameLi);
  });
  listPage(totalGame);
}

searchQuery.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    renderGamesList("", searchQuery.value);
  }
});

renderGamesList();
// actionsBtn.addEventListener("click", () => {
//   renderGamesList("rpg");
// });
// renderGamesList("rpg");

async function getTopicsList() {
  const responseAPI = await fetch(
    `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres`
  );
  const { data } = await responseAPI.json();
  Topiclist.innerHTML = "";
  // console.log("list :>> ", list);
  data.forEach((gameGenre) => {
    // console.log('data :>> ', data);
    const topicLi = document.createElement("li");
    const toipcsBtn = document.createElement("button");
    // toipcsBtn.addEventListener("click", () => {
    //   renderGamesList(genre.name);
    // });
    toipcsBtn.onclick = () => {
      genre = gameGenre.name;
      renderGamesList();
    };
    toipcsBtn.innerHTML = `
    <a href="#">
      
        <span class="links_name">${gameGenre.name}</span>
        </a>
        <span class="tooltip">${gameGenre.name}</span>`;
    topicLi.appendChild(toipcsBtn);
    Topiclist.appendChild(topicLi);
  });
}

toipcsBtn.addEventListener("click", () => {
  getTopicsList();
});

// -------------------------------------------------------
// selecting required element

//calling function with passing parameters and adding inside element which is ul tag
element.innerHTML = createPagination(totalPages, page);
function createPagination(totalPages, thisPage) {
  page = thisPage;
  let liTag = "";
  let active;
  let beforePage = thisPage - 1;
  let afterPage = thisPage + 1;
  if (thisPage > 1) {
    //show the next button if the page value is greater than 1
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${
      thisPage - 1
    })"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
  }

  if (thisPage > 2) {
    //if page value is less than 2 then add 1 after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
    if (thisPage > 3) {
      //if page value is greater than 3 then add this (...) after the first li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  // how many pages or li show before the current li
  if (thisPage == totalPages) {
    beforePage = beforePage - 2;
  } else if (thisPage == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  // how many pages or li show after the current li
  if (thisPage == 1) {
    afterPage = afterPage + 2;
  } else if (thisPage == 2) {
    afterPage = afterPage + 1;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      //if plength is greater than totalPage length then continue
      continue;
    }
    if (plength == 0) {
      //if plength is 0 than add +1 in plength value
      plength = plength + 1;
    }
    if (thisPage == plength) {
      //if page is equal to plength than assign active string in the active variable
      active = "active";
    } else {
      //else leave empty to the active variable
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
  }

  if (thisPage < totalPages - 1) {
    //if page value is less than totalPage value by -1 then show the last li or page
    if (thisPage < totalPages - 2) {
      //if page value is less than totalPage value by -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
  }

  if (thisPage < totalPages) {
    //show the next button if the page value is less than totalPage(20)
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${
      thisPage + 1
    })"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
  element.innerHTML = liTag; //add li tag inside ul tag
  element.onclick = function (event) {
    let target = event.target;
    page = target.textContent;
    renderGamesList();
  };
  return liTag; //reurn the li tag
}
