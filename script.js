ZOHO.CREATOR.init()
        .then((data)=> {

            // var login_user = ZOHO.CREATOR.UTIL.getInitParams();
            const products = async (category,product)=> {
                config = {
                    appName : "village-raja-order-management",
                reportName : "All_Products",
                criteria: "Item_Name != null",
                page : "1",
                pageSize : "200"
            }
             
            const productsArr = await ZOHO.CREATOR.API.getAllRecords(config);
           const itemArr = productsArr.data;
           let card ="";
           for (i=0;i < itemArr.length; i++) {
               const img_api = itemArr[i].Item_Image?itemArr[i].Item_Image:"";
               const product_img ="https://creatorapp.zoho.in"+ img_api;
                card += `<div class="col-lg-6 col-md-6 col-12 mt-3">
               <div class="row">
                 <div class="col-12">
                   <div class="card food-card border-0 light">
                     <div class="row">
                       <div class="col-8">
                         <div class="p-2 fw-bold">
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
                         <button type="button" class="btn btn-secondary add-cart btn-sm shadow" id='btn-${i}'>Add</button>
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
            }
products();

           
            
            // ZC Ends
        });