const template = document.createElement('template');
template.innerHTML = `
  <style>
  </style>
`

class RootComponent extends HTMLElement {
  constructor() {
    super();
    this.appendChild(template.content.cloneNode(true));
    this._activateLinks();    
    
    this._cartItems = [];
    this._cartTotalCount = 0;
    
    const $cart = document.querySelector('.cart');
    this.addEventListener('juicesBtnClick', this._childBtnClick.bind(this)); 
    this.addEventListener('shopBtnClick', this._childBtnClick.bind(this));
    this.addEventListener('buyJuiceClick', this._buyJuiceClick.bind(this));
    this.addEventListener('itemPurchase', this._itemPurchase.bind(this));
    this.addEventListener('itemBrowse', this._buyJuiceClick.bind(this));
    $cart.addEventListener('click', this._cartClick.bind(this));
    this.addEventListener('itemNameClick', this._buyJuiceClick.bind(this));
    this.addEventListener('itemCancelClick', this._itemCancelClick.bind(this));
    this.addEventListener('cartInputChange', this._cartInputChange.bind(this));
    
    const initialView = document.createElement('app-about');
    this._render(initialView);
  }

  _cartInputChange(e){    
    const $cartCount = document.querySelector('.cart__item-count');
    $cartCount.textContent = '';
    this._cartTotalCount = 0;
    this._cartItems.forEach(i => {
      if(i.type === e.detail.type){
        i.count = e.detail.count;
      }
      this._cartTotalCount += Number(i.count)
    })
    $cartCount.textContent = this._cartTotalCount > 100 ? '100+' : this._cartTotalCount;

    const view = this._initView('/cart');
    view.setAttribute('posY', localStorage.getItem('posY'));
    this._render(view);
  }

  _itemCancelClick(e){
    this._deductCartTotalCount(e.detail.count);
    this._cartItems = this._cartItems.filter(i => i.type !== e.detail.path.slice(1));
    const view = this._initView('/cart');
    this._render(view);
  }
  
  _deductCartTotalCount(count){
    this._cartTotalCount -= count;
    document.querySelector('.cart__item-count').textContent = this._cartTotalCount;
  }

  _cartClick(e){
    e.preventDefault();
    let parent = e.target.parentNode;
    while (parent.tagName !== 'A') {
      parent = parent.parentNode
    }
    const view = this._initView(parent.pathname);
    this._render(view);
    
  }

  _itemPurchase(e){
    const { detail: purchase } = e;
    this._setCartItems(purchase)
    this._addCartTotalCount(purchase.count)
  }

  _setCartItems(item){
    if(this._cartItems.length === 0) {
      this._cartItems.push(item);
    }else{
      const index = this._cartItems.findIndex(i => i.type === item.type);
      if (index !== -1) {
        this._cartItems[index] = { ...item, count: item.count + this._cartItems[index].count };
      } else {
        this._cartItems.push(item);
      }
    }
  }

  _activateLinks() {
    const $navLinks = document.querySelectorAll('nav');
    $navLinks.forEach(link => {
      link.addEventListener('click', this._getActivatedPath.bind(this));
    });
  }

  _addCartTotalCount(itemCount){
    this._cartTotalCount += Number(itemCount);
    const $cartCount = document.querySelector('.cart__item-count');
    $cartCount.textContent = this._cartTotalCount > 100 ? '100+' : this._cartTotalCount;
  }

  _initView(path){
    const componentName = path.slice(1);
    const view = document.createElement('app-' + componentName);
    if(componentName === 'cart'){
      view.setAttribute('items', JSON.stringify(this._cartItems));
    }
    return view;
  }

  _childBtnClick(e){
    const path = e.detail;
    const view = this._initView(path);
    this._render(view);
  }

  _buyJuiceClick(e){
   const view =  document.createElement('app-shopping');
   view.setAttribute('juice', e.detail.slice(1));
   view.setAttribute('posY', localStorage.getItem('posY'));
   this._render(view);
  }

  _getActivatedPath(e){
    e.preventDefault();
    const path = e.target.pathname;
    const view = this._initView(path);
    this._render(view);
  }

  _render(view){
    window.scrollTo(0, 0);
    this.innerHTML = '';
    this.appendChild(view);
  }

}

customElements.define('app-root', RootComponent);
