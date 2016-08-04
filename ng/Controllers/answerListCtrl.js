/// <reference path="../app.js" />
/// <reference path="../factories.js" />
/// <reference path="C:\websites\dnndev.me\Website\DesktopModules\DNNVideoCourse\Scripts/angular.js" />
angular
	.module('videoControllers')
	.controller('answerListCtrl',
    [
        '$scope',
        '$http',
        '$routeParams',
        'answersFactory',
        'questionsFactory',
        'videosFactory',
        'categoriesFactory',
        'vimeoFactory',
        'localizationFactory',
        '$location',
	function (
        $scope,
        $http,
        $routeParams,
        answersFactory,
        questionsFactory,
        videosFactory,
        categoriesFactory,
        vimeoFactory,
        localizationFactory,
        $location
        ) {

	    // #region Controller Global Variables
	    $scope.viewMode;

	    if (typeof editMode !== 'undefined' || $scope.editMode === true) {
	        $scope.editMode = true;
	    } else {
	        $scope.editMode = false;
	    }
	    if ($scope.editMode) {
	        $scope.returnText = 'Return to Course Progress';
	    } else {
	        $scope.returnText = 'Return to Course List';
	    }
	    // #region Get Data from sources
	    var thisCourse = parseInt($routeParams.CourseId),
	        thisUser = parseInt($routeParams.UserId);

	    // Get user's Answers
	    if ($scope.editMode) {
	        answersFactory.callUserAnswersDataAdmin(thisUser)
	            .then(function(data) {
	                    $scope.answers = angular.fromJson(data);
	                    angular.forEach($scope.userData,
	                        function(valueCategory) {
	                            valueCategory.Name = valueCategory.Name.replace('DVC_', '');
	                        });
	                    loadVids();
	                },
	                function(data) {
	                    console.log('Error Getting User Data');
	                    console.log(data);
	                });
	    } else {
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
	    }

	    // Get Vimeo Data
	    function callVimeo(vimeoId, loadVimeoData) {
	        vimeoFactory.callVimeoData(parseInt(vimeoId))
            .then(function (data) {
                $scope.vimeo = data;
                loadVimeoData(data);
            }, function (data) {
                alert('vimeo Ajax Fail');
            });
	    }

	    // Get Categories
	    categoriesFactory.callCategoriesData()
            .then(function (data) {
                $scope.categories = angular.fromJson(data);
                if (data === 0) {
                    $scope.viewMode = true;
                } else
	            {
	                angular.forEach($scope.categories,
	                    function(vCategory) {
	                        angular.forEach(vCategory.Roles,
	                            function(vRoles) {
	                                if (vRoles.RoleID === thisCourse) {
	                                    $scope.courseName = vRoles.RoleName;
	                                }
	                            });
	                        vCategory.RoleGroupName = vCategory.RoleGroupName.replace('DVC_', '');
	                        $("#dnn_dnnLOGO_hypLogo, #dnn_dnnLOGO_hypLogo img").addClass("print-me");
	                        $(".print-me").parents().addClass("js-print-me");
	                    });
	            }
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
	        $scope.videoList = [];
	        angular.forEach(videos, function (vVideo) {
	            // Check to see that video is in the course
	            if (vVideo.CourseId === thisCourse) {

	                // Create list of updated videos
	                $scope.videoList.push(vVideo);

	            }
	        }, $scope.videoList);
	        // Sort the videos
	        $scope.videoList.sort(function (a, b) {
	            return a.OrderIndex > b.OrderIndex;
	        });

	        // #endregion
	        $scope.questions = [];
	        // #region Create list of questions from videos
	        angular.forEach($scope.videoList, function (vVideo) {
	            var quesList = [];
	            questionsFactory.callQuestionsData(vVideo.VideoId).then(function (service) {
	                callVimeo(vVideo.VimeoId, loadVimeoData);

	                function loadVimeoData(video) {
	                    vVideo.name = video.title;
	                }
	                var questionList = angular.fromJson(service);
	                angular.forEach(questionList, function(vQuestion) {
	                    angular.forEach($scope.answers, function (vAnswer) {
	                        if (vAnswer.QuestionId === vQuestion.QuestionId) {
	                            vQuestion.answer = vAnswer;
	                        }
	                    });
	                    $scope.questions.push(vQuestion);
	                    quesList.push(vQuestion);
	                });

	                vVideo.questions = quesList;
	            });
	        });

	        // #endregion
	        console.log($scope.videoList);
	    }


        $scope.printMe = function() {
            window.print();
        }

	    // #endregion 


	    // #endregion

        $scope.courseProgress = function () {
            if ($scope.editMode) {
                $location.path('/status/');
            } else {                
	            $location.path('/videos/');
            }
	    }

	}]);