/**
 * 
 */
define("mylibs/filehandler", ["libs/glge-compiled-min"], function(GLGE){
	
	FileHandler = function(dropElementID,accept,serverURL,startCount) {
		this.dropContainer = document.getElementById(dropElementID) || false;
		this.accept = accept || [];
		this.serverURL = serverURL || 'query/item';
		this.count = startCount || 0;

		this.ModelHandler = function(model,canvas) { 
			this.model     = model;
	        this.canvas    = document.getElementById(canvas);
		};
		
		this.ModelHandler.prototype.initialize = function() {
	        //Scope magic
	        var that = this;
	        var GLGE = window.GLGE;
	        //Initialize the basic 3D scene with GLGE
	        var doc = new GLGE.Document();
	        doc.onLoad = function(){
	            
	            //create the renderer
	            var gameRenderer = new GLGE.Renderer(that.canvas);
	            gameScene = new GLGE.Scene();
	            gameScene = doc.getElement("mainscene");
	            gameRenderer.setScene(gameScene);
	            
	            var spin = new GLGE.AnimationVector();
	            spin = doc.getElement("spin");
	            
	            var camera = new GLGE.Camera();
	            camera = doc.getElement("maincamera");
	            
	            function addModel() {
	                var model = new GLGE.Collada();
	                model.setDocument(that.model);
	                model.setUseLights(true);
	                model.setLocX(0);
	                model.setLocY(0);
	                model.setLocZ(0);
	                model.setRot(0,0,Math.PI/2);
	                model.setScale(0.085);
	                model.setAnimation(spin);
	                
	                gameScene.addCollada(model);
	                
	                camera.setLookat(model);
	            }
	            
	            function render(){
	
	                gameRenderer.render();
	            }
	            
	            addModel();
	            setInterval(render,10);
	        };
	        
	        doc.load("js/mylibs/scene.xml");
		};
	};
	
	FileHandler.prototype.isAllowedExtension = function(fileName)
	{
        var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
        var allowed = this.accept;
        
        if (!allowed.length){return true;}
        
        for (var i=0; i<allowed.length; i++){
            if (allowed[i].toLowerCase() == ext){ return true;}
        }
        
        return false;
    }; 
	
	//Function for calculate the progress of the upload progress bar
	FileHandler.prototype.uploadProgressXHR = function(event) {
	    if (event.lengthComputable) {
	        var percentage = Math.round((event.loaded * 100) / event.total);
	        if (percentage <= 100) {
	            event.target.log.lastChild.firstChild.style.width = (percentage*2) + "px";
	            event.target.log.lastChild.firstChild.textContent = percentage + "%";
	        }
	    } 
	};
	
	//Logging notification function, fires if upload complete 
	FileHandler.prototype.loadedXHR = function(event) {
	    var currentItem = event.target.log;
	    currentItem.className += " loaded";
	    console.log("xhr upload of "+event.target.log.id+" complete");
	};
	    
	//Logging notification function, fires if there was an error during upload
	FileHandler.prototype.uploadError = function(error) {
	    console.log("error: " + error);
	};
	    
	//Handles the file upload with 
	FileHandler.prototype.processXHR = function(file, id) {
	    var xhr        = new XMLHttpRequest(),
	        formData   = new FormData(),
	        container  = document.getElementById(id),
	        progressDomElements = [
	            document.createElement('div'),
	            document.createElement('p')
	        ];
	    
	    var that = this;
	    
	    progressDomElements[0].className = "progressBar";
	    progressDomElements[1].textContent = "0%";
	    progressDomElements[0].appendChild(progressDomElements[1]);
	    
	    container.appendChild(progressDomElements[0]);
	    
	    //Handle file display after upload of a media file
	    xhr.onreadystatechange =  function (event) {
	        if (xhr.readyState == 4) {
	        	
	            var fileInfo = JSON.parse(xhr.responseText);
	            var pictureIcon = {};
	            
	            //3D model display via GLGE
	            if((/dae/i).test(fileInfo.name)) {
	            	console.log("3D uploaded...");
	            	pictureIcon = $('nav li[data-mode="3d"]');
	            	var modelHandler = new that.ModelHandler(fileInfo.path,id);
	            	modelHandler.initialize();
	            }
	            else {
	            	
	            	//Image display in query field
		            if((/image/i).test(fileInfo.type)) {
		            	console.log("Image uploaded...");
		            	pictureIcon = $('nav li[data-mode="picture"]');
		            }
		            //Sound display in query field
		            if((/audio/i).test(fileInfo.type)) {
		            	console.log("Audio uploaded...");
		            	pictureIcon = $('nav li[data-mode="sound"]');
		            }
		            //Video display in query field
		            if((/video/i).test(fileInfo.type)) {
		            	console.log("Video uploaded...");
		            	pictureIcon = $('nav li[data-mode="video"]');
		            }
		            
		            $('#' + id).attr({'src' : fileInfo.path,
  		                              'alt' : fileInfo.name});
	            }
	            
	            pictureIcon.removeClass('uploading');
	            
	        } //End readystate if  
	    };
	    
	    xhr.upload.log = container;
	    xhr.upload.curLoad = 0;
	    xhr.upload.prevLoad = 0;
	    xhr.upload.addEventListener("progress", this.uploadProgressXHR, false);
	    xhr.upload.addEventListener("load", this.loadedXHR, false); 
	    xhr.upload.addEventListener("error", this.uploadError, false); 
	    
	    formData.append('files', file);
	    xhr.open("POST", this.serverURL, true);
	    xhr.send(formData);
	    
	};
	    
	//Drop event handler for image component
	FileHandler.prototype.handleFiles = function(event) {
	    
		var files = event.files || event.target.files || event.dataTransfer.files;
		
		event.stopPropagation();
		event.preventDefault();
		
	    //Test if browser supports the File API
	    if (typeof files !== "undefined") {
	    	
	        for (var i=0, l=files.length; i<l; i++) {
	            
	        	//State if current file is allowed to be uploaded
	        	if(this.isAllowedExtension(files[i].name)) {
	        		
	        		//Create the token for the search bar
	        		var id = "fileQueryItem" + this.count;
	        		var token = "";
	        		var supportDirectData = true;
	        		
	        		//Create token content dependend from the media input
	        		if((/image/i).test(files[i].type)) {
	        			token = '<img id="' + id + '" alt="" src="" />';
	        			
	        		} else if((/audio/i).test(files[i].type) || (/ogg/i).test(files[i].name)) {
	        			token = '<audio src="" controls="" id="' + id + '" width="60" height="25">No audio preview.</audio>';
	        		} else if((/video/i).test(files[i].type)) {
		        		token = '<video src="" controls="" id="' + id + '" width="60" height="25">No video preview.</video>';
	        		} else if((/dae/i).test(files[i].name) || (/3ds/i).test(files[i].name) || (/md2/i).test(files[i].name) || (/obj/i).test(files[i].name)) {
	        			token = '<canvas id="' + id + '" width="60" height="25"></canvas>';
	        			supportDirectData = false;
	        		}
	        		
	        		$("#query-field").tokenInput('add',{id:id,name:token});
	        		
	        		if(supportDirectData && typeof FileReader !== "undefined") {
	        			
	        			var domToken = document.getElementById(id),
	        			
		        		//Create Filereader instance
		                reader = new FileReader();
		                reader.onload = (function (theDataToken) {
		                    return function (event) {
		                    	theDataToken.src = event.target.result;
		                    };
		                }(domToken));
		                //Read media data from file into img, audio, video - DOM element
		                reader.readAsDataURL(files[i]);
	        		}
	        		
	        		//Upload file to server
	                this.processXHR(files[i], id);
		            //Increase drop component count
		            this.count++;
	                
	        	}
	        	else {
	        		alert("Sorry, the submitted file " + files[i].name + " is not supported. Please use one of the following file types: " + this.accept.join(','));
	        	}
	        	
	        }
	        //End for
	    }
	    else {
	        alert("No files to handle. Maybe this web browser does not support the File API");
	    }
	};
	
	FileHandler.prototype.handleCanvasData = function(data) {
		console.log("Canvas blob data received: ");
		console.log(blob);
	};
	
	return {
		FileHandler : FileHandler
	};
	
}); //End 