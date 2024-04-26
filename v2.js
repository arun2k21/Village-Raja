ZOHO.CREATOR.init()
  .then((data) => {

    const outOfStockBtn = () => {
        return `<button class="btn btn-light text-dark disabled no-stock">Out Of Stock</button>`;
      }
    
    const products = async () => {
        config = {
          appName: "village-raja-order-management",
          reportName: "All_Products"
        }
        const productsArr = await ZOHO.CREATOR.API.getAllRecords(config);
        const itemArr = productsArr.data;
         document.querySelector("#api1").textContent = productsArr.code;
        let card = "";
        for (i = 0; i < itemArr.length; i++) {
          const product_img = `https://creator.zoho.in/publishapi/v2/info_nkcfoods/village-raja-order-management/report/All_Products/${itemArr[i].ID}/Item_Image/download?privatelink=xUYDukHBOx3MP6td5erphGJ1ZBrqa8gypZTZTBrK8Kyjh8KxQzFvYrXzGpg8ADqtjGSdrTUqV1SuNX0JzdvAnbSgXTeYaKOSTXOE`;
          card += `<div class="col-lg-6 col-md-6 col-12 mt-3 item-card main-${itemArr[i].ID}" category='${itemArr[i].Category.display_value}'  id='card-group${i}'>
                 <div class="row">
                   <div class="col-12">
                     <div class="card food-card border-0 light">
                       <div class="row">
                         <div class="col-8">
                           <div class="p-2 fw-bold item-name-0">
                             ${itemArr[i].Item_Name}
                           </div>
                           <div class="p-2 fw-bold item-id d-none">
                             ${itemArr[i].ID}
                           </div>
                           <div class="fw-bold px-2">₹${itemArr[i].Selling_Price}</div>
                           <p class="description px-2 mt-2 overflow-y-scroll">
                             ${itemArr[i].Description}
                           </p>
                         </div>
                         <div class="col-4">
                           <div class="card-body text-center"><img src="${product_img}" class="img-fluid rounded">
                           <div class="w-100 text-center mt-2 btn-type" id='btn-type${i}' >
                           ${(itemArr[i].Available_Stock > 0) ? `<button class='btn btn-secondary add-cart btn-sm shadow' btn-type='add' item-id="${itemArr[i].ID}">Add</button>` : `${outOfStockBtn()}`}
                           </div>
                           <small class="fw-bold text-nowrap">${itemArr[i].Available_Stock} in stock</small>
                           </div>
                         </div>
                       </div> 
                     </div>
                   </div>
                 </div>
               </div>`;
  
        }
        const card_group = document.querySelector("#product-card");
        card_group.innerHTML = card;
        await getCategory();
        searchItem(itemArr);
        return itemArr;
      }
  
  })