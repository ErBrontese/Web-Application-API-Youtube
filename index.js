const express = require("express");
const app = express();
const axios = require("axios");
const port = 3000;
var bodyParser=require('body-parser');
const path = require('path');
const { google } = require("googleapis");
const apiKey = "AIzaSyDX5iyCCS1d5Q1HSCWVT0juz7bb6Cy0PvI";
const ApiUrl = "https://www.googleapis.com/youtube/v3";


app.set('view engine', 'ejs');


const youtube = google.youtube({
    version: "v3",
    auth: apiKey,
  });


//
app.get("/", (req, res) => {
    res.render(path.join(__dirname, 'views/home'));
})

app.use(express.json());


app.use(bodyParser.urlencoded({extended: true}));

app.post("/search", async (req, res,next) => {
  
    try{
       // const searchQuery=req.query.search_query;
        var {search_query}=req.body;
        console.log(search_query);

        const url =`${ApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${search_query}&maxResults=8`;
        const response = await axios.get(url);
        
        
        const titles = response.data.items;
       
       // const videoID = response.data.items.map((item) => item.id.videoId);

       const prova = response.data.items.map((item) => item.snippet.thumbnails);
      
       console.log(prova);

        res.render(path.join(__dirname, 'views/ShowHome'), { titoli: titles});
    }catch(err){
        next(err);
    }

})



app.get("/search-with-googleapis", async (req, res,next) => {
  
    try{
        const searchQuery=req.query.search_query;
        //const url =`${ApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`;
        const response = await youtube.search.list({
            part : "snippet",
            q : searchQuery,
            type : "video",
        });

        const titles = response.data.items.map((item) => item.snippet.title);
       
       
    }catch(err){
        next(err);
    }

})

app.listen(port, ()=>{
    console.log("App listening on port 3000");
});