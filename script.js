ZOHO.CREATOR.init()
  .then((data) => {

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
                <div class="p-1 col-8 item-name">${itemArr[i].Item_Name}</div>
                <div class="p-1 col-2"><div class="w-100 text-center align-items-center">
                  <div class="quantity text-white d-flex justify-content-center">
                      <button class="border-0 px-2 add-cart dark rounded-start text-white" index-no="${i}" id='decrease-cart-${i}'>-</button>
                      <div class="p-1 px-2 dark h-100 qty" id="qty-cart-${i}">1</div>
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
                    const incr_total = qty * parseFloat(price);
                    item_price.textContent = `₹ ${incr_total ? incr_total : 0.00}`;
                  }
                  else if (event.target.id == `decrease-${i}` || event.target.id == `decrease-cart-${i}`) {
                    if (qty > 1) {
                      qty--;
                      crnt_qty.textContent = qty;
                      cart_qty.textContent = qty;
                      const dcrs_total = qty * parseFloat(price);
                      item_price.textContent = `₹ ${dcrs_total ? dcrs_total : 0.00}`;
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
             total_amount();
          }
        

      })
    });

    const total_amount = () => {
      const list_total = document.getElementsByClassName("list-group-item");
      let x = 0;
      let carts = 0;
      for (let i = 0; i < list_total.length; i++) {
        carts = carts + 1;
        const sub_total = document.querySelector(`#sub-total-${i}`);
        if (sub_total) {
          const total_amount = parseFloat(removeCurrencySymbol(sub_total.textContent));
          x = x + total_amount;
        }
      }
      const cart_badge = document.querySelector(".cart-badge");
      cart_badge.classList.remove("d-none");
      cart_badge.textContent = carts;
      if (carts == 0) {
        cart_badge.classList.add("d-none");
      }
      const grand_total = document.querySelector("#grand-total");
      grand_total.textContent = `₹ ${x}`;
    }

    const removeCurrencySymbol = (numberString) => {
      // Replace any non-digit characters with an empty string
      return numberString.replace("₹", '');
    }

    // Update Cart to ZOHO

    const postCart = async () => {
      const login_user = await ZOHO.CREATOR.UTIL.getInitParams();
      const user_id = login_user.loginUser;
      if (user_id) {
        const config = {
          appName: "village-raja-order-management",
          reportName: "Franchise_Report",
          criteria: `User_Email == "${user_id}"`,
        }
        const franchise_response = await ZOHO.CREATOR.API.getAllRecords(config);
        if (franchise_response.code == 3000) {
          const list_total = document.getElementsByClassName("list-group-item");
          const franchise_obj = franchise_response.data[0];
          const grand_total = document.querySelector("#grand-total");
          const total_amount = grand_total.textContent;
          const total = total_amount ? parseFloat(removeCurrencySymbol(total_amount)) : 0.0;
          if (list_total.length > 0) {
            const config1 = {
              appName: "village-raja-order-management",
              reportName: "All_Item_Carts",
              criteria: `Branch_Name == ${franchise_obj.ID}`
            }

            formData = {
              "data": {
                "Branch_Name": franchise_obj.ID,
                "Total": total
              }
            }

            try {
              const get_rec = await ZOHO.CREATOR.API.getAllRecords(config1);
              if (get_rec.code == 3000) {
                const cart_obj = get_rec.data[0];
               const updateConfig = {
                  appName: "village-raja-order-management",
                  reportName : "All_Item_Carts",
                  id: cart_obj.ID,
                  data: formData
                }
                const updateRec = ZOHO.CREATOR.API.updateRecord(updateConfig);
                updateListItems(cart_obj.ID, list_total);
              }
            }
            catch {
              const addRec = {
                appName: "village-raja-order-management",
                formName: "Item_Cart",
                data: formData
              }
              const create_response = await ZOHO.CREATOR.API.addRecord(addRec);
              if (create_response.code == 3000) {
                await updateListItems(create_response.data.ID, list_total);
              }
            }
          }
        }
      }
    }

    

    const updateListItems = async (rec_id, cart_list) => {
      for (let i = 0; i < cart_list.length; i++) {
        const element = cart_list[i];
        const item_name = document.getElementsByClassName("item-name")[i].textContent;
        const qty = document.getElementsByClassName("qty")[i].textContent;
        const item_id = await getitem_id(item_name);
        config = {
          appName: "village-raja-order-management",
          reportName: "Item_Cart_Report",
          criteria: `Item_Cart == ${rec_id} && Item == ${item_id}`
        }

        formData = {
          "data": {
            "Item": item_id,
            "Quantity": qty,
            "Item_Cart": rec_id
          }
        }
        try {
          const tot_records = await ZOHO.CREATOR.API.getAllRecords(config);
          if (tot_records.code == 3000) {
            const record_id = tot_records.data[0];
            configAdd = {
              appName: "village-raja-order-management",
              reportName: "Item_Cart_Report",
              id: record_id.ID,
              data: formData
            }
            const update_rec = await ZOHO.CREATOR.API.updateRecord(configAdd);
          }
        }
        catch {
          config_item = {
            appName: "village-raja-order-management",
            reportName: "Item_Cart_Report",
            formName: "Cart_SF",
            data: formData
          }
          const add_rec = await ZOHO.CREATOR.API.addRecord(config_item);
        }
      }
    }

    const getCartFromZoho = async ()=>{
      const login_user = await ZOHO.CREATOR.UTIL.getInitParams();
      const user_id = login_user.loginUser;
      const config = {
        appName: "village-raja-order-management",
        reportName: "Franchise_Report",
        criteria: `User_Email == "${user_id}"`,
      }
      
      try{
        const franchise_response = await ZOHO.CREATOR.API.getAllRecords(config);
        if(franchise_response.code == 3000){
          const franchise_obj = franchise_response.data[0];
          if(franchise_obj){
            
          }
        }
      }
      catch(error){
        console.log(error);
      }
      
    }

    const getitem_id = async (item_name) => {
      config = {
        appName: "village-raja-order-management",
        reportName: "All_Products",
        criteria: `Item_Name == "${item_name}"`
      }
      const rec_obj = await ZOHO.CREATOR.API.getAllRecords(config);
      const rec_id = rec_obj.data[0];
      return rec_id.ID;
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
        const category_img = `https://creator.zoho.in/publishapi/v2/info_nkcfoods/village-raja-order-management/report/All_Categories/${element.ID}/Image/download?privatelink=8YaUO6vz9USP1e6bGH6jQpfXspUmJTfNGp1GHzBtHPQ08qgYCDj1n2ezamVk8EKuD8t3DJz6KWZ0TaENKHhFSzwhqHsWOmUtN3fw`;
        cat_html += `<div class="text-center category cursor-pointer" id="cat-${x}">
    <div class="cat rounded-circle"><img src="${element.Image?category_img:""}" alt="" height="75" width="75" class="rounded-circle"></div>
    <div class="text-secondary fw-bold">${element.Category}</div>
  </div>`;
      });
      const cat_group = document.querySelector("#all-category");
      cat_group.innerHTML = cat_html;
    }

    // ZC Ends
  });