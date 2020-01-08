const template = document.createElement('template');
template.innerHTML = `
  <td scope="row" class="book-num"></td>
  <td class="title-cell"></td>
  <td class="author-cell"></td>
  <td class="pages-cell"></td>
  <td><button type="button" class="btn btn-outline-success book-read-toggle-btn"></button></td>
  <td><button type="button" class="btn btn-outline-danger book-delete-btn">Remove</button></td>
`

class BookComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback(){
    this.appendChild(template.content.cloneNode(true));

    this._title = this.getAttribute('title');
    this._author = this.getAttribute('author');
    this._pages = this.getAttribute('pages');
    this._read = this.getAttribute('read') === 'true';
    this._index = this.getAttribute('index');

    const $bookDeleteBtn = this.querySelector('.book-delete-btn');
    this.$bookReadToggleBtn = this.querySelector('.book-read-toggle-btn');

    $bookDeleteBtn.addEventListener('click', this._handleBookDelete.bind(this));
    this.$bookReadToggleBtn.addEventListener('click', this._handleBookToggle.bind(this));

    this._populateCells();
    this._setReadBtnText();
    this._setBookNum();
  }

  _populateCells(){
    const $titleCell = this.querySelector('.title-cell');
    const $AuthorCell = this.querySelector('.author-cell');
    const $PagesCell = this.querySelector('.pages-cell');

    $titleCell.textContent = this._title;
    $AuthorCell.textContent = this._author;
    $PagesCell.textContent = this._pages;
  }

  _handleBookToggle(e){
    const event = this._createNewEvent('bookReadToggle', { index: this._index, read: !this._read });
    this.dispatchEvent(event);
  }

  _handleBookDelete(e){
    const event = this._createNewEvent('bookDelete', this._index);
    this.dispatchEvent(event);
  }

  _setReadBtnText(){
    if(this._read){
      this.$bookReadToggleBtn.textContent = 'Unread';
    }else{
      this.$bookReadToggleBtn.textContent = 'Read';
    }
  }

  _setBookNum(){
    this.querySelector('.book-num').textContent = +this._index + 1;
  }

  _createNewEvent(eventName, payload) {
    const eventOptions = { bubbles: true, composed: true, detail: payload }
    return new CustomEvent(eventName, eventOptions);
  }
}

customElements.define('app-book', BookComponent);
