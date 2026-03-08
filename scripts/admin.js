import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getFirestore,
collection,
onSnapshot,
doc,
updateDoc,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCz_wE2NSLxus4xK1zOSNoEbge7tuStQec",
  authDomain: "menu-demo-5cd5e.firebaseapp.com",
  projectId: "menu-demo-5cd5e",
  storageBucket: "menu-demo-5cd5e.firebasestorage.app",
  messagingSenderId: "729842425180",
  appId: "1:729842425180:web:7535e31c4090cc70cff599"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pendingDiv = document.getElementById("pending");
const preparingDiv = document.getElementById("preparing");
const readyDiv = document.getElementById("ready");
const deliveredDiv = document.getElementById("delivered");

const ordersRef = query(collection(db, "orders"), orderBy("createdAt", "desc"))

onSnapshot(ordersRef, (snapshot) => {

pendingDiv.innerHTML = "";
preparingDiv.innerHTML = "";
readyDiv.innerHTML = "";
deliveredDiv.innerHTML = "";

snapshot.forEach((docSnap) => {

const order = docSnap.data();
const id = docSnap.id;

const itemsList = order.items.map(i =>
`${i.quantity}x ${i.name}`
).join("<br>");

let orderHTML = "";

    if (order.status === "delivered") {

        orderHTML = `
<div class="order">

<h3>#${id.slice(-5)}</h3>

<p><b>Cliente:</b> ${order.customer}</p>

<p>${itemsList}</p>

<p><b>$${order.total}</b></p>

</div>
`;

    } else {

        orderHTML = `
<div class="order">

<h3>#${id.slice(-5)}</h3>

<p><b>Cliente:</b> ${order.customer}</p>

<p>${itemsList}</p>

<p><b>$${order.total}</b></p>

<button onclick="updateStatus('${id}','preparing')">Preparar</button>
<button onclick="updateStatus('${id}','ready')">Listo</button>
<button onclick="updateStatus('${id}','delivered')">Entregado</button>

</div>
`;
}

if(order.status === "pending"){

pendingDiv.innerHTML += orderHTML;

}

else if(order.status === "preparing"){

preparingDiv.innerHTML += orderHTML;

}

else if(order.status === "ready"){

readyDiv.innerHTML += orderHTML;

    }
    
    else if(order.status === "delivered"){

deliveredDiv.innerHTML += orderHTML;

}

});

});

window.updateStatus = async function(orderId, status) {

  const orderRef = doc(db, "orders", orderId);

  await updateDoc(orderRef, {
    status: status
  });

};