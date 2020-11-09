let htmlDocuments = {
  loadAllShows: () => {
    return document.getElementById("loadTvShows");
  },
  submitTvShow: () => {
    return document.querySelector("body > form > button");
  },
  title: () => {
    return document.getElementById("title");
  },
  schedule: () => {
    return document.getElementById("schedule");
  },
  seasons: () => {
    return document.getElementById("seasons");
  },
};
const dataBaseURL = "https://asentest-6b013.firebaseio.com/tvShows/.json";
const errorDiv = document.getElementById("errorD");
let showTvShows = document.querySelector("body > table > tbody");

let editForm = {
  titleEdit: () => {
    return document.getElementById("editTitle");
  },
  scheduleEdit: () => {
    return document.getElementById("editSchedule");
  },
  seasonsEdit: () => {
    return document.getElementById("editSeasons");
  },
  editButton: () => {
    return document.querySelector("body > form:nth-child(5) > button");
  },
};

htmlDocuments.submitTvShow().addEventListener("click", submitNewShow);
htmlDocuments.loadAllShows().addEventListener("click", getAllShows);
document.addEventListener("click",deleteEditBook);
function getAllShows(e) {
  while (showTvShows.firstChild) {
    showTvShows.removeChild(showTvShows.firstChild);
  }
  while (errorDiv.firstChild) {
    errorDiv.removeChild(errorDiv.firstChild);
  }
  fetch(dataBaseURL)
    .then((b) => b.json())
    .then((b) => {
      Object.entries(b).map(([key, seasons]) => {
        let postTvShow = createElement("tr", "", { value: key }, [
          createElement("td", seasons.title),
          createElement("td", seasons.schedule),
          createElement("td", seasons.seasons),
          createElement("td", "", "", [
            createElement("button", "Edit"),
            createElement("button", "Delete"),
          ]),
        ]);
        showTvShows.appendChild(postTvShow);
      });
    })
    .catch((e) => {
      while (errorDiv.firstChild) {
        errorDiv.removeChild(errorDiv.firstChild);
      }
      let error = createElement("h1", "Empty list!");

      errorDiv.appendChild(error);
    });
}
function submitNewShow(e) {
  e.preventDefault();
  while (errorDiv.firstChild) {
    errorDiv.removeChild(errorDiv.firstChild);
  }

  if (htmlDocuments.title().value.length === 0) {
    let error = createElement("h1", "You need to have a title!");

    errorDiv.appendChild(error);
  }
  if (htmlDocuments.schedule().value.length === 0) {
    let error = createElement("h1", "You need to have an schedule!");

    errorDiv.appendChild(error);
  }
  if (htmlDocuments.seasons().value.length === 0) {
    let error = createElement("h1", "You need to have an seasons!");

    errorDiv.appendChild(error);
  } 
 
  else {
    
   

    let newShow = {
      title: htmlDocuments.title().value,
      schedule: htmlDocuments.schedule().value,
      seasons: htmlDocuments.seasons().value,
    };

    let newPost = fetch(dataBaseURL, {
      method: "POST",
      body: JSON.stringify(newShow),
    });
    let exist = fetch(dataBaseURL)
    .then((b) => b.json())
    .then((b) => {
      Object.entries(b).map(([key, show]) => {
        if (show.title === htmlDocuments.title().value) {
          let postTvShow = createElement("tr", "", { value: key }, [
            createElement("td", htmlDocuments.title().value),
            createElement("td", htmlDocuments.schedule().value),
            createElement("td", htmlDocuments.seasons().value),
            createElement("td", "", "", [
              createElement("button", "Edit"),
              createElement("button", "Delete"),
            ]),
          ]);
          showTvShows.appendChild(postTvShow);


        }
      });
    });



    Promise.allSettled([newPost, exist]).then((n) => {
      htmlDocuments.title().value = "";
      htmlDocuments.schedule().value = "";
      htmlDocuments.seasons().value = "";
    });
  }
}

function deleteEditBook(e) {
  let id = e.target.parentNode.parentNode.getAttribute("value");
  console.log(id);
  let editShow = createElement("tr", "", "", [
    createElement("td"),
    createElement("td"),
    createElement("td"),
    createElement("td", "", "", [
      createElement("button", "Edit"),
      createElement("button", "Delete"),
    ]),
  ]);

  if (e.target.innerHTML == "Delete") {
    console.log(id);
    fetch(`https://asentest-6b013.firebaseio.com/tvShows/${id}/.json`, {
      method: "DELETE",
    });
    for (let i = 0; i < showTvShows.children.length; i++) {
      const b = showTvShows.children[i];
      if (b.getAttribute("value") === id) {
        showTvShows.removeChild(b);
      }
    }
  } else if (e.target.innerHTML == "Edit") {
    let tvShowInfo = e.target.parentNode.parentNode.children;
    let tvShowName = tvShowInfo[0].innerHTML;
    let showSchedule = tvShowInfo[1].innerHTML;
    let showSeasons = tvShowInfo[2].innerHTML;

    editForm.titleEdit().value = tvShowName;
    editForm.scheduleEdit().value = showSchedule;
    editForm.seasonsEdit().value = showSeasons;

    editForm.editButton().addEventListener("click", addEditedElement);

    function addEditedElement(e) {
      editShow.children[0].innerHTML = editForm.titleEdit().value;
      editShow.children[1].innerHTML = editForm.scheduleEdit().value;
      editShow.children[2].innerHTML = editForm.seasonsEdit().value;
      e.preventDefault();

    let remove=  fetch(dataBaseURL)
        .then((b) => b.json())
        .then((b) => {
          Object.entries(b).map(([key, seasons]) => {
            if (seasons.title === tvShowName) {
              editShow.setAttribute("value", key);
              let newShow = {
                title: editForm.titleEdit().value,
                schedule: editForm.scheduleEdit().value,
                seasons: editForm.seasonsEdit().value,
              };
              for (let i = 0; i < showTvShows.children.length; i++) {
                const b = showTvShows.children[i];
                if (b.getAttribute("value") === id) {
                  showTvShows.removeChild(b);
                }
                
          let put    =  fetch(
                  `https://asentest-6b013.firebaseio.com/tvShows/${key}/.json`,
                  {
                    method: "PUT",
                    body: JSON.stringify(newShow),
                  }
                );
              }
            }
          });
        });
        Promise.allSettled([remove]).then(n=>{
          showTvShows.appendChild(editShow);
          editForm.titleEdit().value = "";
          editForm.scheduleEdit().value = "";
          editForm.seasonsEdit().value = "";


        })
    }
  }
}
function createElement(type, text, attributes, ...childrens) {
  let newDom = document.createElement(type);
  if (text != undefined) {
    newDom.textContent = text;
  }

  if (attributes != undefined) {
    Object.entries(attributes).map(([key, seasons]) => {
      newDom.setAttribute(key, seasons);
    });
  }
  if (childrens != undefined) {
    childrens.forEach((c) => {
      for (let i = 0; i < c.length; i++) {
        const element = c[i];
        newDom.appendChild(element);
      }
    });
  }
  return newDom;
}
