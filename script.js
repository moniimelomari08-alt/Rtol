// ==========================================
// RUUL STORE
// ==========================================


// DEFAULT PRODUCTS

const defaultProducts = [
  {
    id: 1,
    name: "R.001 OVERSIZED TEE",
    price: 299,
    category: "T-SHIRT"
  },

  {
    id: 2,
    name: "R.002 DROP HOODIE",
    price: 499,
    category: "HOODIE"
  },

  {
    id: 3,
    name: "R.003 WIDE PANTS",
    price: 449,
    category: "PANTS"
  },

  {
    id: 4,
    name: "R.004 DENIM SHORT",
    price: 349,
    category: "SHORT"
  }
];


// LOAD PRODUCTS

let products =
  JSON.parse(localStorage.getItem("ruulProducts"))
  || defaultProducts;


// CART

let cart =
  JSON.parse(localStorage.getItem("ruulCart"))
  || [];


// ELEMENTS

const productsGrid =
  document.getElementById("productsGrid");

const cartPanel =
  document.getElementById("cartPanel");

const overlay =
  document.getElementById("overlay");

const cartItems =
  document.getElementById("cartItems");

const cartCount =
  document.getElementById("cartCount");

const cartTotal =
  document.getElementById("cartTotal");


// ==========================================
// SAVE
// ==========================================

function saveProducts() {

  localStorage.setItem(
    "ruulProducts",
    JSON.stringify(products)
  );

}


function saveCart() {

  localStorage.setItem(
    "ruulCart",
    JSON.stringify(cart)
  );

}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts() {

  productsGrid.innerHTML = "";

  document.getElementById("productNumber").textContent =
    `${products.length.toString().padStart(2, "0")} PRODUCTS`;


  products.forEach(product => {

    const card = document.createElement("article");

    card.className = "product";


    card.innerHTML = `

      <div class="product-image"></div>

      <div class="product-info">

        <div>

          <div class="product-name">
            ${product.name}
          </div>

          <div class="product-category">
            ${product.category}
          </div>

        </div>

        <div class="product-price">
          ${product.price} DH
        </div>

      </div>

      <button
        class="add-btn"
        onclick="addToCart(${product.id})"
      >
        ADD TO BAG +
      </button>

    `;


    productsGrid.appendChild(card);

  });

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(id) {

  const product =
    products.find(p => p.id === id);


  if (!product) return;


  const existing =
    cart.find(item => item.id === id);


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({

      ...product,

      quantity: 1

    });

  }


  saveCart();

  updateCart();


  openCart();

}


// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(id) {

  cart =
    cart.filter(item => item.id !== id);


  saveCart();

  updateCart();

}


// ==========================================
// UPDATE CART
// ==========================================

function updateCart() {

  cartItems.innerHTML = "";


  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        YOUR BAG IS EMPTY.
      </div>
    `;

  }


  let total = 0;

  let count = 0;


  cart.forEach(item => {

    total += item.price * item.quantity;

    count += item.quantity;


    const div =
      document.createElement("div");


    div.className = "cart-item";


    div.innerHTML = `

      <div>

        <h4>${item.name}</h4>

        <small>
          ${item.quantity} × ${item.price} DH
        </small>

      </div>

      <button
        class="remove-btn"
        onclick="removeFromCart(${item.id})"
      >
        REMOVE
      </button>

    `;


    cartItems.appendChild(div);

  });


  cartCount.textContent = count;

  cartTotal.textContent =
    `${total} DH`;

}


// ==========================================
// OPEN CART
// ==========================================

function openCart() {

  cartPanel.classList.add("active");

  overlay.classList.add("active");

}


function closeCart() {

  cartPanel.classList.remove("active");

  overlay.classList.remove("active");

}


document
  .getElementById("cartBtn")
  .addEventListener("click", openCart);


document
  .getElementById("closeCart")
  .addEventListener("click", closeCart);


overlay.addEventListener(
  "click",
  closeCart
);


// ==========================================
// CHECKOUT
// ==========================================

const checkoutModal =
  document.getElementById("checkoutModal");


document
  .getElementById("checkoutBtn")
  .addEventListener("click", () => {

    if (cart.length === 0) {

      alert("Your bag is empty.");

      return;

    }

    checkoutModal.classList.add("active");

  });


document
  .getElementById("closeCheckout")
  .addEventListener("click", () => {

    checkoutModal.classList.remove("active");

  });


// ==========================================
// ORDER
// ==========================================

document
  .getElementById("checkoutForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();


    const name =
      document.getElementById("customerName").value;

    const phone =
      document.getElementById("customerPhone").value;

    const city =
      document.getElementById("customerCity").value;

    const address =
      document.getElementById("customerAddress").value;


    const order = {

      id:
        "RUUL-" +
        Date.now(),

      customer: {

        name,
        phone,
        city,
        address

      },

      products: cart,

      total:
        cart.reduce(
          (sum, item) =>
            sum + item.price * item.quantity,
          0
        ),

      payment:
        "Cash On Delivery",

      status:
        "Pending",

      date:
        new Date().toLocaleString()

    };


    const orders =
      JSON.parse(
        localStorage.getItem("ruulOrders")
      ) || [];


    orders.push(order);


    localStorage.setItem(
      "ruulOrders",
      JSON.stringify(orders)
    );


    alert(
      `ORDER CONFIRMED!\n\nYour order number is ${order.id}`
    );


    cart = [];

    saveCart();

    updateCart();

    checkoutModal.classList.remove("active");

    closeCart();

    this.reset();

  });


// ==========================================
// ADMIN
// ==========================================

const adminName =
  document.getElementById("adminName");

const adminPrice =
  document.getElementById("adminPrice");

const adminCategory =
  document.getElementById("adminCategory");


document
  .getElementById("addProduct")
  .addEventListener("click", () => {

    const name =
      adminName.value.trim();

    const price =
      Number(adminPrice.value);

    const category =
      adminCategory.value.trim();


    if (!name || !price || !category) {

      alert("Fill all fields.");

      return;

    }


    const newProduct = {

      id: Date.now(),

      name,

      price,

      category

    };


    products.push(newProduct);

    saveProducts();

    displayProducts();

    displayAdminProducts();


    adminName.value = "";

    adminPrice.value = "";

    adminCategory.value = "";

  });


// ==========================================
// ADMIN PRODUCT LIST
// ==========================================

function displayAdminProducts() {

  const container =
    document.getElementById("adminProducts");


  container.innerHTML = "";


  products.forEach(product => {

    const div =
      document.createElement("div");


    div.className = "admin-product";


    div.innerHTML = `

      <div>

        <strong>
          ${product.name}
        </strong>

        <small>
          — ${product.price} DH
        </small>

      </div>

      <button
        class="delete-product"
        onclick="deleteProduct(${product.id})"
      >
        DELETE
      </button>

    `;


    container.appendChild(div);

  });

}


// ==========================================
// DELETE PRODUCT
// ==========================================

function deleteProduct(id) {

  products =
    products.filter(
      product => product.id !== id
    );


  saveProducts();

  displayProducts();

  displayAdminProducts();

}


// ==========================================
// NEWSLETTER
// ==========================================

document
  .getElementById("newsletterForm")
  .addEventListener("submit", function(e) {

    e.preventDefault();

    alert("WELCOME TO RUUL.");

    this.reset();

  });


// ==========================================
// MOBILE MENU
// ==========================================

document
  .getElementById("menuBtn")
  .addEventListener("click", () => {

    const nav =
      document.querySelector(".nav");


    nav.style.display =
      nav.style.display === "flex"
        ? "none"
        : "flex";

  });


// ==========================================
// START
// ==========================================

displayProducts();

displayAdminProducts();

updateCart();
