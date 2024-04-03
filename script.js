ZOHO.CREATOR.init()
  .then((data) => {

    // var login_user = ZOHO.CREATOR.UTIL.getInitParams();

    const products = async (category) => {
      let filter = "Item_Name != null";
      config = {
        appName: "village-raja-order-management",
        reportName: "All_Products",
        criteria: filter,
        page: "1",
        pageSize: "200"
      }

      const productsArr = await ZOHO.CREATOR.API.getAllRecords(config);
      const itemArr = productsArr.data;
      let card = "";
      for (i = 0; i < itemArr.length; i++) {
        const product_img = `https://creator.zoho.in/publishapi/v2/info_nkcfoods/village-raja-order-management/report/All_Products/${itemArr[i].ID}/Item_Image/download?privatelink=xUYDukHBOx3MP6td5erphGJ1ZBrqa8gypZTZTBrK8Kyjh8KxQzFvYrXzGpg8ADqtjGSdrTUqV1SuNX0JzdvAnbSgXTeYaKOSTXOE`;
        card += `<div class="col-lg-6 col-md-6 col-12 mt-3" id='card-group${i}'>
               <div class="row">
                 <div class="col-12">
                   <div class="card food-card border-0 light">
                     <div class="row">
                       <div class="col-8">
                         <div class="p-2 fw-bold item-name-0">
                           ${itemArr[i].Item_Name}
                         </div>
                         <div class="fw-bold px-2">₹${itemArr[i].Selling_Price}</div>
                         <p class="description px-2 mt-2 overflow-y-scroll">
                           ${itemArr[i].Description}
                         </p>
                       </div>
                       <div class="col-4">
                         <div class="card-body text-center"><img src="${product_img}" class="img-fluid rounded">
                         <div class="w-100 text-center mt-2" id='btn-type${i}' >
                         <button class="btn btn-secondary add-cart btn-sm shadow" btn-type="add" index-no="${i}" id='btn-${i}'>Add</button>
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
      await searchItem(itemArr);
      return itemArr;
    }


    //  Add Item to cart


    const item_resp = products().then(itemArr => {
      document.addEventListener("click", (event) => {

        const i = event.target.getAttribute("index-no");
        const btn_type = event.target.getAttribute("btn-type");
        if (i) {
          if (btn_type == "add") {
            const rangeBtn = `<div class="quantity text-white d-flex justify-content-center">
                  <button class="border-0 px-2 add-cart dark rounded-start text-white" index-no="${i}" id='decrease-${i}'>-</button>
                  <div class="p-1 px-2 dark h-100" id='qty${i}' >1</div>
                  <button class="border-0 px-2 add-cart dark rounded-end text-white" index-no="${i}" id='increase-${i}'>+</button>
              </div>`;
            const btnType = document.querySelector(`#btn-type${i}`);
            btnType.innerHTML = rangeBtn;
            const cartItem = `<div class="row align-items-center">
              <div class="p-1 col-8">${itemArr[i].Item_Name}</div>
              <div class="p-1 col-2"><div class="w-100 text-center align-items-center">
                <div class="quantity text-white d-flex justify-content-center">
                    <button class="border-0 px-2 add-cart dark rounded-start text-white" index-no="${i}" id='decrease-cart-${i}'>-</button>
                    <div class="p-1 px-2 dark h-100" id="qty-cart-${i}">1</div>
                    <button class="border-0 px-2 add-cart dark rounded-end text-white" index-no="${i}" id='increase-cart-${i}'>+</button>
                </div>
              </div></div>
              <div class="p-1 col-2"><div class="text-end" id="sub-total-${i}">₹${itemArr[i].Selling_Price}</div></div>  
            </div>`;
            const list_group = document.querySelector(".list-group");
            list_group.classList.remove("d-none");
            const list_item = document.createElement("li");
            list_item.className = "list-group-item align-items-center";
            list_item.id = `list-item-${i}`;
            list_item.innerHTML = cartItem;
            list_group.appendChild(list_item);
          }
          else {
            const price = itemArr[i].Selling_Price;
            const item_price = document.querySelector(`#sub-total-${i}`);
            const crnt_qty = document.querySelector(`#qty${i}`);
            const cart_qty = document.querySelector(`#qty-cart-${i}`);
            if (crnt_qty) {
              let qty = crnt_qty.textContent;
              if (qty > 0) {
                if (event.target.id == `increase-${i}` || event.target.id == `increase-cart-${i}`) {
                  qty++;
                  crnt_qty.textContent = qty;
                  cart_qty.textContent = qty;
                  item_price.textContent = qty * parseFloat(price);
                }
                else if (event.target.id == `decrease-${i}` || event.target.id == `decrease-cart-${i}`) {
                  if (qty > 1) {
                    qty--;
                    crnt_qty.textContent = qty;
                    cart_qty.textContent = qty;
                    item_price.textContent = qty * parseFloat(price);
                  }
                  else {
                    const item = document.querySelector(`#list-item-${i}`);
                    item.remove();
                    const btn = document.querySelector(`#btn-type${i}`);
                    const new_btn = `<button class="btn btn-secondary add-cart btn-sm shadow" btn-type="add" index-no="${i}" id='btn-${i}'>Add</button>`;
                    if (btn) {
                      btn.innerHTML = new_btn;
                    }
                  }

                }
              }
            }
          }
        }

      })
    });
    //  Qty Adjuster



    // Search Bar
    const searchItem = (itemArr) => {
      const search = document.querySelector("#search-input");
      const items = itemArr;
      search.addEventListener("input", () => {
        const search = document.querySelector("#search-input");
        const search_value = search.value.toLowerCase();
        const item_group = document.getElementsByClassName(`item-name-0`);
        for (let i = 0; i < item_group.length; i++) {
          const element = item_group[i];
          const text_value = element.textContent.toLowerCase();
          const product = document.querySelector(`#card-group${i}`);
          if (text_value.includes(search_value)) {
            product.classList.remove("d-none");
          }
          else {
            product.classList.add("d-none");
          }
        }
      })
    }

    // Category Filter

    const getCategory = async () => {
      config = {
        appName: "village-raja-order-management",
        reportName: "All_Categories",
      }
      const category_response = await ZOHO.CREATOR.API.getAllRecords(config);
      const cate_list = category_response.data;
      let cat_html = ``;
      let x = 0;
      cate_list.forEach(element => {
        x = x + 1;
        cat_html += `<div class="text-center category cursor-pointer" id="cat-${x}">
    <div class="cat rounded-circle"><img src="#" alt="" height="75" width="75" class="rounded-circle"></div>
    <div class="text-secondary fw-bold">${element.Category}</div>
  </div>`;
      });
      const cat_group = document.querySelector("#all-category");
      cat_group.innerHTML = cat_html;
    }






    // ZC Ends
  });