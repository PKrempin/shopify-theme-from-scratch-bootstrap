'use strict';

const productGrid = document.getElementById("product_card_grid")
const alertTarget = document.getElementById("alert-target")

console.log(alertTarget)

productGrid.addEventListener("click", function(e){
    let productId = e.target.closest(".product_card_container").id
    if(e.target.id == `product-btn-${productId}`){
        const addToCartBtn = document.getElementById(`product-btn-${productId}`)
        const form = document.getElementById(`collection-add-to-cart-form-${productId}`) 
        addToCartBtn.style.display = "none"
        form.classList.add("slideDown")

    } else if (e.target.id == `add-to-cart-${productId}`){
        let variant = document.getElementById(`productSelect-${productId}`).value
        let quantity = document.getElementById(`${productId}-quantity`).value
        let formAddToCartBtn = document.getElementById(`add-to-cart-${productId}`)
        let updateCartBtn = document.getElementById(`update-cart-${productId}`)
        let body = {
            id: variant,
            quantity: quantity
        }

        addToCart(body)
        
        formAddToCartBtn.style.display = "none"
        updateCartBtn.style.display = "block"

    } else if (e.target.id == `update-cart-${productId}`){
        let variant = document.getElementById(`productSelect-${productId}`).value
        let quantity = document.getElementById(`${productId}-quantity`).value
        
        let body = {
            id: variant,
            quantity: quantity
        }

        updateCart(body)

    }
})

async function addToCart(theBody){
    await fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(theBody)
    }).then((response) => {
        return response.text()
    })
    .then((state) => {
        let theRes = JSON.parse(state)
        console.log(theRes)
        alertFunc("Added To Cart!", "success")
    })
    .catch((error) => {
        console.error('Error', error)
    })
}

async function updateCart(theBody){
    await fetch(window.Shopify.routes.root + 'cart/change.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(theBody)
    }).then((response) => {
        return response.text()
    })
    .then((state) => {
        let theRes = JSON.parse(state)
        console.log(theRes)
        alertFunc("Updated Cart!", "success")
    })
    .catch((error) => {
        console.error('Error', error)
    })
}

const alertFunc = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="fadeInOut alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertTarget.append(wrapper)

    const targetChild = alertTarget.firstChild
    
    setTimeout(()=>{
        alertTarget.removeChild(targetChild)
    }, 4000)
    
  }

