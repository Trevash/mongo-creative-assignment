angular.module('movie', [])
  .controller('MainCtrl', MainCtrl)
  .directive('showMovies', movieDirective);


function MainCtrl($scope){
    '$scope', '$http',
    function($scope, $http) {
      $scope.movies = [{title: "The Avengers", imageUrl: "http://image.tmdb.org/t/p/w200/cezWGskPY5x7GaglTTRN4Fugfb8.jpg"}];
      $scope.addMovie = function() {
        console.log("in Add Movie");
        var newMovie = { title: $scope.formContent };
        $http.get('/getmovies/' + newMovie.title).success(function(data) {
          $scope.movies.push(data);
          console.log(data);
        });
        $scope.formContent = '';
        $scope.movies.push(newMovie);
      };

      $scope.favoriteMovie = function(movie) {
        $http.put('/favorites/' + movie._id + '/favorites')
          .success(function(data) {
            console.log("favorite worked");
            movie.favorites = true;
          });
      };

      $scope.getAll = function() {
        return $http.get('/allMovies').success(function(data) {
          angular.copy(data, $scope.movies);
          console.log(data);
        });
      };
      $scope.getAll();
    };
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
     '<div>' + '<img ng-src="{{movie.imageUrl}}"/>' + '<h4 class="textBorder">{{movie.title}}</h4>' + '</div>'),
    link: link
  };

  function link(scope) { //[4]
    if (!scope.movie.imageUrl) {
      scope.movie.imageUrl = 'https://www.drupal.org/files/issues/default-avatar.png';
    }
  }
}
