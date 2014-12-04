"use strict";
/*
 app.js, main Angular application script
 define your module and controllers here
 */
var commentsUrl = 'https://api.parse.com/1/classes/comments';
angular.module('ProductApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'bL81i337pSj2QUKHKUi3li2MM0jiyjWHfbc9RJ6J';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'MA7hEVOQeNxARy57tF7tJ1bOnmmPKct3zLVsSLYh';
    })
    .controller('ProductController',function($scope,$http) {
        $scope.refreshComments = function() {
            $scope.isEmpty = true;
            $scope.loading = true;
            $http.get(commentsUrl + '?order=-votes')
                .success(function(responseData) {
                    $scope.comments = responseData.results;
                    if (responseData.results.length > 0) {
                        $scope.isEmpty = false;
                    }
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        $scope.addComment = function(comment) {
            $scope.inserting = true;
            $http.post(commentsUrl, comment)
                .success(function(responseData) {
                    comment.objectId = responseData.objectId;
                    $scope.comments.push(comment);
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.inserting = false;
                    $scope.newcomment = '';
                    $scope.refreshComments();
                });
        };



        $scope.updateComment = function(comment) {
            $scope.updating = true;
            $http.put(commentsUrl + '/' + comment.objectId, comment)
                .success(function(responseData) {
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };

        $scope.incrementVotes = function (comment, amount) {
            $scope.updating = true;
            $http.put(commentsUrl + '/' + comment.objectId, {
                votes: {
                    __op: 'Increment',
                    amount: amount
                }
            })
                .success(function(responseData) {
                    comment.votes = responseData.votes;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                })
        };

        $scope.deleteComment = function(comment) {
            $scope.updating = true;
            $http.delete(commentsUrl + '/' + comment.objectId)
                .success(function() {
                    $scope.refreshComments();
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                })
        };
    });