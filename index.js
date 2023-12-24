const state = {
    taskList : [],
};

// DOM Operations
const taskContents = document.querySelector("task__contents");
const taskModal = document.querySelector("task__modal__body");

// Template for card on the screen
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