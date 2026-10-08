const products = [
  {id:1,name:"Volt Essential Tee",category:"Men",price:45000,img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L","XL"],desc:"A clean everyday essential with a premium feel and relaxed modern fit.",badge:"NEW"},
  {id:2,name:"Core Oversized Shirt",category:"Unisex",price:65000,img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L","XL"],desc:"A structured oversized shirt designed for effortless styling.",badge:"BEST SELLER"},
  {id:3,name:"Volt Tailored Set",category:"Women",price:125000,img:"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L"],desc:"A refined tailored set balancing sharp lines with comfortable movement.",badge:"NEW"},
  {id:4,name:"Statement Hoodie",category:"Unisex",price:85000,img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L","XL","XXL"],desc:"Heavyweight streetwear hoodie with a bold DE VOLT attitude.",badge:""},
  {id:5,name:"Minimal Cargo Pants",category:"Men",price:90000,img:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85",sizes:["30","32","34","36","38"],desc:"Functional cargo trousers with a contemporary silhouette.",badge:""},
  {id:6,name:"Volt Everyday Dress",category:"Women",price:78000,img:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L"],desc:"An understated statement piece designed for day-to-night wear.",badge:""},
  {id:7,name:"Classic Volt Cap",category:"Accessories",price:30000,img:"https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85",sizes:["OS"],desc:"Signature everyday cap finished with a clean DE VOLT mark.",badge:""},
  {id:8,name:"Premium Knit Polo",category:"Men",price:72000,img:"https://images.unsplash.com/photo-1625910513413-5fc45d8d9a04?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L","XL"],desc:"A polished knit polo for elevated casual dressing.",badge:"NEW"},
  {id:9,name:"Luxe Shoulder Bag",category:"Accessories",price:95000,img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",sizes:["OS"],desc:"A minimal statement bag made to complement the DE VOLT wardrobe.",badge:""},
  {id:10,name:"Relaxed Denim",category:"Women",price:88000,img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",sizes:["28","30","32","34"],desc:"Relaxed denim with an easy silhouette and everyday versatility.",badge:""},
  {id:11,name:"Signature Tracksuit",category:"Unisex",price:140000,img:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",sizes:["S","M","L","XL"],desc:"A complete off-duty set built for comfort and movement.",badge:"BEST SELLER"},
  {id:12,name:"Volt Leather Belt",category:"Accessories",price:38000,img:"https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=85",sizes:["M","L","XL"],desc:"A timeless finishing detail with a minimal branded buckle.",badge:""}
];

let cart = JSON.parse(localStorage.getItem("deVoltCart") || "[]");
let activeProduct = null;
let selectedSize = null;
let currentCategory = "All";

const money = n => "₦" + n.toLocaleString("en-NG");
const $ = s => document.querySelector(s);

function renderProducts(category=currentCategory, limit=12){
  const list = category==="All" ? products : products.filter(p=>p.category===category);
  $("#productGrid").innerHTML = list.slice(0,limit).map(p=>`
    <article class="product-card" onclick="openProduct(${p.id})">
      <div class="product-image" style="background-image:url('${p.img}')">
        ${p.badge ? `<span class="badge">${p.badge}</span>`:""}
      </div>
      <div class="product-info">
        <div><h3>${p.name}</h3><div class="product-meta">${p.category}</div></div>
        <p>${money(p.price)}</p>
      </div>
    </article>`).join("");
}

function openProduct(id){
  activeProduct = products.find(p=>p.id===id);
  selectedSize = activeProduct.sizes[0];
  $("#modalImage").style.backgroundImage=`url('${activeProduct.img}')`;
  $("#modalCategory").textContent=activeProduct.category;
  $("#modalName").textContent=activeProduct.name;
  $("#modalPrice").textContent=money(activeProduct.price);
  $("#modalDescription").textContent=activeProduct.desc;
  $("#sizePicker").innerHTML=activeProduct.sizes.map(s=>`<button class="size ${s===selectedSize?"selected":""}" onclick="selectSize('${s}')">${s}</button>`).join("");
  $("#productModal").classList.add("show");
}
function selectSize(size){
  selectedSize=size;
  document.querySelectorAll(".size").forEach(b=>b.classList.toggle("selected",b.textContent===size));
}
$("#closeProduct").onclick=()=>$("#productModal").classList.remove("show");
$("#modalAdd").onclick=()=>{ addToCart(activeProduct.id,selectedSize); $("#productModal").classList.remove("show"); openCart(); };

function addToCart(id,size){
  const found=cart.find(x=>x.id===id&&x.size===size);
  if(found) found.qty++;
  else cart.push({id,size,qty:1});
  saveCart(); showToast("Added to your bag");
}
function saveCart(){localStorage.setItem("deVoltCart",JSON.stringify(cart));renderCart();updateCartCount();}
function updateCartCount(){$("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);}
function renderCart(){
  if(!cart.length){$("#cartItems").innerHTML='<div class="empty-cart">Your bag is empty.<br>Discover something new.</div>';$("#cartSubtotal").textContent="₦0";return;}
  $("#cartItems").innerHTML=cart.map((item,i)=>{
    const p=products.find(x=>x.id===item.id);
    return `<div class="cart-item"><div class="cart-thumb" style="background-image:url('${p.img}')"></div>
      <div><h4>${p.name}</h4><p>${money(p.price)} · Size ${item.size}</p>
      <div class="qty"><button onclick="changeQty(${i},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${i},1)">+</button></div></div>
      <button class="remove" onclick="removeCart(${i})">Remove</button></div>`;
  }).join("");
  $("#cartSubtotal").textContent=money(cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0));
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);saveCart();}
function removeCart(i){cart.splice(i,1);saveCart();}
function openCart(){$("#cartDrawer").classList.add("open");$("#drawerBackdrop").classList.add("show");}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#drawerBackdrop").classList.remove("show");}
$("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeCart;$("#drawerBackdrop").onclick=closeCart;

document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  currentCategory=btn.dataset.category;renderProducts();
});
$("#loadMore").onclick=()=>{renderProducts(currentCategory,50);$("#loadMore").style.display="none";};

$("#searchBtn").onclick=()=>{$("#searchOverlay").classList.add("show");$("#searchInput").focus();};
$("#closeSearch").onclick=()=>$("#searchOverlay").classList.remove("show");
$("#searchInput").oninput=e=>{
  const q=e.target.value.toLowerCase().trim();
  const matches=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q)).slice(0,7);
  $("#searchResults").innerHTML=q ? (matches.length?matches.map(p=>`<div class="search-result" onclick="openProduct(${p.id});$('#searchOverlay').classList.remove('show')">${p.name} — ${money(p.price)}</div>`).join(""):"<p style='padding-top:20px;color:#777'>No products found.</p>"):"";
};

$("#checkoutBtn").onclick=()=>{
  if(!cart.length){showToast("Your bag is empty");return}
  closeCart();$("#checkoutTotal").textContent=$("#cartSubtotal").textContent;$("#checkoutModal").classList.add("show");
};
$("#closeCheckout").onclick=()=>$("#checkoutModal").classList.remove("show");
$("#checkoutForm").onsubmit=e=>{
  e.preventDefault();cart=[];saveCart();$("#checkoutModal").classList.remove("show");
  showToast("Order received — thank you for shopping DE VOLT");
};
$("#newsletterForm").onsubmit=e=>{e.preventDefault();e.target.reset();showToast("You're on the DE VOLT list");};

$("#menuBtn").onclick=()=>$("#mobileMenu").classList.add("open");
$("#closeMenu").onclick=()=>$("#mobileMenu").classList.remove("open");
document.querySelectorAll(".mobile-menu a").forEach(a=>a.onclick=()=>$("#mobileMenu").classList.remove("open"));

function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2500);}
document.addEventListener("keydown",e=>{if(e.key==="Escape"){document.querySelectorAll(".modal,.search-overlay").forEach(x=>x.classList.remove("show"));closeCart();}});
renderProducts();renderCart();updateCartCount();
