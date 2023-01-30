/*
01 - main global variables
02 - save to local storage
03 - helper functions
04 - delete a book object and card
05 - edit a book object and card
06 - book object manipulation
07 - create book card, set up buttons and checkboxes
08 - create new book
09 - restore from local storage
*/

/* 01 - main global variables */

let myLibrary = [];

const displayLibrary = document.getElementById("library");

const template = document.getElementById("card-template");

/* 02 - save to local storage */

const saveLocal = () => {
  localStorage.setItem('savedLibrary', JSON.stringify(myLibrary));
}

/* 03 - helper functions */

function formatDate(date) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function updateCard(card, obj) {
  const cardToUpdate = card; // no-param-reasign
  cardToUpdate.querySelector(".card-title").textContent = `	“${obj.title}”`;
  cardToUpdate.querySelector(".card-author").textContent = obj.author
    ? `by ${obj.author};`
    : `by Unknown Author;`;
  cardToUpdate.querySelector(".card-pages").textContent =
    obj.pages === 1 
    ? `${obj.pages} page.` 
    : `${obj.pages} pages.`;
  cardToUpdate.querySelector(".card-date").textContent = 
    obj.date 
    ? `\xa0\xa0${formatDate(obj.date)}.\xa0` // add white space around
    : `No date set`;
  const cardReadCheckbox = cardToUpdate.querySelector(".card-read-checkbox");
  cardToUpdate.dataset.read = obj.read;
  cardReadCheckbox.checked = obj.read;
  cardReadCheckbox.nextElementSibling.textContent = obj.updateLabelText("read"); // label
  const cardReturnedCheckbox = cardToUpdate.querySelector(".card-returned-checkbox");
  cardToUpdate.dataset.returned = obj.returned;
  cardReturnedCheckbox.checked = obj.returned;
  cardReturnedCheckbox.nextElementSibling.textContent = obj.updateLabelText("returned");
}

/* 04 - delete a book object and card */

const dialogDelete = document.getElementById("dialog-delete");
const dialogDeleteText = document.getElementById("dialog-text");
const dialogCancelDelete = document.getElementById("cancel-delete");
const dialogConfirmDelete = document.getElementById("confirm-delete");

let indexOfItemToDelete; // values set when clicking on card's delete button
let cardToDelete;

dialogCancelDelete.addEventListener("click", () => {
  dialogDelete.close();
});

dialogConfirmDelete.addEventListener("click", () => {
  myLibrary.splice(indexOfItemToDelete, 1);
  cardToDelete.remove();
  saveLocal();
  dialogDelete.close();
});

/* 05 - edit a book object and card */

const formEdit = document.getElementById("form-edit");
const editTitle = document.getElementById("edit-title");
const editAuthor = document.getElementById("edit-author");
const editPages = document.getElementById("edit-pages");
const editDate = document.getElementById("edit-date");

const dialogEdit = document.getElementById("dialog-edit");
const dialogCancelEdit = document.getElementById("cancel-edit");

let indexOfItemToEdit;// values set when clicking on card's edit button
let cardToEdit;

dialogCancelEdit.addEventListener("click", () => {
  dialogEdit.close();
});

formEdit.addEventListener("submit", (e) => {
  const bookToEdit = myLibrary[indexOfItemToEdit];
  bookToEdit.editBook();
  updateCard(cardToEdit, bookToEdit);
  e.preventDefault();
  dialogEdit.close();
});

/* 06 - book object manipulation */

function Book(title, author, pages, date, read, returned) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.date = date;
  this.read = read;
  this.returned = returned;
}

function addBookToLibrary(book) {
  myLibrary.unshift(book);
}

Book.prototype.setId = function setId() {
  this.id = Date.now() + Math.random(1000);
};

Book.prototype.toggleStatus = function toggleStatus(key, checked) {
  this[key] = !!checked; // if checkbox checked, set value of object's key to true
};

Book.prototype.updateLabelText = function updateLabelText(prop) {
  if (this[prop]) {
    return `${prop.at(0).toUpperCase() + prop.slice(1)}.`;
  }
  return `Not ${prop} yet.`;
};

Book.prototype.editBook = function editBook() {
  this.title = editTitle.value;
  this.author = editAuthor.value;
  this.pages = Number(editPages.value);
  this.date = editDate.value;
  saveLocal();
};

/* 07 - create book card, set up buttons and checkboxes */

Book.prototype.createCard = function createCard() {
  this.setId();
  const card = template.content.cloneNode(true); // created from template as a #document-fragment and not node, must be defined as node to manipulate.
  const cardReference = card.children[0];
  // Child of a doc fragment is an actual node.
  // The usual node methods (setAttribute(), remove()...) won't work on a #document-fragment.
  cardReference.setAttribute("id", this.id);

  const cardReadCheckbox = card.querySelector(".card-read-checkbox");
  cardReadCheckbox.setAttribute("id", `card-read-${this.id}`); 
  cardReadCheckbox.nextElementSibling.setAttribute("for", cardReadCheckbox.getAttribute("id")); // label
  // checkbox and label must have matching and unique ids and fors 

  const cardReturnedCheckbox = card.querySelector(".card-returned-checkbox");
  cardReturnedCheckbox.setAttribute("id", `card-returned-${this.id}`); 
  cardReturnedCheckbox.nextElementSibling.setAttribute("for", cardReturnedCheckbox.getAttribute("id")); 

  const cardEdit = card.querySelector(".card-edit");
  const cardDelete = card.querySelector(".card-delete");

  displayLibrary.insertBefore(card, displayLibrary.firstChild); // add new books to top
  updateCard(cardReference, this);

  cardReadCheckbox.addEventListener("change", () => {
    this.toggleStatus("read", cardReadCheckbox.checked);
    saveLocal();
    updateCard(cardReference, this);
  });

  cardReturnedCheckbox.addEventListener("change", () => {
    this.toggleStatus("returned", cardReturnedCheckbox.checked);
    saveLocal();
    updateCard(cardReference, this);
  });

  cardEdit.addEventListener("click", () => {
    indexOfItemToEdit = myLibrary.indexOf(this);
    cardToEdit = cardReference;
    dialogEdit.showModal();
    editTitle.value = this.title;
    editAuthor.value = this.author;
    editPages.value = this.pages;
    // editDate.value = this.date.toLocaleDateString("en-CA"); // converts date object back to appropriate string
    editDate.value = this.date;
  });

  cardDelete.addEventListener("click", () => {
    dialogDeleteText.textContent = `Are you sure you want to remove “${this.title}”?`;
    indexOfItemToDelete = myLibrary.indexOf(this);
    cardToDelete = cardReference;
    dialogDelete.showModal();
  });
};

/* 08 - create new book */

const btnCreate = document.getElementById("btn-create");
const btnCancelCreate = document.getElementById("cancel-create");

const dialogAdd = document.getElementById("dialog-add");
const formAdd = document.getElementById("form-add");
const inputTitle = document.getElementById("input-title");
const inputAuthor = document.getElementById("input-author");
const inputPages = document.getElementById("input-pages");
const inputDate = document.getElementById("input-date");

btnCreate.addEventListener("click", () => {
  dialogAdd.showModal();
});

btnCancelCreate.addEventListener("click", () => {
  dialogAdd.close();
});

function createBook(e) {
  const tempBook = new Book(
    inputTitle.value,
    inputAuthor.value,
    Number(inputPages.value),
    inputDate.value,
    false,
    false
  );
  addBookToLibrary(tempBook);
  tempBook.createCard();
  formAdd.reset();
  e.preventDefault();
  dialogAdd.close();
  saveLocal();
}

formAdd.addEventListener("submit", createBook);

// 09 - restore from local storage

function restoreLocal() {
  if(!localStorage.getItem('savedLibrary')) {
        // example books for first time users
    myLibrary = [
      new Book("Newly added books go front", "Raymond Luxury-Yacht", 41, "2023-01-23", false, false),
      new Book("A book written by people with very long names, and whose title also just goes on and on and on and on and on and on and on and on and on and on", 
      "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Ruiz y Picasso, Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.", 
      1, "2023-01-23", false, false),
      new Book("A book that is read", "Ernest Scribbler", 44, "2023-01-23", true, false),
      new Book("A returned unread book", "Harold Larch", 146, "2022-12-31", false, true),
      new Book("Done with this book", "Jeremy Toogood", 186, "2022-12-20", true, true)
    ];
  } else {
    myLibrary = JSON.parse(localStorage.getItem('savedLibrary'));
    myLibrary = myLibrary.map(book => new Book(book.title, book.author, book.pages, book.date, book.read, book.returned));
    
  }
  myLibrary.slice().reverse().forEach(book => book.createCard()); // make a copy of array then reverse, so last added books display first
}

restoreLocal();