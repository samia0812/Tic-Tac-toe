const myLibrary = [];

function Book(title, author, pages, read) {
  this.id = crypto.randomUUID(); 
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleRead = function() {
  this.read = !this.read;
};

function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  displayBooks();
}

function displayBooks() {
  const libraryDiv = document.getElementById('library');
  libraryDiv.innerHTML = '';

  myLibrary.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.dataset.id = book.id;

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Status:</strong> ${book.read ? 'Read' : 'Not Read'}</p>
      <button class="toggle-btn">Toggle Read</button>
      <button class="remove-btn">Remove</button>
    `;

    card.querySelector('.remove-btn').addEventListener('click', () => removeBook(book.id));
    card.querySelector('.toggle-btn').addEventListener('click', () => toggleBookRead(book.id));

    libraryDiv.appendChild(card);
  });
}

function removeBook(id) {
  const index = myLibrary.findIndex(book => book.id === id);
  if (index !== -1) {
    myLibrary.splice(index, 1);
    displayBooks();
  }
}

function toggleBookRead(id) {
  const book = myLibrary.find(book => book.id === id);
  if (book) {
    book.toggleRead();
    displayBooks();
  }
}

const newBookBtn = document.getElementById('newBookBtn');
const newBookForm = document.getElementById('newBookForm');

newBookBtn.addEventListener('click', () => {
  newBookForm.style.display = newBookForm.style.display === 'none' ? 'block' : 'none';
});

newBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const pages = document.getElementById('pages').value;
  const read = document.getElementById('read').checked;

  addBookToLibrary(title, author, pages, read);

  newBookForm.reset();
  newBookForm.style.display = 'none';
});

addBookToLibrary("Harry Potter", "J.k. Rowling", 310, true);
addBookToLibrary("1984", "George Orwell", 328, false);
addBookToLibrary("Ikigai", "Francesc Miralles", 278, false);
addBookToLibrary("Red Rising", "Pierce Brown", 400, true);