ZOHO.CREATOR.init()
  .then((data) => {

    // var login_user = ZOHO.CREATOR.UTIL.getInitParams();

    const products = async (category) => {
      let filter ="Item_Name != null";
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
        const img_api = itemArr[i].Item_Image ? itemArr[i].Item_Image : "";
        const product_img = "https://creatorapp.zoho.in" + img_api;
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
                         <button class="btn btn-secondary add-cart btn-sm shadow" id='btn-${i}'>Add</button>
                         </div>
                         <small class="fw-bold text-nowrap">${itemArr[i].Available_Stock} in stock</small>
                         </div>
                       </div>
                     </div> 
                   </div>
                 </div>
               </div>
             </div>`;
        const card_group = document.querySelector("#product-card");
        card_group.innerHTML = card;
      }
      const add_cart = await addToCart(itemArr);
      const item_qty = await itemQty(itemArr);
      const search_item = await searchItem(itemArr);
    }
    products();

    //  Add Item to cart
    const addToCart = (itemArr) => {
      for (let i = 0; i < itemArr.length; i++) {
        const addBtn = document.querySelector(`#btn-${i}`);
        addBtn.addEventListener("click", () => {
          const rangeBtn = `<div class="quantity text-white d-flex justify-content-center">
                <button class="border-0 px-2 add-cart dark rounded-start text-white" id='decrease-${i}'>-</button>
                <div class="p-1 px-2 dark h-100" id='qty${i}' >1</div>
                <button class="border-0 px-2 add-cart dark rounded-end text-white" id='increase-${i}'>+</button>
            </div>`;
          const btnType = document.querySelector(`#btn-type${i}`);
          btnType.innerHTML = rangeBtn;
          const cartItem = `<div class="row align-items-center">
            <div class="p-1 col-8">${itemArr[i].Item_Name}</div>
            <div class="p-1 col-2"><div class="w-100 text-center align-items-center">
              <div class="quantity text-white d-flex justify-content-center">
                  <button class="border-0 px-2 add-cart dark rounded-start text-white">-</button>
                  <div class="p-1 px-2 dark h-100">1</div>
                  <button class="border-0 px-2 add-cart dark rounded-end text-white">+</button>
              </div>
            </div></div>
            <div class="p-1 col-2"><div class="text-end">₹${itemArr[i].Selling_Price}</div></div>  
          </div>`;
          const list_group = document.querySelector(".list-group");
          list_group.classList.remove("d-none");
          const list_item = document.createElement("li");
          list_item.className = "list-group-item align-items-center";
          list_item.innerHTML = cartItem;
          list_group.appendChild(list_item);

        })
      }
    }

    //  Qty Adjuster
    const itemQty = (itemArr) => {
      for (let i = 0; i < itemArr.length; i++) {

      }
    }
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

    const getCategory =async (itemArr)=>{
      config = {
        appName: "village-raja-order-management",
        reportName: "All_Categories",
      }
      const category_response = await ZOHO.CREATOR.API.getAllRecords(config);
      const cate_list = category_response.data;
      const dropdown = document.querySelector("#categories");
      let new_category = "";
      for (let i = 0; i < cate_list.length; i++) {
        const element = cate_list[i];
         new_category += `<li><a class="dropdown-item cursor-pointer" id="cat-${i}" >${element.Category}</a></li>`;
      }
      dropdown.innerHTML = new_category;
      await catgoryFilter(cate_list,itemArr);
    }


 




  });