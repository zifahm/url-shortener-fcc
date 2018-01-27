const express = require('express');
const app = express();
const shortid = require('shortid')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/URL')
require('./models/url');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to DB");
});
const Url = mongoose.model('urls');


app.route('/')
    .get(function(req, res) {
		  res.sendFile(__dirname + '/views/index.html');
    })

app.get('/short/https://:url', async (req,res) => {
    
    Url.find({userUrl:'https://'+req.params.url},(err,doc)=>{ 
        if(err){
            console.log(err)
        }else if(doc[0]) { 
            res.send({"original":doc[0].userUrl,"shortUrl":doc[0].shortUrl})
        }else  {    
            let hash = shortid.generate();              
            const url = new Url({
                userUrl:'https://'+req.params.url,
                shortUrl:hash
            })
            url.save();
            
            res.send({"original":'https://'+req.params.url,"shortUrl":hash})
        }
    
    })
})

app.get('/short/http://:url',  (req,res) => {
    
    Url.find({userUrl:'http://'+req.params.url},(err,doc)=>{ 
        if(err){
            console.log(err)
        }else if(doc[0]) { 
            res.send({"original":doc[0].userUrl,"shortUrl":doc[0].shortUrl})
        }else  {       
            let hash = shortid.generate();           
            const url = new Url({
                userUrl:'http://'+req.params.url,
                shortUrl:hash
            })
            url.save();
            
            res.send({"original":"http://"+req.params.url,"shortUrl":hash})
        }
    
    })
})


app.get('/:url',(req,res)=>{
    Url.find({shortUrl:req.params.url},(err,url)=>{
        if(err) return console.error(err)
        else if(url.length && url[0].shortUrl==req.params.url ){
            
            res.redirect(url[0].userUrl)
        }else{
            res.send('invalid shortener, to shorten url /short/https://url')
        }
    })
    
})




app.listen(8080);