app.controller('realisableWishesCtrl', function($scope, $http) {
	$scope.userBudget = 100;
	$scope.userId = "";

	$http({method: 'GET', url: '/product/get'}).success(function(data, status, headers, config) {
		$scope.products = data;
		console.log(data);
	});

	$scope.setProduct = function(product) {
		$scope.newWish.product = product;
		console.log(product);
	}

	$scope.findProduct = function(id) {
		for (var i = 0; i < $scope.products.length; i++)
			if ($scope.products[i].id == id) return $scope.products[i];
		return {};
	}


	$http({method: 'GET', url: '../wishlist/get'}).success(function(data, status, headers, config) {
		$scope.wishes = data;

		for (var i = 0; i < $scope.wishes.length; i++) {
			$scope.wishes[i].product = $scope.findProduct($scope.wishes[i].product_id);
		}

		console.log($scope.wishes);
	});

	$scope.chooseWish = function (wish) { 
	    return wish.price <= $scope.userBudget; 
	};
});