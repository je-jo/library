/*
01 - main global variables
02 - helper functions
03 - delete a book object and card
04 - edit a book object and card
05 - book object manipulation
06 - create book card, set up buttons and checkboxes
07 - create new book
08 - local storage
*/

/* 01 - main global variables */

/* let myLibrary = [
  {
    title: "Other",
    author: "The others",
    pages: 1,
    date: "2022-01-01"
  },
  {
    title: "Newly added up front",
    author: "Raymond",
    pages: 2,
    date: new Date("2023-01-23"),
  } 
]; */

let myLibrary = [];

const saveLocal = () => {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

const displayLibrary = document.getElementById("library");

const template = document.getElementById("card-template");

/* 02 - helper functions */

function formatDate(date) {
  return (new Date(date)).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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

/* 03 - delete a book object and card */

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

/* 04 - edit a book object and card */

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

/* 05 - book object manipulation */

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
    ? (this.date = editDate.value)
    : (this.date = "No date set");
  saveLocal();
};

/* 06 - create book card, set up buttons and checkboxes */

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
    cardReference.dataset.read = this.read;
    cardReadLabel.childNodes[1].textContent = this.updateLabelText("read");
    // textContent on label element alone won't work because checkbox is nested within the label so changing text content would overwrite the checkbox itself.
  });

  cardReturnedCheckbox.addEventListener("change", () => {
    this.toggleStatus("returned", cardReturnedCheckbox.checked);
    cardReference.dataset.returned = this.returned;
    cardReturnedLabel.childNodes[1].textContent = this.updateLabelText("returned");
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
};

/* 07 - create new book */

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
    ? (tempBook.date = inputDate.value)
    : (tempBook.date = "No date set");
  addBookToLibrary(tempBook);
  tempBook.createCard();
  formAdd.reset();
  e.preventDefault();
  dialogAdd.close();
  saveLocal();
}

formAdd.addEventListener("submit", createBook);

// 08 - local storage





const JSONToBook = (book) => new Book(book.title, book.author, book.pages, book.isRead);

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

// temporary manually added example books, free to delete later:

/* const doneWithThisBook = new Book(
  "Done with this book",
  "Jeremy Toogood",
  186,
  new Date("2022-12-23")
);
const aReturnedUnreadBook = new Book(
  "A returned unread book",
  "Harold Larch",
  146,
  new Date("2022-12-31")
);
const aBookThatIsRead = new Book(
  "A book that is read",
  "Ernest Scribbler",
  44,
  new Date("2023-01-23")
);
const longTitleAndAuthor = new Book(
  "A book written by people with very long names, and whose title also just goes on and on and on and on and on and on and on and on and on and on",
  "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Cipriano de la Santísima Trinidad Ruiz y Picasso, Hubert Blaine Wolfeschlegelsteinhausenbergerdorff Sr.",
  1,
  new Date("2023-01-23")
);
const newBookToStart = new Book(
  "Newly added books go front",
  "Raymond Luxury-Yacht",
  41,
  new Date("2023-01-23")
);

addBookToLibrary(doneWithThisBook);
addBookToLibrary(aReturnedUnreadBook);
addBookToLibrary(aBookThatIsRead);
addBookToLibrary(longTitleAndAuthor);
addBookToLibrary(newBookToStart);

doneWithThisBook.createCard();
doneWithThisBook.toggleStatus("read", true);
doneWithThisBook.toggleStatus("returned", true);
displayLibrary.children[0].querySelector(".card-read-checkbox").checked = true;
displayLibrary.children[0].querySelector(
  ".card-returned-checkbox"
).checked = true;
displayLibrary.children[0].dataset.read = doneWithThisBook.read;
displayLibrary.children[0].dataset.returned = doneWithThisBook.returned;
displayLibrary.children[0].querySelector(
  ".card-read-label"
).childNodes[1].textContent = doneWithThisBook.updateLabelText("read");
displayLibrary.children[0].querySelector(
  ".card-returned-label"
).childNodes[1].textContent = doneWithThisBook.updateLabelText("returned");

aReturnedUnreadBook.createCard();
aReturnedUnreadBook.toggleStatus("returned", true);
displayLibrary.children[0].querySelector(
  ".card-returned-checkbox"
).checked = true;
displayLibrary.children[0].dataset.returned = aReturnedUnreadBook.returned;
displayLibrary.children[0].querySelector(
  ".card-returned-label"
).childNodes[1].textContent = aReturnedUnreadBook.updateLabelText("returned");

aBookThatIsRead.createCard();
aBookThatIsRead.toggleStatus("read", true);
displayLibrary.children[0].querySelector(".card-read-checkbox").checked = true;
displayLibrary.children[0].dataset.read = aBookThatIsRead.read;
displayLibrary.children[0].querySelector(
  ".card-read-label"
).childNodes[1].textContent = aBookThatIsRead.updateLabelText("read");


longTitleAndAuthor.createCard();
newBookToStart.createCard(); */

// end temporary
