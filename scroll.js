$(function() {
  
  // This is the imdbID counter where we'll start from.  The actual id will look something like tt1500000
  var currentCounter = 1500000;

  // Add the response to the page.  The response contains a movie in JSON format.
  var appendToPage = function(response) {
    var stringified = JSON.stringify(response);
    var array = JSON.parse(stringified);
    $("body").append("<div class='movie'><div>["+ array.imdbID+"] "+array.Title+" (" + array.Year + ")</div><div>"+ array.Plot +"</div></div>");
  }

  // Show the notify message in the footer (e.g. if movies are loading, or if there was an error)
  var notifyMessage = function(message) {
    var footer = $("footer");
    footer.show();
    footer.text(message);
  }

  // Hide the footer message
  var hideMessage = function() {
    $("footer").hide();
  }

  // Request the movie by id using the OMDBAPI.  The ID should look something like tt1500000 for example.
  var getMovie = function(id) {
    $.ajax({
      url: "http://www.omdbapi.com/",
      method: "GET",
      data: "i="+ id +"&plot=short&r=json",
      dataType: "json",
      beforeSend: function(){
        notifyMessage("Requesting more movies...");
      }
    }).done(function (response) {     
      appendToPage(response);
      hideMessage();      
    }).fail(function (response) {
      notifyMessage("Error was encountered while trying to get movies");
    });
  }

  // Here we use a closure, and we give the startId (without the tt) which returns a function that
  // gets 10 movies.  Each time we call that function, the counter contained in the closure is updated by 10.
  var getMultipleMoviesFrom = function(startId) {
    var currentCounter = startId;
    function getTenMovies() {
      for (var i=0; i<10; i++) {
        getMovie( "tt" + (currentCounter+i) );
      }
      currentCounter += 10;
    }
    return getTenMovies;
  }

  // Initial call - load some movies first
  var getTen = getMultipleMoviesFrom(currentCounter);
  getTen();

  // Thanks to StackOverflow for this function to detect when scroll is at bottom
  $(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
      // Call when scrolled to bottom
      getTen();       
     }
  });

});
