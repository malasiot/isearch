/* Author: Arnaud Brousseau */

//Namespace
var com;
if (!com) {
  com = {};
} else if (typeof com != "object") {
  throw new Error("com already exists and is not an object");
}
if (!com.isearch) {
  com.isearch = {};
} else if (typeof com.isearch != "object") {
  throw new Error("com.isearch already exists and is not an object");
}

//Just to be safe if a console.log() is not removed
if(typeof console == "undefined") {
  var console = {
    log: function () {},
    error: function () {}
  };
}

define("main",
    ["mylibs/menu", "mylibs/config", "mylibs/tags", "mylibs/results", "mylibs/uiiface", 
    "libs/jquery.tokeninput","libs/canvas-toBlob.min"],
    function(menu, config, tags, results, uiiface) {

    var start = function() {
      console.log('In the start function');
      $(document).ready(function(){

        //Resizing of the menu on load and when window resizes

        menu.adjust();

        var resizeTimer;
        
        $(window).resize(function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
              menu.adjust();
            }, 200);
        });
        
        //Initializes the settings panel
        config.initPanel();
        
        //Initializes the tagging system
        tags.init();

        //Initializes the UIIFace
        uiiface.initialize({gestureHint:false});
        
        //Behaviour of the menu (panels, etc)
        $('nav li').click(function(){
          var clickedListItem = $(this);
          var isActive = clickedListItem.hasClass('active'); 
          menu.reset();
          if (!isActive) {
            var requestedMode = menu.getRequestedMode(clickedListItem);
            menu.hidePanels();
            menu.showPanel(requestedMode);
            clickedListItem.addClass('active');
          }
        });
        
        //Get tokens and load them as autosuggestion for the user
        var tokens = tags.getTokens();
        $("#query-field").tokenInput('init', tokens, {theme: "isearch", preventDuplicates:true});

        //Close button of the panel
        $('.panel footer a').click(function(){
          $('.panel').slideUp(200);
        });

        //Page behaviour when the query is submitted
        $( "#query-submit").click(function (e) {

          //prevent the page to reload
          e.preventDefault() ;
          
          var query = menu.retrieveQuery(); 
          console.log('searching for query ' + query);   
          if (query) { 
            //Collapses the menu
            menu.collapse();

            //Remove the tags
            $(".tags").hide();
            //Remove the autosuggestions
            $(".token-input-dropdown-isearch").hide();

            //Displays the results
            results.display(query);

          } else {
            alert('woops! No query!');
          }
          return false;
        });
      });
    };
    
    //Public methods, returned at the end
    return {
      start: start
    };
  }
);



