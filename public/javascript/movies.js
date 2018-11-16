angular.module('movie', [])
  .controller('MainCtrl', MainCtrl)
  .directive('showmovies', movieDirective);


function MainCtrl($scope, $http){
  $scope.movies = [{title: "The Avengers", imageUrl: "http://image.tmdb.org/t/p/w200/cezWGskPY5x7GaglTTRN4Fugfb8.jpg"}];
  $scope.favoritedmovies = [];

  $scope.searchMovie = function() {
    console.log("in Add Movie");
    var newMovie = { title: $scope.formContent };
    console.log(newMovie);
    $http.get('/getmovies/' + newMovie.title).success(function(data) {
      $scope.movies = data;
      console.log(data);
    });
    $scope.formContent = '';
    $scope.movies.push(newMovie);
  };

  $scope.getFavorites = function() {
    return $http.get('/favorites/movies').success(function(data) {
      angular.copy(data, $scope.favoritedmovies);
      console.log(data);
    });
  }
  $scope.getFavorites();

  $scope.favoriteMovie = function(movie) {
    delete movie["$$hashKey"];
    let jsonData = JSON.stringify(movie);
    console.log(jsonData);

    let req = {
     method: 'PUT',
     url: '/favorites',
     headers: {
       'Content-Type': 'application/json'
     },
     data: jsonData
    }

    $http(req)
      .success(function(data) {
        console.log("favoriting worked");
        $scope.favoritedmovies.push(movie);
        console.log("Updated favorited movies", $scope.favoritedmovies);
      });

  };

  $scope.unfavoriteMovie = function(movie) {
    let req = {
     method: 'DELETE',
     url: '/favorites/'+movie.title,
    }

    $http(req)
      .success(function(data) {
        console.log("unfavoriting worked");
        for (let i = 0; i < $scope.favoritedmovies.length; i++) {
          if (movie.title === $scope.favoritedmovies[i].title) {
            $scope.favoritedmovies.splice(i, 1);
            return;
          }
        }
      });
  }

  $scope.getAll = function() {
    return $http.get('/allMovies').success(function(data) {
      angular.copy(data, $scope.movies);
      console.log(data);
    });
  };
  $scope.getAll();
}

function movieDirective() {
  console.log("in movie directive");
  return {
    scope: {
      movie: '=' //[1]
    },
    restrict: 'E', //[2]
    replace: 'true',
    template: (
      // "<div>" +
      // "<img src='http://image.tmdb.org/t/p/w200/cezWGskPY5x7GaglTTRN4Fugfb8.jpg'/>" +
      // "<h4>The Avengers</h4>" +
      // "</div>"),
     '<div>' +
     '<div ng-click="favoritemovie()">' +
     '<img ng-src="{{movie.imageUrl}}" class="gridImage"/>' +
     '<h4 class="textBorder">{{movie.title}}</h4>' +
     '</div>' +
     '</div>'
    ),
    link: link
  };

  function link(scope) { //[4]
    if (!scope.movie.imageUrl) {
      scope.movie.imageUrl = 'https://www.drupal.org/files/issues/default-avatar.png';
    }
  }
}
