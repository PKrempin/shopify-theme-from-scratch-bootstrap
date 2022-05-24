/*
function plusOne(theId){
    let item = document.getElementById(`theitem-${theId}`)
    let itemId = theId.toString()
    let itemAdd = parseInt(item.innerHTML) +  1
    let itemQuantity = itemAdd.toString()

    let itemData = {
        'id': itemId,
        'quantity': itemQuantity
    }


    console.log(itemData)

    fetch(window.Shopify.routes.root + 'cart/change.js', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(itemData)
      })
      .then(response => {
        item.innerHTML = itemQuantity
        return console.log(response.json());
      })
      .catch((error) => {
        console.error('Error:', error);
      });        
}
*/

/*
function plusOne(theId){

  
  

  let item = document.getElementById(`theitem-${theId}`)
  let itemId = theId.toString()
  let itemAdd = parseInt(item.innerHTML) +  1
  let itemQuantity = itemAdd.toString()

  let itemData = {
      'id': itemId,
      'quantity': itemQuantity
  }

  fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify(itemData)
    })
    .then(response => {
      item.innerHTML = itemQuantity
      return console.log(response.json());
    })
    .catch((error) => {
      console.error('Error:', error);
    });        
}



function minusOne(theId){
  let item = document.getElementById(`theitem-${theId}`)
  let itemId = theId.toString()
  let itemMinus = parseInt(item.innerHTML) -  1
  let itemQuantity = itemMinus.toString()

  let itemData = {
      'id': itemId,
      'quantity': itemQuantity
  }

  console.log(item.parentNode.parentNode.parentNode.parentNode)

    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify(itemData)
    })
    .then(response => {
      if(itemMinus == 0){
        window.location.href = `/cart/change?id=${theId}&quantity=0`;
      } else {
        item.innerHTML = itemQuantity
        return console.log(response.json());
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
*/

/*
1. Pull cart data for use within this javascript file

2. Create a callback function that updates the javascript cart data when a product 
  count is changed or a product is removed from the cart.

3. Impliment product remove functionality that both properly removes the product from 
  the shopify backend a removes the product representation in the UI

4. Impliment product count change feature that properly executes like the feature above.
  It must also check for a product count of zero which would be treated like a removed
  product. 
*/

// Get Cart Data
var cartData

getCartData()

async function getCartData(){
  await fetch(window.Shopify.routes.root + 'cart.js', {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
  })
  .then(response => {
    return response.text()
    }
  )
  .then((state) => {
    cartData = JSON.parse(state);
    console.log(cartData)      
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function changeQty(variantId, operation){
  let item = cartData.items.find(obj => obj.variant_id == variantId)
  let qtyChange = operation == "plus" ? item.quantity + 1 : item.quantity - 1

  await fetchCartChange(variantId, qtyChange)

  let data = cartData
  let upDatedItem = cartData.items.find(obj => obj.variant_id == variantId)

  if(qtyChange == 0){
    removeTableRow(variantId)
    if(data.item_count == 0) {
      location.reload() 
    }
    } else {
      console.log('in changeQty function', data)
      updateItemQuantity(variantId, qtyChange)
      updateItemTotalPrice(variantId, upDatedItem.final_line_price)
      updateTotalPrice(data.total_price)  
    }
}

async function minusOne(variantId){
  let item = cartData.items.find(obj => obj.variant_id == variantId)
  let minusOne = item.quantity - 1
  
  await fetchCartChange(variantId, minusOne)

  if(qtyChange == 0){
    removeTableRow(variantId)
    updateTotalPrice(data.total_price)  
  }

  let data = cartData

  console.log('in minusOne function', data)
  updateItemQuantity(variantId, minusOne)
  updateItemTotalPrice(variantId, upDatedItem.final_line_price)
  updateTotalPrice(data.total_price)
}

async function removeFromCart(variantId){
  await fetchCartChange(variantId, 0)

  let data = cartData

  console.log('in removeFromCart function', data)

  if(data.item_count == 0){
    location.reload() 
  } else {
    removeTableRow(variantId)
    updateTotalPrice(data.total_price)  
  }
}

async function fetchCartChange(variantId, quantity){
  let itemData = {
    "id": variantId,
    "quantity": quantity
  }

  await fetch(window.Shopify.routes.root + 'cart/change.js', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(itemData)
  })
  .then(response => {
    return response.text()
    }
  )
  .then((state) => {
    cartData = JSON.parse(state);
    //console.log('returned from cart change:', cartData)
  })
  .catch((error) => {
    console.error('Error', error);
  })
}



// Utilities //

function updateItemQuantity(variantId, quantity){
  let itemQuantityEl = document.getElementById(`theitem-${variantId}`)
  itemQuantityEl.innerHTML = quantity
}

function updateItemTotalPrice(id, price){
  let itemTotalPrice = document.getElementById(`item-total-price-${id}`)
  let formatedPrice = formatPrice(price)
  itemTotalPrice.innerHTML = formatedPrice
}

function updateTotalPrice(price){
  let totalPrice = document.getElementById('cart-total-price')
  let formatedPrice = formatPrice(price)
  totalPrice.innerHTML = formatedPrice
}

function formatPrice(price){
  let priceArr = price.toString().split('')
  let frontEnd = priceArr.slice(0, -2)
  let backEnd = priceArr.splice(-2, 2)
  let formatedPrice = [...frontEnd, ['.'], ...backEnd].join("")

  return `$${formatedPrice}`
}

function removeTableRow(variantId){
  let tableRow = document.getElementById(`table-row-${variantId}`)
  tableRow.remove()
}




    



/*
BUNDLED SECTION RENDERING PLAYGROUND
Going to attempt impliemnting once theme is published.

function plusOne(theId){
  let item = document.getElementById(`theitem-${theId}`)
  let itemId = theId.toString()
  let itemAdd = parseInt(item.innerHTML) +  1
  let itemQuantity = itemAdd.toString()

  let itemData = JSON.stringify({
    id:itemId,
    quantity:itemQuantity,
    sections:["template--15974381191383__cart-items"],
    sections_url:"/cart"
    })
  

  fetch('https://pj-theme-from-scratch.myshopify.com/' + 'cart/change', {
      method: 'POST',
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: itemData
    })
    .then(response => {
      return response.text()
    })
    .then((state) => {
      const parsedState = JSON.parse(state);
      console.log(parsedState)
    })
    .catch((error) => {
      console.error('Error:', error);
    });        
}
*/
