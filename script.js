let oldcard = document.getElementById("card");
let page = 1;

function searchCall() {
  document.getElementById("cardcontainer").innerHTML = "";
  searchNews();
}

// REFRESH FUNCTIONALITY
var timer;
function resetTimer() {
  clearInterval(timer);
  startTimer();
}

function startTimer() {
  var seconds = 30;
  timer = setInterval(function () {
    document.getElementById("seconds").textContent = seconds;
    seconds--;
    if (seconds == -1) {
      document.getElementById(
        "timertext"
      ).innerHTML = `<button id="refreshbtn" type="button" onclick="location.href=''">Refresh News</button>`;
      clearInterval(timer);
      seconds = 30;
    }
  }, 1000);
}

// CALLING FUNCTION
function search() {
  query = document.getElementById("searcharticle").value.toLowerCase();
  window.location.href = `?query=${query}`;
}

document.getElementById("searcharticle").onkeydown = (e) => {
  if (e.key === "Enter") {
    document.getElementById("searchbtn").click();
  }
};

//SEARCH FUNCTIONALITY STARTS HERE
let filter;

const urlParams = new URLSearchParams(window.location.search);
filter = urlParams.get("query");

if (filter == null || filter == "") filter = "value";

if (filter != "value") {
  document.getElementById("searcharticle").value = filter;
  searchCall();
}
function searchNews() {
  fetch(`https://inshorts.deta.dev/news?category=${filter}`)
    .then((res) => res.json())
    .then((data) => {
      for (var i = 1; i < 11; i++) {
        let newcard = oldcard.cloneNode(true);

        newcard.childNodes[1].childNodes[1].src =
          data.articles[i * page].urlToImage;

        newcard.childNodes[3].childNodes[1].innerText =
          data.articles[i * page].title;

        newcard.childNodes[3].childNodes[3].innerText =
          data.articles[i * page].description;

        newcard.childNodes[3].childNodes[5].childNodes[1].href =
          data.articles[i * page].url;

        document.getElementById("cardcontainer").appendChild(newcard);
      }
      if (page == 1) startTimer();
      page = page + 1;
    })
    .catch((error) => {
      if (document.getElementById("cardcontainer").innerHTML == "") {
        document.getElementById(
          "cardcontainer"
        ).innerHTML = `<span id="noResultText">No Result Found</span>`;
        clearInterval(timer);
      }
    });
}
// SEARCH FUNCTIONALITY ENDS HERE

// LAZY LOADING FUNCTIONALITY
var mq = window.matchMedia("(max-width: 820px) and (min-width: 480px)");
let lazycontainer = document.getElementById("cardcontainer");
let percent = 0;
lazycontainer.addEventListener("scroll", () => {
  if (mq.matches) {
    percent = 0.3;
  } else {
    percent = 0.7;
  }
  if (lazycontainer.scrollTop > percent * lazycontainer.scrollHeight)
    searchNews();
});
