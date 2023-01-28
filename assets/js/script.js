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
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  console.log(JSON.stringify(myLibrary))
}

/* 03 - helper functions */

function formatDate(date) {
  return date.toLocaleString("en-US", {
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
 cardToUpdate.querySelector(".card-date").textContent = `\xa0\xa0${formatDate(obj.date)}.\xa0`; // add white space around
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

function Book(title, author, pages, date) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.date = date;
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
  editDate.value
    ? (this.date = new Date(editDate.value))
    : (this.date = "No date set");
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
  const cardReadLabel = card.querySelector(".card-read-label");
  cardReadLabel.setAttribute("for", `card-read-${this.id}`);
  cardReadCheckbox.setAttribute("id", cardReadLabel.getAttribute("for")); // checkbox and label must have matching and unique ids and fors

  const cardReturnedCheckbox = card.querySelector(".card-returned-checkbox");
  const cardReturnedLabel = card.querySelector(".card-returned-label");
  cardReturnedLabel.setAttribute("for", `card-returned-${this.id}`);
  cardReturnedCheckbox.setAttribute("id", cardReturnedLabel.getAttribute("for")
  );

  const cardEdit = card.querySelector(".card-edit");
  const cardDelete = card.querySelector(".card-delete");

  displayLibrary.insertBefore(card, displayLibrary.firstChild); // add new books to top
  updateCard(cardReference, this);

  cardReadCheckbox.addEventListener("change", () => {
    this.toggleStatus("read", cardReadCheckbox.checked);
    console.log("read status toggled");
    cardReference.dataset.read = this.read;
    console.log("data attribute updated");
    cardReadLabel.childNodes[1].textContent = this.updateLabelText("read");
    console.log("label text content updated");
    // textContent on label element alone won't work because checkbox is nested within the label so changing text content would overwrite the checkbox itself.
    // saveLocal();
  });

  cardReturnedCheckbox.addEventListener("change", () => {
    this.toggleStatus("returned", cardReturnedCheckbox.checked);
    cardReference.dataset.returned = this.returned;
    cardReturnedLabel.childNodes[1].textContent = this.updateLabelText("returned");
    // saveLocal();
  });

  cardEdit.addEventListener("click", () => {
    indexOfItemToEdit = myLibrary.indexOf(this);
    cardToEdit = cardReference;
    dialogEdit.showModal();
    editTitle.value = this.title;
    editAuthor.value = this.author;
    editPages.value = this.pages;
    // editDate.value = this.date.toLocaleDateString("en-CA"); // converts date object back to appropriate string
    editDate.value = this.date; // converts date object back to appropriate string
  });

  cardDelete.addEventListener("click", () => {
    dialogDeleteText.textContent = `Are you sure you want to remove “${this.title}”?`;
    indexOfItemToDelete = myLibrary.indexOf(this);
    cardToDelete = cardReference;
    dialogDelete.showModal();
  });
  console.log("restored from local")
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
    inputDate.value
  );
  inputDate.value
    ? (tempBook.date = new Date(inputDate.value))
    : (tempBook.date = "No date set");
  addBookToLibrary(tempBook);
  tempBook.createCard();
  formAdd.reset();
  e.preventDefault();
  dialogAdd.close();
  saveLocal();
}

formAdd.addEventListener("submit", createBook);

// 09 - restore from local storage

const JSONToBook = (book) => new Book(book.title, book.author, book.pages, book.date, book.read, book.returned);

const restoreLocal = () => {
  const books = JSON.parse(localStorage.getItem('myLibrary'))
  if (books) {
    myLibrary = books.map((book) => JSONToBook(book))
  } else {
    myLibrary = []
  };
  myLibrary.forEach(book => book.createCard());
} 

restoreLocal();
