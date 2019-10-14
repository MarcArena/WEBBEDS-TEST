﻿angular.module('myFormApp', [])
    .controller('HotelsController', function ($scope, $http, $location, $window, hotelsService) {

        doQuery();
        $scope.numberOfNights = 2;
        $scope.destinationId = 1419;
        $scope.tries = [];
        function doQuery() {

            $scope.counter = 1;

            $scope.loading = true;
            var start = performance.now();

            hotelsService
                .getHotels($scope.destinationId, $scope.numberOfNights)
                .success(function (result) {

                    var end = performance.now();

                    if (result.Hotels === null || result.Hotels.length === 0) {

                        $scope.tries.push({ number: $scope.counter, timeTaken: (end - start) + ' ms.', message: (end - start > 1000) ? 'TimeOut' : 'No Results' });

                        $scope.counter++;

                        if ($scope.counter <= 10) { doQuery(); }
                    }
                    else {
                        $scope.Hotels = result.Hotels;

                        $scope.tries.push({ number: $scope.counter, timeTaken: (end - start) + ' ms.', message: 'OK' });

                        $scope.loading = false;
                    }
                })
                .error(function () {
                    if ($scope.counter <= 10) {

                        var end = performance.now();

                        $scope.tries.push({ number: $scope.counter, timeTaken: (end - start) + ' ms.', message: (end - start > 1000) ? 'TimeOut' : 'No Results' });

                        $scope.counter++;

                        doQuery();
                    }
                });
        }

        $scope.refresh = function () {
            $scope.tries = [];

            doQuery();
        }
    })
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    });