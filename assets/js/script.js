const myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = Boolean(read);
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

const displayLibrary = document.getElementById("library");

function displayBooks() {
    myLibrary.forEach((book) => {
        const displayItem = document.createElement("li");
        const displayTitle = document.createElement("h2");
        displayTitle.textContent = book.title;
        const displayAuthor = document.createElement("p");
        displayAuthor.textContent = `by ${book.author};`;
        const displayPages = document.createElement("p");
        displayPages.textContent = `${book.pages} pages.`;
        const displayStatus = document.createElement("p");
        if (book.read) {
            displayStatus.textContent = "read";
        } else {
            displayStatus.textContent = "not read yet";
        }
        const deleteItem = document.createElement("button");
        deleteItem.textContent = "X";
        displayItem.appendChild(displayTitle);
        displayItem.appendChild(displayAuthor);
        displayItem.appendChild(displayPages);
        displayItem.appendChild(displayStatus);
        displayItem.appendChild(deleteItem);
        displayItem.classList.add("card");
        displayLibrary.appendChild(displayItem);
        deleteItem.addEventListener("click", () => {
            myLibrary.splice(myLibrary.indexOf(book), 1)
            displayItem.remove();
        });
    });
};

const form = document.querySelector("form");
const btnShowForm = document.getElementById("show-form");
btnShowForm.addEventListener("click", () => {
    form.style.display = "block";
    btnShowForm.style.display = "none";
});

const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages= document.getElementById("pages");
function getValue(e) {
    const tempBook = new Book(inputTitle.value, inputAuthor.value, inputPages.value, false);
    addBookToLibrary(tempBook);
    displayBooks();
    form.style.display = "none";
    btnShowForm.style.display = "block";
    e.preventDefault();
    };

const btnAddBook = document.getElementById("add-book");
btnAddBook.addEventListener("click", getValue)





// temporary

const kockar = new Book("Kockar", "F.M.Dostojevski", 186, true);
const priceIzSume = new Book("Priče iz šume", "Nikoleta Novak", 146, true);
const vragolaniIDzangrizala = new Book(
    "Vragolani i džangrizala",
    "Toni Vulf",
    44,
    false
);
const glineniUdar = new Book("Glineni udar", "Donald Lemke", 41, true);

addBookToLibrary(kockar);
addBookToLibrary(priceIzSume);
addBookToLibrary(vragolaniIDzangrizala);
addBookToLibrary(glineniUdar); 

// end temporary

displayBooks();