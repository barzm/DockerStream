console.log("First stage in Docker Pipeline Running, Congratulations!");
var fs = require('fs'); 
var titles = [];
function extractMovieTitles(){
	// var file = fs.createWriteStream('/data/output.json');
	fs.readFile('input.json','utf-8',function(err,data){
		fs.writeFile('/data/output.json',data,function(err){
			if(err) throw err
			console.log('file saved!')
		})

	})
}

extractMovieTitles();