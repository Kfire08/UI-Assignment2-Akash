let oldcard = document.getElementById("card");
let page = 1;
function searchCall() {
  document.getElementById("cardcontainer").innerHTML = "";
  searchNews();
}
// countdown 30 second reload
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

function search() {
  query = document.getElementById("searcharticle").value;
  if (query != "") window.location.href = `?query=${query}`;
  else document.getElementById("searchbtn").disabled = true;
}
//SEARCH FUNCTION STARTS HERE
let filter = "value";
let filterIndex = document.URL.indexOf("=");
if (filterIndex > -1) {
  filter = document.URL.substring(filterIndex + 1);
}

if (filter != "value") {
  document.getElementById("searcharticle").value = filter;
  searchCall();
  startTimer();
}
function searchNews() {
  fetch(`https://saurav.tech/NewsAPI/top-headlines/category/${filter}/in.json`)
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

      page = page + 1;
    })
    .catch((error) => console.log("article not found"));
}
// SEARCH FUNCTION ENDS HERE

//Lazy load
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
// Trigger fetch by Enter key press (Enter key ID = 13)