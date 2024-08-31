(function() {
  "use strict";
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }
  let backtotop = select('.back-to-top')
  let cartbtn = select(".cart-btn");
  if (backtotop || cartbtn) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    const togglecartbtn = () => {
      if (window.scrollY > 100) {
        cartbtn.classList.add("active");
      } else {
        cartbtn.classList.remove("active");
      }
    }
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
    window.addEventListener("load", togglecartbtn);
    onscroll(document, togglecartbtn);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)
  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });
})()
document.querySelectorAll('.remove-button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const itemId = e.target.getAttribute('data-item-id');
    const cart = JSON.parse(localStorage.getItem('cart'));
    const updatedCart = cart.filter((item) => (item.id) !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    location.reload();
  });
});
document.querySelectorAll('.update-button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const itemId = e.target.getAttribute('data-items-id');
    const size = document.getElementById(`${itemId}-size`).value;
    const quantity = parseInt(document.getElementById(`${itemId}-quantity`).value);
    const cart = JSON.parse(localStorage.getItem('cart'));
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        item.size = size;
        item.quantity = quantity;
        alert(`${item.item} has been updated`);
      }
      return item;
    });
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    location.reload();
    e.preventDefault();
  });
});
function emptyCart(){
  localStorage.clear('cart');
  location.reload();
}
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
document.getElementById('cart-count').innerText = cartItemCount;
document.getElementById('cart-numbered').innerText = cartItemCount;
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const total = cart.reduce((acc, current) => acc + current.price * current.quantity, 0);

cartItems.forEach((item) => {
  const cartItemHTML = `
    <div class="cart-item">
      <img src="${item.image}" alt="Item" class="cart-item-image" />
      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.item}</h3>
        <p class="cart-item-price">GH¢${item.price.toFixed(2)}</p>
        <div class="cart-item-options">
          <label for="${item.id}-size">Size:</label>
          <select id="${item.id}-size" value="${item.sizes}">
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        <div class="cart-item-quantity">
          <label for="${item.id}-quantity">Quantity:</label>
          <input type="number" id="${item.id}-quantity" value="${item.quantity}" min="1" />
        </div>
      </div>
      <div class="cart-item-actions">
        <button type="button" class="update-button btn" data-items-id="${item.id}">Update</button>
        <button type="button" class="remove-button btn" data-item-id="${item.id}">Remove</button>
      </div>
    </div>
  `;
  
  document.querySelector('.cart-items').innerHTML += cartItemHTML;
});
document.querySelectorAll('.remove-button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const itemId = e.target.getAttribute('data-item-id');
    const cart = JSON.parse(localStorage.getItem('cart'));
    const updatedCart = cart.filter((item) => (item.id) !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    location.reload();
  });
});
document.querySelectorAll('.update-button').forEach((button) => {
  button.addEventListener('click', (e) => {
    const itemId = e.target.getAttribute('data-items-id');
    const size = document.getElementById(`${itemId}-size`).value;
    const quantity = parseInt(document.getElementById(`${itemId}-quantity`).value);
    const cart = JSON.parse(localStorage.getItem('cart'));
    const updatedCart = cart.map((item) => {
      if (item.id === itemId) {
        item.size = size;
        item.quantity = quantity;
        alert(`${item.item} has been updated`);
      }
      return item;
    });
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    location.reload();
    e.preventDefault();
  });
});
function emptyCart(){
  localStorage.clear('cart');
  location.reload();
}
const cartData = localStorage.getItem('cart');
const cartObject = JSON.parse(cartData);

let formattedCart = '';
for (const item in cartObject){
  formattedCart += `Item: ${cartObject[item].item}\n`;
  formattedCart += `Quantity: ${cartObject[item].quantity}\n`;
  formattedCart += `Price: ${cartObject[item].price}\n`;
  formattedCart += `Size: ${cartObject[item].sizes}\n`;
  formattedCart += `-------------------------------\n`;
}
document.getElementById('cartTextarea').value = formattedCart;

const submitCart = document.getElementById('submitCart');
submitCart.addEventListener('click', ()=>{
  localStorage.clear('cart');
});