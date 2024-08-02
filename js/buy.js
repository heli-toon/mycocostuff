fetch("../data.json")
  .then((response) => response.json())
  .then((data) => {
    const productsHTML = data
      .map((product) => {
        return `
        <div class="col">
            <div class="product-item" id="btn">
                <figure>
                    <a href="#" title="${product.item}">
                      <img src="${product.image}" class="tab-image" />
                    </a>
                </figure>
                <h5>${product.item}</h5>
                <span class="price">GH¢${product.price.toFixed(2)}</span>
                <div class="options-full">
                  <select class="product-size" id="${product.id}-size">
                  <option value="${product.sizes[0]}">Medium</option>
                  <option value="${product.sizes[1]}">Large</option>
                  </select>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="input-group product-qty" id='${product.id}'>
                      <span class="input-group-btn">
                        <button type="button" class="quantity-left-minus btn btn-number" data-type="minus data-id="${product.id}"> - </button>
                      </span>
                      <input type="text" name="quantity" class="form-control input-number" value="1" min="1"/>
                      <span class="input-group-btn">
                        <button type="button" class="quantity-right-plus btn btn-number" data-type="plus" data-pid="${product.id}">
                          <i class="bi bi-plus"></i>
                        </button>
                      </span>
                    </div>
                    <a href="#" class="btn add-to-cart" title="Add to Cart" data-product-id="${product.id}"><i class="bi bi-cart-plus-fill"></i> Add</a>
                </div>
            </div>
        </div> `;
      })
      .join("");
    document.getElementById("product-grid").innerHTML = productsHTML;
    
    const minusBtns = document.querySelectorAll(".quantity-left-minus");
    const plusBtns = document.querySelectorAll(".quantity-right-plus");
    const addToCartBtns = document.querySelectorAll(".add-to-cart");

    minusBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const inputField = e.target.closest('.input-group').querySelector('input');
        const currentValue = parseInt(inputField.value);
        if (currentValue > 1) {
          inputField.value = currentValue - 1;
        }
      });
    });

    plusBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const inputField = e.target.closest('.input-group').querySelector('input');
        const currentValue = parseInt(inputField.value);
        inputField.value = currentValue + 1;
      });
    });
    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = btn.getAttribute('data-product-id');
        const image = e.target.closest('.product-item').querySelector('.tab-image').src;
        
        const inputField = document.querySelector(`.product-qty[id="${productId}"] input`);
        const quantity = parseInt(inputField.value);
        const selectField = document.querySelector(`.product-size[id="${productId}-size"]`);
        const sizes = selectField.value;
        const product = data.find((p) => (p.id) === productId);
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find((item) => (item.id) === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          const cartItem = {
            id: (product.id),
            item: product.item,
            price: product.price,
            quantity: quantity,
            sizes: sizes,
            image: image
          };
          cart.push(cartItem);
          alert(`${cartItem.item} added to cart!`);    
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cart-count').innerText = cartItemCount;
      });
    });
 });