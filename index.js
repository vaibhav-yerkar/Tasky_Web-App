const state = {
    taskList : [],
};

const taskContents = document.querySelector("task__contents");
const taskModal = document.querySelector("task__modal__body");

// Template for card on the screen
// element identifier 'key=${id}' missing on line 12th
const htmlTaskContent = ({id,title,description,type,url}) => `
    <div class="mt-3 col-md-6 col-lg-4" id=${id} >
        <div class="card shadow task__card" >
            <div class="card-header d-flex justify-content-end task__card__header">
                <button type="button" class="btn btn-outline-primary mr-2" name=${id}>
                    <i class="fa-solid fa-pencil" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outline-danger mr-2" name=${id}>
                    <i class="fa-solid fa-trash" name=${id}></i>
                </button>
            </div>

            <div class="card-body">
                ${
                    url &&
                    `<img class="card-img-top md-3 rounded" width="100%" src=${url} alt="card image">`
                }
                <h4 class="card-title task__card__title">${title}</h4>
                <p class="task__card__description trim-3-lines text-muted">${description}</p>
                <div class="tags text-white d-flex flex-wrap">
                    <sapn class="badge rounded bg-primary">${type}</sapn>
                </div>
            </div>

            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#openTaskModal">Open Task</button>
            </div>
        </div>
    </div>
`;

// Open-Task Modal Body
const htmlModalContent = ({id, title, description, url}) => {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
        ${
            url &&
            `<img class="img-fluid place__holder__img mb-3" width="100%" src=${url} alt="card image">`
        }
        <strong class="text-muted text-sm"> Created on : ${date.toDateString()}</strong>
        <h2 class="my-3">${title}</h2>
        <p class="text-muted">${description}</p>
    </div>

    `;
};

const updateLocalStorage = () =>{
    localStorage.setItem(
        "task",
        JSON.stringify({                                            // JSON -> String
            tasks : state.taskList,
        })
    );
};

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);        // String -> JSON
    if(localStorageCopy) state.taskList = localStorageCopy.task;

    state.taskList.map((cardData) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
};

// Spread Operator :
/**
    var object_1 = {key : value}
    var object_2 = {object_1}
    console.log (object_2) =>       {{key : value}}  

    var object_3 = {...object1}
    console.log (object_3) =>       {key : value}
*/

const handleSubmit = (event) =>{
    const id = `${Date.now()}`;
    const input = {
        url : document.getElementById('taskImageInput').value,
        title : document.getElementById('taskTitleInput').value,
        tags : document.getElementById('tags').value,
        description : document.getElementById('taskDescriptionInput').value,
    };
    if(input.title === "" || input.tags === "" || input.description === ""){
        return alert("Please fill necessary fields ");
    }
    taskContents.insertAdjacentElement("beforeend",htmlTaskContent({...input, id}));
    state.taskList.push({...input, id});
    updateLocalStorage();
};