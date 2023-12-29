
const state = {
    taskList : [],
};

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");


// Template for card on the screen
// element identifier 'key=${id}' missing on line 12th
const htmlTaskContent = ({id,title,description,tags,url, tagColor}) => `
    <div class="mt-3 col-md-6 col-lg-4" id=${id} >
        <div class="card shadow task__card" >
            <div class="card-header d-flex justify-content-end task__card__header">
                <button type="button" class="btn btn-outline-dark mx-1" name=${id} onclick="editTask()">
                    <i class="fa-solid fa-pencil" name=${id}></i>
                </button>
                <button type="button" class="btn btn-outline-danger mx-1" name=${id} onclick="deleteTask()">
                    <i class="fa-solid fa-trash" name=${id}></i>
                </button>
            </div>

            <div class="card-body">
                ${
                    url 
                     ?`<img class="card-img-top md-3 rounded" width="100%" src=${url} alt="card image">`
                     :`<img class="card-img-top md-3 rounded" width="100%" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="card image">`
                    
                }
                <h4 class="card-title task__card__title">${title}</h4>
                <p class="task__card__description trim-1-lines text-muted" id=${id}>${description}</p>
                <div class="tags text-white d-flex flex-wrap">
                    <sapn class="badge rounded ${tagColor}">${tags}</sapn>
                </div>
            </div>

            <div class="card-footer">
                <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target="#openTaskModal" onclick="openTask()" id=${id}>Open Task</button>
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
            url 
            ?`<img class="card-img-top md-3 rounded" width="100%" src=${url} alt="card image">`
            :`<img class="card-img-top md-3 rounded" width="100%" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" alt="card image">`
            
        }
        <strong class="text-muted text-sm"> Created on : ${date.toDateString()}</strong>
        <h2 class="my-3">${title}</h2>
        <p class="text-muted">${description}</p>
    </div>

    `;
};

const updateLocalStorage = () => {
    localStorage.setItem(
        "task",
        JSON.stringify({                                            // JSON -> String
            tasks : state.taskList,
        })
    );
};

const loadInitialData = () => {
    if (localStorage.task){
        const localStorageCopy = JSON.parse(localStorage.task);        // String -> JSON
        // if(localStorageCopy) state.taskList = localStorageCopy.tasks;
        state.taskList = localStorageCopy.tasks;
    }

    state.taskList.map((cardData) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
        console.log(cardData);
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

const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const tagColor = document.querySelector('input[name="tags_color"]:checked').value;

    const input = {
        url : document.getElementById('taskImageInput').value,
        title : document.getElementById('taskTitleInput').value,
        tags : document.getElementById('tags').value,
        tagColor : tagColor,
        description : document.getElementById('taskDescriptionInput').value,
    };
    if(input.title === "" || input.tags === "" || input.description === ""){
        return alert("Please fill necessary fields :) ");
    }
    taskContents.insertAdjacentHTML("beforeend",htmlTaskContent({...input, id}));
    state.taskList.push({...input, id});
    updateLocalStorage();
};

const openTask = (e) => {
    if(!e) e = window.event;

    const getTask = state.taskList.find((task) => task.id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);

};

const deleteTask = (e) => {
    if(!e) e = window.event;
    const taskId = e.target.getAttribute("name");

    state.taskList = state.taskList.filter(({id}) => id!=taskId);
    updateLocalStorage();
    taskContents.removeChild(document.getElementById(taskId));
};

const editTask = (e) => {
    if(!e) e = window.event;
    const taskId = e.target.getAttribute("name");
    const type = e.target.tagName;

    const selectorString = `[id = '${taskId}'].task__card__description`;
    const descTag = document.querySelector(selectorString);
    descTag.classList.remove('trim-1-lines');


    if(type === "BUTTON"){
        parentNode = e.target.parentNode.parentNode;
    }else{
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    taskTitle.setAttribute("contenteditable","true");
    taskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");

    submitButton.removeAttribute('data-bs-target');
    submitButton.removeAttribute('data-bs-toggle');
    submitButton.setAttribute('onclick',"saveTask()");
    submitButton.innerHTML = 'Save Changes';
};

const saveTask = (e) => {
    if(!e) e = window.event;
    const taskId = e.target.id;

    const parentNode = e.target.parentNode.parentNode;

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    updateData = {
        title : taskTitle.innerHTML,
        description : taskDescription.innerHTML,
        tags : taskType.innerHTML,
    };

    let stateCopy = state.taskList;
    
    stateCopy = stateCopy.map((task)=> 
        task.id === taskId
         ?{
            id : task.id,
            title : updateData.title,
            description : updateData.description,
            tags : updateData.tags,
            tagColor : task.tagColor,
            url : task.url,
         }
        : task
    );
    state.taskList = stateCopy;
    updateLocalStorage();

    const selectorString = `[id = '${taskId}'].task__card__description`;
    const descTag = document.querySelector(selectorString);
    descTag.classList.add('trim-1-lines');

    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");

    submitButton.setAttribute('onclick',"openTask()");
    submitButton.setAttribute('data-bs-target','#openTaskModal');
    submitButton.setAttribute('data-bs-toggle','modal');
    submitButton.innerHTML = 'Open Task';
};

const searchTask = (e) => {
    if(!e) e = window.event;
    searchValue = e.target.value;

    taskContents.innerHTML=``;
    const resultData = state.taskList.filter(({title}) => title.includes(searchValue));

    resultData.map((searchResult) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(searchResult))
    })
};