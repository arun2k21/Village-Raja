ZOHO.CREATOR.init()
  .then((data) => {
    const createElementID = (item_id, type) => {
      if (type == "increase button") {
        return `vr_${item_id}_incrs`;
      }
      else if (type == "decrease button") {
        return `vr_${item_id}__dcrs`;
      }
      else if (type == "item name") {
        return `vr_${item_id}_item`;
      }
      else if (type == "cart group") {
        return `vr_${item_id}_${area}`;
      }
    }

    const getTotal = () => {
      const list_total = document.getElementsByClassName("list-group-item");
      let x = 0;
      let carts = 0;
      for (let i = 0; i < list_total.length; i++) {
        carts = carts + 1;
        const sub_total = list_total[i].querySelector(`.price`);
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
      return x;
    }

    const total_amount = () => {
      const total = getTotal();

      const grand_total = document.querySelector("#grand-total");
      grand_total.textContent = `₹ ${total}`;
    }
    const removeCurrencySymbol = (numberString) => {
      // Replace any non-digit characters with an empty string
      return numberString.replace("₹", '');
    }
    // Update Cart to ZOHO
    const getFranchiseDetails = async () => {
      const login_user = await ZOHO.CREATOR.UTIL.getInitParams();
      const user_id = login_user.loginUser;
      const config = {
        appName: "village-raja-order-management",
        reportName: "Franchise_Report",
        criteria: `User_Email == "${user_id}"`,
      }
      return await ZOHO.CREATOR.API.getAllRecords(config);
    }


    const range_btn = (item_id, i, qty) => {
      return `<div class="quantity text-white d-flex justify-content-center">
      <button class="border-0 px-2 add-cart dark rounded-start text-white dcrs-btn ${createElementID(item_id, "decrease button")}" item-id="${item_id}" id='decrease-${i}'>-</button>
      <div class="p-1 px-2 dark h-100 qty" id='qty${i}' >${qty ? qty : 1}</div>
      <button class="border-0 px-2 add-cart dark rounded-end text-white incrs-btn ${createElementID(item_id, "increase button")}" item-id="${item_id}" id='increase-${i}'>+</button>
  </div>`;
    }

    const cart_item = (item_name, price, qty, item_id) => {
      return `<div class="row align-items-center" id="cart-${item_id}">
      <div class="p-1 col-6 item-name" item-id="${item_id}">${item_name}</div>
      <div class="p-1 col-2"><div class="w-100 text-center align-items-center">
      ${range_btn(item_id, 0, qty)}
      </div></div>
      <div class="p-1 col-4"><div class="text-end price" id="sub-total-${i}">₹${price}</div></div>  
    </div>`;
    }

    const products = async () => {
      config = {
        appName: "village-raja-order-management",
        reportName: "All_Products"
      }
      try{
      const productsArr = await ZOHO.CREATOR.API.getAllRecords(config);
      const itemArr = productsArr.data;
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
     card_group.innerHTML = await card;
     
      return await itemArr;
    }
    catch(err){
      console.log(err);
    }
    }

    //  Add Item to cart

    const executeOrder = async () => {
      await products();
      await getCartFromZoho();
      await getCategory();
      searchItem(itemArr);
    }
    executeOrder();

    products().then(itemArr => {
      document.addEventListener("click", (event) => {
        const target_item_id = event.target.getAttribute("item-id");
        if (target_item_id) {
          const target_item = itemArr.filter(item => item.ID == target_item_id);
          const target_item_obj = target_item[0];
          const incrs_btn_class = createElementID(target_item_id, "increase button");
          const dcrs_btn_class = createElementID(target_item_id, "decrease button");
          const target_class_list = Array.from(event.target.classList);
          const btn_type = event.target.getAttribute("btn-type");
          if (btn_type == "add") {
            const item_card = document.getElementsByClassName("item-card");
            for (let j = 0; j < item_card.length; j++) {
              const element = item_card[j];
              const card_id = element.querySelector(".item-id");
              const cardid = card_id.textContent.trim();
              if (cardid == target_item_obj.ID) {
                const btn_set = element.querySelector(".btn-type");
                const button_range = range_btn(target_item_obj.ID, 0, target_item_obj.Quantity);
                btn_set.innerHTML = button_range;
                const cartItem = cart_item(target_item_obj.Item_Name, target_item_obj.Selling_Price, 1, target_item_obj.ID);
                const list_group = document.querySelector(".list-group");
                list_group.classList.remove("d-none");
                const list_item = document.createElement("li");
                list_item.className = "list-group-item align-items-center";
                list_item.innerHTML = cartItem;
                list_group.appendChild(list_item);
                total_amount();
                break;
              }
            }
          }
          if (target_class_list.includes(incrs_btn_class) || target_class_list.includes(dcrs_btn_class)) {
            const cart_id = `cart-${target_item_obj.ID}`;
            const listGroup = document.querySelector(".list-group");
            const li_item = listGroup.querySelector(`#${cart_id}`);
            const item_qty_obj = li_item.querySelector(".qty");
            const main_id = `main-${target_item_obj.ID}`;
            const mail_element = document.querySelector(`.${main_id}`);
            const main_qty_element = mail_element.querySelector(".qty");
            let item_qty = item_qty_obj.textContent ? parseInt(item_qty_obj.textContent) : 0;
            const price_element = li_item.querySelector(".price");
            const price = target_item_obj.Selling_Price ? parseFloat(target_item_obj.Selling_Price) : 0;
            if (target_class_list.includes("incrs-btn")) {
              const stock = target_item_obj.Available_Stock;
              item_qty++;
              if (item_qty <= stock) {
                item_qty_obj.textContent = item_qty;
                main_qty_element.textContent = item_qty;
                price_element.textContent = `₹ ${item_qty * price}`;
                if (stock == item_qty) {
                  event.target.classList.add("disabled");
                  event.target.setAttribute("data-bs-target", "#alert-lowstock");
                  event.target.setAttribute("data-bs-toggle", "modal");
                }
                total_amount();
              }
            }
            else if (target_class_list.includes("dcrs-btn")) {
              if (item_qty > 1) {
                item_qty--;
                item_qty_obj.textContent = item_qty;
                main_qty_element.textContent = item_qty;
                price_element.textContent = `₹ ${item_qty * price}`;
                total_amount();
              }
              else {
                const getCartElementID = `cart-${target_item_obj.ID}`;
                const cart_element = document.querySelector(`#${getCartElementID}`);
                const parent_element = cart_element.parentElement;
                parent_element.remove();
                const btn_type_element = mail_element.querySelector(".btn-type");
                const new_btn = `<button class="btn btn-secondary add-cart btn-sm shadow" btn-type="add" item-id="${target_item_obj.ID}">Add</button>`;
                btn_type_element.innerHTML = new_btn;
                total_amount();
              }
            }
          }

          const save_icon = document.querySelector(`#save-icon`);
          const save_cart = document.querySelector(`#save-cartbtn`);
          save_cart.classList.remove("d-none");
          save_icon.innerHTML = `<i class="bi bi-floppy2"></i>`;
        }
      })
    });

    
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
          await deleteItemNotInCart();
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
                  reportName: "All_Item_Carts",
                  id: cart_obj.ID,
                  data: formData
                }
                const updateRec = await ZOHO.CREATOR.API.updateRecord(updateConfig);
                await updateListItems(cart_obj.ID, list_total);
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
          await cartSavedIcon();
        }
      }
    }

    const save_cart = document.querySelector(`#save-cartbtn`);
    save_cart.addEventListener("click", (event) => {
      postCart();

    });


    const updateListItems = async (rec_id, cart_list) => {
      const promisses = [];
      for (let i = 0; i < cart_list.length; i++) {
        const element = cart_list[i];
        const item_name = document.getElementsByClassName("item-name")[i].textContent;
        const qty = document.getElementsByClassName("qty")[i].textContent;
        const price_element = document.getElementsByClassName("price")[i];
        const price_str = price_element ? price_element.textContent : "";
        const price = parseFloat(removeCurrencySymbol(price_str));
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
            "Price": price,
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
            promisses.push(update_rec);
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
          promisses.push(add_rec);
        }

      }

    }

    const cartSavedIcon = () => {
      const save_icon = document.querySelector(`#save-icon`);
      save_icon.innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
    }

    const getCartID = async () => {
      const franchise_resp = await getFranchiseDetails();
      if (franchise_resp.code == 3000) {
        const config = {
          appName: "village-raja-order-management",
          reportName: "All_Item_Carts",
          criteria: `Branch_Name == ${franchise_resp.data[0].ID}`
        }
        return await ZOHO.CREATOR.API.getAllRecords(config);
      }
    }

    const deleteItemNotInCart = async () => {
      const franchise_resp = await getFranchiseDetails();
      if (franchise_resp.code == 3000) {
        try {
          const cart_obj = await getCartID();
          if (cart_obj.code == 3000) {
            const cart_id = cart_obj.data[0].ID;
            try {
              config = {
                appName: "village-raja-order-management",
                reportName: "Item_Cart_Report",
                criteria: `Item_Cart == ${cart_id}`
              }
              const records = await ZOHO.CREATOR.API.getAllRecords(config);
              await dltAllItem(records, cart_id);
            }
            catch (err) {
            }
          }
        }
        catch (error) {
          console.log(error);
        }
      }
    }
    const dltAllItem = async (records, cart_id) => {
      const resp = await records;
      if (resp.code == 3000) {
        try {
          config = {
            appName: "village-raja-order-management",
            reportName: "Item_Cart_Report",
            criteria: `Item_Cart == "${cart_id}"`
          }
          const dlt = await ZOHO.CREATOR.API.deleteRecord(config);
          console.log(dlt);
        }
        catch (err) {
          console.log(err);
        }

      }
    }

    const getCartFromZoho = async () => {
      try {
        const franchise_response = await getFranchiseDetails();
        if (franchise_response.code == 3000) {
          const franchise_obj = franchise_response.data[0];
          if (franchise_obj) {
            cart_config = {
              appName: "village-raja-order-management",
              reportName: "All_Item_Carts",
              criteria: `Branch_Name == ${franchise_obj.ID}`
            }
            try {
              const cart_resp = await ZOHO.CREATOR.API.getAllRecords(cart_config);
              if (cart_resp.code == 3000) {
                const cart_obj = cart_resp.data[0];
                if (cart_obj) {
                  cart_list_config = {
                    appName: "village-raja-order-management",
                    reportName: "Item_Cart_Report",
                    criteria: `Item_Cart == ${cart_obj.ID}`
                  }
                  try {
                    const cart_list = await ZOHO.CREATOR.API.getAllRecords(cart_list_config);
                    if (cart_list.code == 3000) {
                      const cart_list_obj = cart_list.data;
                      const list_group = document.querySelector(".list-group");
                      list_group.classList.remove("d-none");
                      cart_list_obj.forEach((cart, i) => {
                        const cartItem = cart_item(cart.Item ? cart.Item.display_value : "", cart.Price ? cart.Price : 0, cart.Quantity, cart.Item.ID);
                        const list_item = document.createElement("li");
                        list_item.className = "list-group-item align-items-center";
                        list_item.id = `list-item-${i}`;
                        list_item.innerHTML = cartItem;
                        list_group.appendChild(list_item);
                        const item_card = document.getElementsByClassName("item-card");
                        for (let j = 0; j < item_card.length; j++) {
                          const element = item_card[j];
                          const card_id = element.querySelector(".item-id");
                          if (card_id) {
                            const cardid = card_id.textContent;
                            if (cardid.trim()) {
                              if (cardid.trim() == cart.Item.ID) {
                                const btn_type = element.querySelector(".btn-type");
                                const rangeBtn = range_btn(cart.Item.ID, 0, cart.Quantity ? cart.Quantity : 1);
                                btn_type.innerHTML = rangeBtn;
                                break;
                              }
                            }
                          }
                        }
                        total_amount()
                      })
                    }
                  }
                  catch {
                  }
                }
              }
            }
            catch (error) {
              console.log(error)
            }

          }
        }
      }
      catch (error) {
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

  //   // Category Filter

    const getCategory = async () => {
      config = {
        appName: "village-raja-order-management",
        reportName: "All_Categories",
      }
      try{
      const category_response = await ZOHO.CREATOR.API.getAllRecords(config);
      const cate_list = category_response.data;
      let cat_html = `<div class="text-center category cursor-pointer">
      <div class="cat rounded-circle"><img src="" height="75" width="75" class="rounded-circle" id="all-cat"></div>
      <div class="text-secondary fw-bold" style="font-size: 12px;">All</div>
    </div>`;
      let x = 0;
      cate_list.forEach(element => {
        x = x + 1;
        const category_img = `https://creator.zoho.in/publishapi/v2/info_nkcfoods/village-raja-order-management/report/All_Categories/${element.ID}/Image/download?privatelink=8YaUO6vz9USP1e6bGH6jQpfXspUmJTfNGp1GHzBtHPQ08qgYCDj1n2ezamVk8EKuD8t3DJz6KWZ0TaENKHhFSzwhqHsWOmUtN3fw`;
        cat_html += `<div class="text-center category cursor-pointer" id="cat-${x}">
    <div class="cat rounded-circle"><img src="${element.Image ? category_img : ""}" category="${element.Category}" height="75" width="75" class="rounded-circle cat-btn"></div>
    <div class="text-secondary fw-bold" style="font-size: 12px;">${element.Category}</div>
  </div>`;
      });
      const cat_group = document.querySelector("#all-category");
      cat_group.innerHTML = cat_html;
    }
    catch(err){

    }
    }

    const createOrderJSON = async () => {
      const list_grourp = document.getElementsByClassName("list-group-item");
      if (list_grourp) {
        let API = [];
        for (let i = 0; i < list_grourp.length; i++) {
          const element = list_grourp[i];
          const item_name = element.querySelector(".item-name").textContent;
          const qty = element.querySelector(".qty").textContent;
          const item_id_elemt = element.querySelector(".item-name");
          const item_id = item_id_elemt.getAttribute("item-id");
          const price = removeCurrencySymbol(element.querySelector(".price").textContent);
          API.push(
            {
              "Item_ID": item_id,
              "Item_Name": item_name,
              "Qty": qty,
              "Price": price
            }
          )
        }
        return API;
      }
      else {

      }
    }

    // Place Order

    document.addEventListener("click", (event) => {
      if (event.target.id == "place-order") {
        const list_groups = document.querySelectorAll(".list-group-item");
        if (list_groups) {
          if (list_groups.length > 0) {
            const order_details = createOrderJSON();
            const total = getTotal();
            order_details.then(resp => {
              localStorage.clear();
              localStorage.setItem("Data1", JSON.stringify(resp));
              localStorage.setItem("Total", total);
              hideShowContainers("two");
              const total_amount = removeCurrencySymbol(document.querySelector("#grand-total").textContent);
              document.querySelector("#amount").value = parseFloat(total_amount);
              const currentDate = new Date().toISOString().split('T')[0];
              const payment_date = document.querySelector("#payment-date");
              payment_date.value = currentDate;
            })
          }
        }


      }
      else if (event.target.id == "close-form") {
        hideShowContainers("one");
      }

    })

    const hideShowContainers = (container) => {
      const container_one = document.querySelector(".container-one");
      const container_two = document.querySelector(".container-two");
      if (container == "one") {
        container_one.classList.remove("d-none");
        container_two.classList.add("d-none");
      }
      else if (container == "two") {
        container_one.classList.add("d-none");
        container_two.classList.remove("d-none");
      }
    }

    const createOrderBtn = document.querySelector("#create-order");
    createOrderBtn.addEventListener("click", () => {
    const screenshot = document.querySelector("#screenshot").files[0];
    if(screenshot)
    {
      createOrder();
    }
    else{
      window.alert("Please upload the payment screenshot to create order");
    }
      
    })

    const createOrder = async () => {
      const currentDate = zohoCurrentDate();
      const branch_resp = await getFranchiseDetails();
      const branch_id = branch_resp.data[0];
      const tot_amnt = localStorage.getItem("Total");

      const order_id = await createOrderID();
      formData = {
        "data": {
          "Order_No": order_id,
          "Order_Date": currentDate,
          "Order_Status": "Pending",
          "Payment_Status": "Pending",
          "Branch_Name": branch_id.ID,
          "Total": tot_amnt
        }
      }
      config = {
        appName: "village-raja-order-management",
        formName: "Order",
        data: formData
      }
      try {
        const resp = await ZOHO.CREATOR.API.addRecord(config);
        if (resp.code == 3000) {
          await createOrderListItems(resp);
          await updateScreenShot(resp.data.ID);
          await deleteItemNotInCart();
          window.alert(`Your Order No ${order_id} has been placed successfully`);
          window.location.reload();
        }
      }
      catch (err) {
        console.log(err);
      }

    }
    const updateScreenShot = async (order_id)=>{
      const image = document.querySelector("#screenshot").files[0];
      const config = {
        appName : "village-raja-order-management",
        reportName : "All_Orders",
        id : order_id,
        fieldName : "Upload_Screenshot",
        file : image
      }
      try{
        const resp = await ZOHO.CREATOR.API.uploadFile(config);
      }
      catch(err){
        console.log(err);
      }
    }

    const getMonthStr = (mon) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months[mon];
    }

    const zohoCurrentDate = () => {
      const today_obj = new Date();
      const date = `${today_obj.getDate()}-${getMonthStr(today_obj.getMonth())}-${today_obj.getFullYear()}`;
      return date;
    }

    const createOrderListItems = async (resp) => {
      const itemArr_resp = localStorage.getItem("Data1");
      const itemArr = JSON.parse(itemArr_resp);
      try {
        const response = await resp;
        if (response.code == 3000) {
          itemArr.forEach(async (item_obj, i) => {
            i++;
            try {
              const getItemZoho = await getItemObj(item_obj.Item_ID);
              formData = {
                "data": {
                  "Item": item_obj.Item_ID,
                  "Quantity": item_obj.Qty,
                  "Price": getItemZoho.Selling_Price,
                  "S_No": i,
                  "Order_ID": response.data.ID,
                  "Category": getItemZoho.Category.ID
                }
              }
              config = {
                appName: "village-raja-order-management",
                formName: "Order_Item_SF",
                data: formData
              }
              try {
                await ZOHO.CREATOR.API.addRecord(config);
                await updateStock(getItemZoho, item_obj.Qty);
              }
              catch (error) {
                console.log(error);
              }
            }
            catch (err) {
              console.log(err);
            }

          })
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    const updateStock = async (item_obj, qty) => {

      const rem_stock = item_obj.Available_Stock - qty;
      formData = {
        "data": {
          "Available_Stock": rem_stock
        }
      }
      try {
        config = {
          appName: "village-raja-order-management",
          reportName: "All_Products",
          id: item_obj.ID,
          data: formData
        }
        const resp = await ZOHO.CREATOR.API.updateRecord(config);
        console.log(resp);
      }
      catch (err) {
        console.log(err);
      }
    }

    const createOrderID = async () => {
      config = {
        appName: "village-raja-order-management",
        reportName: "All_Order_Report"
      }
      try {
        const order_resp = await ZOHO.CREATOR.API.getAllRecords(config);
        if (order_resp.code == 3000) {
          const orderArr = order_resp.data;
          const max_no = orderArr.reduce((acc, curr) => {
            if (curr.Auto_Number > acc) {
              acc = parseInt(curr.Auto_Number);
            }
            return acc;
          }, 0);
          const zeros = "0000";
          const new_no = max_no + 1;
          const max_len = new_no.toString();
          const zero_len = zeros.length;
          const rem_len = zero_len - max_len.length;
          const rem_zeros = zeros.substring(0, rem_len);
          const order_id = `VR-${rem_zeros + new_no}`;
          return order_id;
        }
      }
      catch (err) {
        return 0;
      }
    }

    const getItemObj = async (ID) => {
      config = {
        appName: "village-raja-order-management",
        reportName: "All_Products",
        criteria: `ID == ${ID}`
      }
      try {
        const rec_obj = await ZOHO.CREATOR.API.getAllRecords(config);
        const rec_id = rec_obj.data[0];
        return rec_id;
      }
      catch (err) {
        return err;
      }
    }

  
    document.addEventListener("click",(event)=>{
     const target_class_list = Array.from(event.target.classList);
     if(target_class_list.includes("cat-btn")){
      const category_name = event.target.getAttribute("category");
      const item_cards = document.querySelectorAll(".item-card");
      for (let i = 0; i < item_cards.length; i++) {
        const element = item_cards[i];
        const item_cat = element.getAttribute("category");
        if(item_cat == category_name){
          element.classList.remove("d-none");
        }
        else{
          element.classList.add("d-none");
        }
      }
     }
     else if(event.target.id == "all-cat"){
      const item_cards = document.querySelectorAll(".item-card");
      for (let i = 0; i < item_cards.length; i++) {
        const element = item_cards[i];
          element.classList.remove("d-none");
        
      }
     }
    })

    // ZC Ends
  });