let cart = [];
let orderCounter = 1;

const products = [
  {name:"Smoked Pork",price:550,image:"https://i.postimg.cc/QMyQCPkR/Smoked-pork.jpg",available:true},
  {name:"Smoked Pork with Bamboo Shoot (Ready to Eat)",price:100,image:"https://i.postimg.cc/QMyQCPkR/Smoked-pork.jpg",available:true},
  {name:"Desi Chicken",price:550,image:"https://i.postimg.cc/fbTCJY4t/Desi-Chicken.jpg",available:false},
  {name:"Broiler Chicken",price:280,image:"https://i.postimg.cc/rygHjyJ9/Chicken-Broiler.jpg",available:false}
];

const container=document.getElementById("products");

products.forEach(product=>{
container.innerHTML+=`
<div class="card">
<img src="${product.image}" alt="${product.name}">
<h2>${product.name}</h2>
<p>₹${product.price}/kg</p>

<select id="qty-${product.name}">
<option value="0.5">0.5 kg</option>
<option value="1">1 kg</option>
<option value="1.5">1.5 kg</option>
<option value="2">2 kg</option>
<option value="2.5">2.5 kg</option>
<option value="3">3 kg</option>
<option value="3.5">3.5 kg</option>
<option value="4">4 kg</option>
<option value="4.5">4.5 kg</option>
<option value="5">5 kg</option>
<option value="5.5">5.5 kg</option>
<option value="6">6 kg</option>
<option value="6.5">6.5 kg</option>
<option value="7">7 kg</option>
<option value="7.5">7.5 kg</option>
<option value="8">8 kg</option>
<option value="8.5">8.5 kg</option>
<option value="9">9 kg</option>
<option value="9.5">9.5 kg</option>
<option value="10">10 kg</option>
</select>

${product.available
?`<button onclick="addToCart('${product.name}',${product.price},document.getElementById('qty-${product.name}').value)">Add to Cart</button>`
:`<button disabled>Out of Stock</button>`}
</div>`;
});

function addToCart(name,price,qty){
cart.push({name:name,qty:parseFloat(qty),price:price*parseFloat(qty)});
updateCart();
alert(name+" added to cart!");
}

function updateCart() {
    document.getElementById("cartCount").innerText = cart.length;

    let html = "";
    let total = 0;

    if (cart.length === 0) {
        html = "Your cart is empty.";
    } else {
        cart.forEach((item, index) => {
            html += `
            <div style="margin-bottom:10px;">
                <strong>${item.name}</strong><br>
                ${item.qty} kg - ₹${item.price}
                <button onclick="removeItem(${index})">❌</button>
            </div>`;
            total += item.price;
        });
    }

    document.getElementById("cartItems").innerHTML = html;
    document.getElementById("cartTotal").innerText = total;

  

    const grandTotal = total + 20;
    document.getElementById("grandTotal").innerText = grandTotal;
}

function removeItem(index){
cart.splice(index,1);
updateCart();
}

document.getElementById("cartBtn").onclick=()=>document.getElementById("cartPanel").classList.add("show");
document.getElementById("closeCart").onclick=()=>document.getElementById("cartPanel").classList.remove("show");

function generateOrderId(){
const d=new Date();
return `FM-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${String(orderCounter++).padStart(3,"0")}`;
}

document.getElementById("orderBtn").onclick=function(){
if(cart.length===0){alert("Your cart is empty.");return;}

const name=document.getElementById("customerName").value.trim();
const phone=document.getElementById("customerPhone").value.trim();
const address=document.getElementById("customerAddress").value.trim();

if(!name||!phone||!address){
alert("Please fill Name, Phone Number and Delivery Address.");
return;
}
const orderId = generateOrderId();
let total=0;
let message=`🥩 Door To Door Fresh Meat

Order ID: ${orderId}

Customer: ${name}
Phone: ${phone}
Address: ${address}

Order Details:
`;

cart.forEach(item=>{
message+=`• ${item.name} (${item.qty} kg) - ₹${item.price}\n`;
total+=item.price;
});

message += `
Items Total: ₹${total}
Delivery Charge: ₹20
Grand Total: ₹${total + 20}

Thank you for ordering with Door To Door Fresh Meat.`;

window.open("https://wa.me/919678601494?text="+encodeURIComponent(message),"_blank");

const date = new Date().toLocaleString();

let products = "";
cart.forEach(item => {
  products += `${item.name} (${item.qty} kg) - ₹${item.price}\n`;
});

const itemsTotal = total;
const deliveryCharge = 20;
const grandTotal = itemsTotal + deliveryCharge;

fetch("https://script.google.com/macros/s/AKfycbzS-fgday49ir-iBrjfyg7ZUrgdf7zfFURCVrDqJHQo3mmNCdVpRjRMM_C4WFZIQOKWbQ/exec", {
  method: "POST",
  body: new URLSearchParams({
    orderId: orderId,
    date: date,
    customerName: name,
    phone: phone,
    address: address,
    products: products,
    itemsTotal: itemsTotal,
    deliveryCharge: deliveryCharge,
    grandTotal: grandTotal
  })
})
.then(r => r.json())
.then(data => console.log("Order saved:", data))
.catch(err => console.error(err));
cart=[];
updateCart();
document.getElementById("customerName").value="";
document.getElementById("customerPhone").value="";
document.getElementById("customerAddress").value="";
document.getElementById("cartPanel").classList.remove("show");
};
