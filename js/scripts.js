/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 **/

const searchContainer = document.querySelector('.search-container');
const gallery = document.querySelector('#gallery');


// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(checkStatus)
    .then(res => res.json())
    .then(data => { 
        generateGallery(data.results);
        addModal(data.results)
        search();
    })
    .catch(error => console.log('Looks like there was a problem!', error))


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response) {
    if (response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
}

// Populates the page with 12 employees
function generateGallery(data) {
    for (let i = 0; i < data.length; i++) {
        let html = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${data[i].picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                <p class="card-text">${data[i].email}</p>
                <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>
            </div>
        </div>
        `;
        gallery.insertAdjacentHTML('beforeend', html);
    }
    
}

// Generates the modal window
function generateModal(data, index) {
    let phone = data[index].cell;
    let dob = data[index].dob.date;
    let dobClean = dob.substring(0, 10);

    // Makes the phone numbers same format (XXX) XXX-XXXX
    phone = phone.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    // Makes the Birthday numbers same format MM/DD/YYYY
    dobClean = dobClean.replace(/\D+/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$2/$3/$1');

    let html = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${data[index].picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${data[index].name.first} ${data[index].name.last}</h3>
                <p class="modal-text">${data[index].email}</p>
                <p class="modal-text cap">${data[index].location.city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${data[index].location.street.number} ${data[index].location.street.name}, ${data[index].location.city}, ${data[index].location.state} ${data[index].location.postcode}</p>
                <p class="modal-text">Birthday: ${dobClean}</p>
                </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
        
    </div>
    `;  
    gallery.insertAdjacentHTML('beforeend', html);
    
    // ------------------------------------------
    //  EVENT LISTENERS
    // ------------------------------------------
    document.querySelector('.modal-close-btn').addEventListener('click',() => {
        gallery.removeChild(document.querySelector('.modal-container'))
    });
    document.querySelector('.modal-next').addEventListener("click", (e) => {
        console.log('This is the next button');
        if (index >= 0 && index < 11) {
            e.target.parentElement.parentElement.remove();
            generateModal(data, index + 1);
        }
    });
    document.querySelector('.modal-prev').addEventListener("click", (e) => {
        console.log('This is the previous button');
        if (index > 0 && index <= 12) {
            e.target.parentElement.parentElement.remove();
            generateModal(data, index - 1);
        }
    });
}

// Creates a modal window when the employee's box is clicked
function addModal(data) {
    let allCards = document.querySelectorAll('.card');
    for ( let i = 0; i < allCards.length; i++) {
        allCards[i].addEventListener('click', () => generateModal(data, i));
    }
}

// Adds the search and filter functionality
function search() {
    const sForm = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `;
    searchContainer.insertAdjacentHTML('beforeend', sForm);

    const searchInput = document.querySelector('#search-input');
    const submit = document.querySelector('#search-submit');
    const tableCells = document.querySelectorAll('.card-name');

    function searchForm(searchInput, names) {
        for (let i = 0; i < names.length; i++) {
          let parent = names[i].parentElement.parentElement;
          parent.classList.remove('match');
          names[i].classList.remove('match');
          if (searchInput.value.length !== 0 
                && names[i].textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
            parent.classList.add('match');
          }
        }
    }

    submit.addEventListener('click', (event) => {
        event.preventDefault();
        searchForm(searchInput, tableCells);
    });

    searchInput.addEventListener('keyup', () => {
        searchForm(searchInput, tableCells);
    });
}