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
  let itemTotalPrice = document.getElementById(`item-total-price-${variantId}`)
  let totalPrice = document.getElementById('cart-total-price')
  let bottomBorder = document.getElementById('bottom-border')
  bottomBorder.classList = ''
  bottomBorder.classList.add('borderClose')
  totalPrice.classList = ''
  totalPrice.classList.add("shrinkNumber")
  itemTotalPrice.innerHTML = ''
  await fetchCartChange(variantId, qtyChange, itemTotalPrice)

  let data = cartData
  let upDatedItem = cartData.items.find(obj => obj.variant_id == variantId)

  if(qtyChange == 0){
    removeTableRow(variantId)
    updateTotalPrice(data.total_price, totalPrice)  
    if(data.item_count == 0) {
      location.reload() 
    }
    } else {
      console.log('in changeQty function', data)
      updateItemQuantity(variantId, qtyChange)
      updateItemTotalPrice(itemTotalPrice, upDatedItem.final_line_price)
      updateTotalPrice(data.total_price, totalPrice)  
    }
    bottomBorder.classList = ''
    bottomBorder.classList.add('borderOpen')  
}

async function removeFromCart(variantId){
  let totalPrice = document.getElementById('cart-total-price')
  let bottomBorder = document.getElementById('bottom-border')
  bottomBorder.classList = ''
  bottomBorder.classList.add('borderClose')
  totalPrice.classList = ''
  totalPrice.classList.add("shrinkNumber")

  await fetchCartChange(variantId, 0)

  let data = cartData

  console.log('in removeFromCart function', data)

  if(data.item_count == 0){
    location.reload() 
  } else {
    removeTableRow(variantId)
    updateTotalPrice(data.total_price, totalPrice)  
  }
  bottomBorder.classList = ''
  bottomBorder.classList.add('borderOpen')  
}

async function fetchCartChange(variantId, quantity){
  let itemPriceSpinner = document.getElementById(`spinner-${variantId}`)
  itemPriceSpinner.style.display = "block"


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
    itemPriceSpinner.style.display = "none"
    //totalPriceSpinner.style.display = "none"
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

function updateItemTotalPrice(itemTotalPrice, price){
  let formatedPrice = formatPrice(price)
  itemTotalPrice.innerHTML = formatedPrice
}

function updateTotalPrice(price, totalPriceEl){
  let formatedPrice = formatPrice(price)
  totalPriceEl.classList = ''
  totalPriceEl.innerHTML = formatedPrice
  totalPriceEl.classList.add('growNumber')
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
