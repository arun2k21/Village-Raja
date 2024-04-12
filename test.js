ZOHO.CREATOR.init()
        .then((data)=> {
          
const a = async ()=>{
    try{
        config = {
            appName : "village-raja-order-management",
            reportName : "All_Item_Carts",
            criteria : "Branch_Name != null"
        }
        const resp = await ZOHO.CREATOR.API.getAllRecords(config);
        if(resp.code == 3000){
            console.log("Success");
        }
        else{
            console.log("Error");
        }
    }
    catch (error){
        console.log(error);
    }
    
}
a();

        });