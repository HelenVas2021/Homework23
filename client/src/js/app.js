import '../scss/styles.scss';


import { createCheckoutForm, createElement, createProductCard, updateProductPrice } from './helpers/domHelpers.js';
import {API_CATEGORIES_LIST, API_PRODUCTS_BY_CATEGORY_ID} from './urls.js';

let productsArr = [];
let currentProduct = {};

const changeSizeHandler = function(event) {
  const size = event.target.value; 
  if (size === 'big') {
    currentProduct.updatedPrice = currentProduct.price * 1.2;
  } else {
    currentProduct.updatedPrice = currentProduct.price;
  }

  updateProductPrice(currentProduct.updatedPrice);
}


 const changeToppingHandler = function(event) {
  const toppingName = event.target.value;
  const topping = currentProduct.available_toppings.find(topping => topping.name === toppingName);
  let totalPrice = currentProduct.updatedPrice + topping.price ;
  // currentProduct.updatedPrice = currentProduct.updatedPrice + topping.price;
  updateProductPrice(totalPrice);
}

const sendOrder =  function (){
  const userName = document.querySelector("input[name=client_name]");
  const productName = document.getElementById('product_name');
  const size = document.querySelectorAll("input[name=size]");
  const nameTopping = document.querySelectorAll("input[name=toppings]");
  const price = document.getElementById("total_price");
  let topping = '';
for(let i = 0; i< nameTopping.length; i++){
if(nameTopping[i].checked){
  topping = nameTopping[i].nextElementSibling.textContent.split(' ')[0];
}
if(userName.value ===""){
   return alert('Put the value');
}
}
  const data = {
    userName: userName.value,
    price: price.textContent,
    productName: productName.textContent,
    productSize: size[0].checked?size[0].value:size[1].value,
    nameToppings: topping,
      }
    const getAllData = JSON.stringify(data);
    console.log(sendData('http://localhost:5000/api/data-from-user',getAllData));
    console.log(data);
}

const sendData = async (url, data)=>{
  const response = await fetch(url,{
      method:'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json'
      },
  });
  
  if(!response.ok){
    throw new Error(`Error for link ${url}, status ${response}`)
  }
  return await response.json();

}

const clickBuyHandler = function(event) {
  const productId = event.target.getAttribute('data-product-id'); // ok
  currentProduct = productsArr.find(product => product.id === productId);
  currentProduct.updatedPrice = currentProduct.price;
  createCheckoutForm(currentProduct, changeSizeHandler, changeToppingHandler, sendOrder);
}

const menuItemClickHandler = function(event) {
  const currentId = event.target.getAttribute('data-menu-item');
  
  fetch(API_PRODUCTS_BY_CATEGORY_ID.replace(':category', currentId))
    .then(res => res.json())
    .then(products => {
      productsArr = products;

      document.querySelector('#content').innerHTML = '';
      for(let product of products) {
        createProductCard(product, clickBuyHandler);
      }

    })
}


// onload:
fetch(API_CATEGORIES_LIST)
  .then(res => res.json())
  .then(categories => {

    for(let category of categories) {
      createElement(
        'li',
        category.name, 
        {
          'data-menu-item': category.id
        },
        {
          click: menuItemClickHandler
        },
        '#menu ul'
      );
    }
  })