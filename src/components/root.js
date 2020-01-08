import { Book } from '../models/book.model';

const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
`

class RootComponent extends HTMLElement {
  constructor() {
    super();
    this.appendChild(template.content.cloneNode(true));
    this._books = this._getData();

    const $modalAddBookBtn = document.querySelector('.form-book-add-btn');

    $modalAddBookBtn.addEventListener('click', this._initBook.bind(this));
    this.addEventListener('bookDelete', this._deleteBook.bind(this));
    this.addEventListener('bookReadToggle', this._bookReadToggle.bind(this));

    this._render()
  }

  _deleteBook(e){
    this._books.splice(e.detail, 1);
    this._setData(this._books);
    this._render();
  }

  _toggleTableVisible(){
    if(this._books.length === 0){
      document.querySelector('.table').style.opacity = '0';
    }else{
      document.querySelector('.table').style.opacity = '1';
    }
  }

  _bookReadToggle(e){
    const {read, index} = e.detail;
    this._books[index].read = read;
    this._render();
  }

  _createBook(b, i){
    const $book = document.createElement('app-book');
    $book.setAttribute('title', b.title);
    $book.setAttribute('author', b.author);
    $book.setAttribute('pages', b.pages);
    $book.setAttribute('read', b.read);
    $book.setAttribute('index', i);
    return $book;
  }
  
  _initBook(e){
    const {value: $title} = document.querySelector('.title-input');
    const {value: $author} = document.querySelector('.author-input');
    const {value: $pages} = document.querySelector('.pages-input');
    const {checked: $read} = document.querySelector('.read-input');
    if(!$title, !$author, !$pages) return;
    if(+$pages <= 0 || !Number.isInteger(+$pages)) return;
 
    const newBook = new Book($title, $author, +$pages, $read);
    this._books.push(newBook);
    this._setData(this._books);
    $('.modal').modal('hide');
    document.querySelector('.title-input').value = '';
    document.querySelector('.author-input').value = '';
    document.querySelector('.pages-input').value = '';
    document.querySelector('.read-input').value = '';
    this._render();
  }

  _render(){
    const $tbody = document.querySelector('tbody');
    this._toggleTableVisible();
    $tbody.innerHTML = '';
    this._books.forEach((b, i)=> {
      const $book = this._createBook(b, i);
      $tbody.appendChild($book);
    });
    
  }

  _setData(data){
    localStorage.setItem('books', JSON.stringify(data));
  }

  _getData(){
    const data = JSON.parse(localStorage.getItem('books'));
    return data || [];
  }

}

customElements.define('app-root', RootComponent);
