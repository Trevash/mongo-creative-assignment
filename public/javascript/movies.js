angular.module('movie', [])
  .controller('MainCtrl', [
    '$scope', '$http',
    function($scope, $http) {
      $scope.movies = [];
      $scope.addMovie = function() {
        var newMovie = { title: $scope.formContent, favorites: false };
        $http.post('/movies', newMovie).success(function(data) {
          $scope.comments.push(data);
        });
        $scope.formContent = '';
        $scope.movies.push(newMovie);
      };
      $scope.favoriteMovie = function(movie) {
        $http.put('/comments/' + comment._id + '/upvote')
          .success(function(data) {
            console.log("favorite worked");
            movie.favorites = true;
          });
      };
    }
  ]);

$scope.getAll = function() {
  return $http.get('/movies').success(function(data) {
    angular.copy(data, $scope.movies);
  });
};
$scope.getAll();
