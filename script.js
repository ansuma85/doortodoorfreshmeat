let cart = [];
let orderCounter = 1;

const products = [
  {name:"Smoked Pork(Raw)",price:450,image:"https://i.postimg.cc/QMyQCPkR/Smoked-pork.jpg",available:false},
  {name:"Desi Chicken(Raw)",price:550,image:"https://i.postimg.cc/fbTCJY4t/Desi-Chicken.jpg",available:true},
  {name:"Broiler Chicken(Raw)",price:280,image:"https://i.postimg.cc/rygHjyJ9/Chicken-Broiler.jpg",available:true}
];

const container=document.getElementById("products");

products.forEach(product=>{
container.innerHTML+=`
<div class="card">
<img src="${product.image}" alt="${product.name}">
<h2>${product.name}</h2>
<p>₹${product.price}/kg</p>

<select id="qty-${product.name}">
<option value="0.25">250 g</option>
<option value="0.5">500 g</option>
<option value="0.75">750 g</option>
<option value="1">1 kg</option>
<option value="1.25">1.25 kg</option>
<option value="1.5">1.5 kg</option>
<option value="2">2 kg</option>
<option value="2.5">2.5 kg</option>
<option value="3">3 kg</option>
<option value="4">4 kg</option>
<option value="5">5 kg</option>
<option value="6">6 kg</option>
<option value="7">7 kg</option>
<option value="8">8 kg</option>
<option value="9">9 kg</option>
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

function updateCart(){
document.getElementById("cartCount").innerText=cart.length;
let html="",total=0;
if(cart.length===0){
html="Your cart is empty.";
}else{
cart.forEach((item,index)=>{
html+=`<div style="margin-bottom:10px;">
<strong>${item.name}</strong><br>
${item.qty} kg - ₹${item.price}
<button onclick="removeItem(${index})">❌</button>
</div>`;
total+=item.price;
});
}
const deliveryCharge = 20;
const grandTotal = total + deliveryCharge;

html += `
<hr>
<p><strong>Items Total:</strong> ₹${total}</p>
<p><strong>Delivery Charge:</strong> ₹${deliveryCharge}</p>
<hr>
<h3>Grand Total: ₹${grandTotal}</h3>
`;
document.getElementById("cartItems").innerHTML=html;
document.getElementById("cartTotal").innerText=total;
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

document.getElementById("orderBtn").onclick = async function () {

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone || !address) {
        alert("Please fill Name, Phone Number and Delivery Address.");
        return;
    }

    const orderId = generateOrderId();
    const date = new Date().toLocaleString();

    let itemsTotal = 0;
    const deliveryCharge = 20;
    let products = "";

    let message = `🥩 Door To Door Fresh Meat

Order ID: ${orderId}

Customer: ${name}
Phone: ${phone}
Address: ${address}

Order Details:

`;

    cart.forEach(item => {
        products += `${item.name} (${item.qty} kg) - ₹${item.price}\n`;
        message += `• ${item.name} (${item.qty} kg) - ₹${item.price}\n`;
        itemsTotal += item.price;
    });

    const grandTotal = itemsTotal + deliveryCharge;

    message += `
Items Total: ₹${itemsTotal}
Delivery Charge: ₹${deliveryCharge}
Grand Total: ₹${grandTotal}

Thank you for ordering with Door To Door Fresh Meat.`;

    // Save to Google Sheet
    fetch("https://script.google.com/macros/s/AKfycbzS-fgday49ir-iBrjfyg7ZUrgdf7zfFURCVrDqJHQo3mmNCdVpRjRMM_C4WFZIQOKWbQ/exec", {
        method: "POST",
        body: JSON.stringify({
            orderId: orderId,
            date: date,
            customerName: name,
            phone: phone,
            address: address,
            products: products,
            itemsTotal: itemsTotal,
            deliveryCharge: deliveryCharge,
            grandTotal: grandTotal,
            status: "Pending"
        })
    });

    window.open(
        "https://wa.me/919678601494?text=" + encodeURIComponent(message),
        "_blank"
    );

    cart = [];
    updateCart();

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";

    document.getElementById("cartPanel").classList.remove("show");
};