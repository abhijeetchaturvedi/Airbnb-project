const { response } = require("express");
const listing = require("../Models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async (req, res) => {

    const list = await listing.find({})
    res.render("./listing/showlistings.ejs", { list })
    // res.render(list[0]);
    // res.send("recieved")
    // console.log(list[0])
}
module.exports.renderAddform=(req, res) => {

    res.render("./listing/newadd.ejs")

}
module.exports.submitAddForm=async (req, res) => {
    let {newdata} = req.body ;
    console.log(newdata.location)
    let response=await geocodingClient.forwardGeocode({
        query: newdata.location,
        limit: 1
      })
        .send()
        console.log(response.body.features[0].geometry)
       

    let url1=req.file.path
    let filename1=req.file.filename
    console.log(url1,".....", filename1 )

    // if (!newdata || !newdata.title || !newdata.description || !newdata.price) {
        //     throw new customError(400, "Send valid Data");
        // }
        console.log(newdata)
        const user1 = new listing({
            title: newdata.title,
            description: newdata.description,
            price: newdata.price,
            location: newdata.location,
            country: newdata.country,
            geometry: response.body.features[0].geometry,
            image: { url:url1,
                 filename:filename1
             },
            owner:req.user._id
            
        })
        
       let saved= await user1.save()
       console.log(saved)
        res.redirect("/listings")
        
        
    }
    module.exports.showIndividual=async (req, res) => {
       



        let { id: ido } = req.params;   
        const data = await listing.findById(ido).populate({path:"reviews",populate:"author"}).populate("owner")
        // this is for if someone trying to access the deleted listing byURL
        console.log(data)
        if(!data){
    req.flash("error","The Listing You Requested Does Not Existed")
    res.redirect("/listings")
        }
        // console.log(data)
        res.render("./listing/individual.ejs", { data })
    
    }



    module.exports.deleteIndividual = async (req, res) => {
        let { id } = req.params
       await listing.findByIdAndDelete(id)
            console.log("Deleted Successfully")
            req.flash("success","Listing Deleted SuccesFully")
            res.redirect("/listings")
       
    }

    module.exports.editFormRender =async (req, res) => {
        let { id: ido } = req.params;
        const data = await listing.findById(ido)
        if(!data){
            req.flash("error","This Listing Does Not Exist")
            
            res.redirect("/listings")
        }
        // console.log(data)
        // data.js ke images ke url me upload missing hai to usnke listings ki image as it is print hogi
        let image=data.image.url
       image= image.replace("/upload","/upload/h_300,w_300,e_blur:300")
       data.image.url=image
        res.render("./listing/editform.ejs", { data })
    
    }

    module.exports.saveEditForm=async (req, res) => {
        let { id } = req.params
        let {newdata} = req.body//
        console.log(newdata)
        console.log("reached",req.file)
        let url1="ab"
        let filename1="Aby"
        if( req.file){
         
        url1=req.file.path
        filename1=req.file.filename

        }else{
            const data=  await listing.findById(id)
            console.log("reached else",req.file)
            url1=data.image.url
        filename1=data.image.filename
        }
        console.log(url1," ...",filename1)
        const find = await listing.findByIdAndUpdate(id, {
            title: newdata.title,
            description: newdata.description,
            price: newdata.price,
            country: newdata.country,
            location: newdata.location,
            image:{url:url1,
                filename:filename1
            }
        })
        console.log("sucees")
        console.log("find",)
     req.flash("success","Listing Updated SuccesFully")
    
        res.redirect(`/listings/${ id}`);    
    
    }