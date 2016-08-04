/// <reference path="../app.js" />
/// <reference path="../factories.js" />
/// <reference path="C:\websites\dnndev.me\Website\DesktopModules\DNNVideoCourse\Scripts/angular.js" />
angular
	.module('videoControllers')
	.controller('answerListCtrl', ['$scope', '$http', '$routeParams', 'answersFactory', 'questionsFactory', 'videosFactory', 'categoriesFactory', 'localizationFactory', '$location',
	function ($scope, $http, $routeParams, answersFactory, questionsFactory, videosFactory, categoriesFactory, localizationFactory, $location) {

	    // #region Controller Global Variables

	    if (typeof editMode !== 'undefined' || $scope.editMode === true) {
	        $scope.editMode = true;
	    } else {
	        $scope.editMode = false;
	    }
	    // #region Get Data from sources
	    thisCourse = parseInt($routeParams.CourseId);

	    // Get user's completed videos
	    answersFactory.callUserAnswersData()
            .then(function (data) {
                $scope.answers = angular.fromJson(data);
                angular.forEach($scope.userData, function (valueCategory) {
                    valueCategory.Name = valueCategory.Name.replace('DVC_', '');
                });
                loadVids();
            }, function (data) {
                console.log('Error Getting User Data');
                console.log(data);
            });

	    // Get Categories
	    categoriesFactory.callCategoriesData()
            .then(function (data) {
                $scope.categories = angular.fromJson(data);
                angular.forEach($scope.categories, function (vCategory) {
                    angular.forEach(vCategory.Roles, function (vRoles) {
                        if (vRoles.RoleID === thisCourse) {
                            $scope.courseName = vRoles.RoleName;
                        }
                    });
                    vCategory.RoleGroupName = vCategory.RoleGroupName.replace('DVC_', '');
                    $(".print-me, #dnn_dnnLOGO_hypLogo img").parents().addClass("js-print-me");
                });
            }, function (data) {
                console.log(data);
            });

	    // Get videos
	    var loadVids = function () {
	        videosFactory.callVideosData()
                .then(function (data) {
                    $scope.videos = angular.fromJson(data);
                    $scope.qandaList($scope.videos);
	            }, function (data) {
                    alert(data);
                });
	    }

	    // Get Localization Resources
	    localizationFactory.callResx()
            .then(function (data) {
                $scope.resx = angular.fromJson(data.ClientResources);
            }, function (data) {
                alert(data);
            });

	    // #endregion

	    // Create Question and Answer List
	    $scope.qandaList = function (videos) {

	        // #region Create list of videos in category to get questions
	        var videoList = [];
	        angular.forEach(videos, function (vVideo) {
	            // Check to see that video is in the course
	            if (vVideo.CourseId === thisCourse) {

	                // Create list of updated videos
	                videoList.push(vVideo);

	            }
	        }, videoList);
	        // Sort the videos
	        videoList.sort(function (a, b) {
	            return a.OrderIndex > b.OrderIndex;
	        });

	        // #endregion
	        $scope.questions = [];
	        // #region Create list of questions from videos
	        angular.forEach(videoList, function (vVideo) {
	            questionsFactory.callQuestionsData(vVideo.VideoId).then(function(service) {
	                $scope.questionList = angular.fromJson(service);
	                angular.forEach($scope.questionList, function(vQuestion) {
	                    angular.forEach($scope.answers, function (vAnswer) {
	                        if (vAnswer.QuestionId === vQuestion.QuestionId) {
	                            vQuestion.answer = vAnswer;
	                        }
	                    });
	                    $scope.questions.push(vQuestion);
	                });
	            });
	        });

	        // #endregion
	    }

	    // #endregion 


	    // #endregion

	    $scope.courseList = function () {
	        $location.path('/videos/');
	    }

	}]);