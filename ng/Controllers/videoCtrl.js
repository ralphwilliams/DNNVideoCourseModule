/// <reference path="C:\websites\dnndev.me\Website\DesktopModules\DNNVideoCourse\Scripts/angular.js" />
angular
	.module('videoControllers', [])
	.controller('videoCtrl', ['$scope', '$http', 'usersFactory', 'rolesFactory', 'videosFactory', 'categoriesFactory', 'questionsFactory', 'vimeoFactory', 'localizationFactory', '$location',
	function ($scope, $http, usersFactory, rolesFactory, videosFactory, categoriesFactory, questionsFactory, vimeoFactory, localizationFactory, $location, $sce) {

		// #region Test for Edit Mode

		if (typeof editMode !== 'undefined' || $scope.editMode == true) {
			$scope.editMode = true;
		} else {
			$scope.editMode = false;
		}

		$scope.viewMode;
	    $scope.hasQuestions = false;

		// #endregion

		// #region Get Data from sources

		// Get user's completed videos
		usersFactory.callUsersData()
			.then(function (data) {
			    $scope.videosComplete = angular.fromJson(data);
			    // console.log('videosComplete');
			    // console.log($scope.videosComplete);
				loadCats();
			}, function () {
				console.log('Error Getting User Data');
			});

		// Get categories
		var loadCats = function () {
			categoriesFactory.callCategoriesData()
				.then(function(data) {
					$scope.categories = angular.fromJson(data);
					if (data == 0) {
						$scope.viewMode = true;
					} else {
						$scope.viewMode = false;
						angular.forEach($scope.categories, function(valueCategory) {
							valueCategory.RoleGroupName = valueCategory.RoleGroupName.replace('DVC_', '');
						});
						loadVids();
					}
				}, function (data) {
					console.log(data);
				});
		}

		// Get videos
		var loadVids = function () {
			videosFactory.callVideosData()
				.then(function (data) {
					$scope.videos = angular.fromJson(data);
					buildVideoList($scope.videos);
			        angular.forEach($scope.videos, function(vVideos) {
			            
			        });
			    }, function (data) {
					console.log(data);
				});
		}

		// Get Vimeo data
		function callVimeo(vimeoId, video, videoId, completedVideos, loadVimeoList) {
			vimeoFactory.callVimeoData(vimeoId, video)
			.then(function (data) {
				$scope.vimeo = data;
				loadVimeoList(data, video);
			}, function () {
				console.log('vimeo Ajax Fail');
			});
		}

        // Get questions
		var loadQuestions = function (videoId) {
		    questionsFactory.callQuestionsData(videoId)
                .then(function (data) {
                    $scope.questions = angular.fromJson(data);
                }, function (data) {
                    console.log(data);
                });
		}

		// Get Localization Resources
		localizationFactory.callResx()
			.then(function(data) {
				$scope.resx = angular.fromJson(data.ClientResources);
			}, function(data) {
				console.log(data);
			});
		// #endregion

		// #region Load Video List

		// update initial video list with Vimeo data
		var buildVideoList = function () {

			for (var i = 0; i < $scope.videos.length; i++) {

				// Update videos objects with Vimeo data
				function loadVimeoList(data, video) {
					video.description = data.description;
					video.thumbnail_url = data.thumbnail_url;
					video.duration = $scope.showDuration();
					video.title = data.title;
				}

				// Get Vimeo data for each video
				callVimeo($scope.videos[i].VimeoId, $scope.videos[i], $scope.videos[i].VideoId, $scope.videosComplete, loadVimeoList);

				// convert duration to minutes
				$scope.showDuration = function () {
					var time = $scope.vimeo.duration;
					return convertToMinutes(time);
				}
			}

			// Once initial video list is updated with Vimeo data, 
			// Add updated video list to categories/roles objects
			$scope.videoList($scope.videos);

		}


		// Create Video List
		$scope.videoList = function () {

			// show or hide list depending onf if courses and categories list exists
			$scope.noCourses = $scope.categories.length > 0 ? false : true;
			if ($scope.noCourses == true && $scope.editMode == true) {
				$location.path('/categories/');
			}

			// Iterate through each Category
			angular.forEach($scope.categories, function (valueCategory, keyCategory) {

				var counter = 0;

				// Iterate through each Role
				angular.forEach($scope.categories[keyCategory].Roles, function (valueCourse, keyCourse) {


					// Set courseId to RoleID
					$scope.categories[keyCategory].Roles[keyCourse].CourseId = valueCourse.RoleID;
					$scope.categories[keyCategory].Roles[keyCourse].completeTotal = 0;
				    $scope.categories[keyCategory].Roles[keyCourse].hasQuestions = false;

					// Iterate through list of videos
					var videoList = [];
					angular.forEach($scope.videos, function (valueVideo) {


						// Check to see that video is in the course
						if (valueVideo.CourseId == valueCourse.RoleID) {
							// Iterate through list of user's completed videos and set the video to complete
							for (var j = 0; j < $scope.videosComplete.length; j++) {
								if (valueVideo.complete != true) {
									valueVideo.complete = $scope.videosComplete[j] == valueVideo.VideoId ? true : false;
								}
							}
						    questionsFactory.callQuestionsData(valueVideo.VideoId).then(function (service) {
						        $scope.questionList = angular.fromJson(service);
						        angular.forEach($scope.questionList, function (vQuestion) {
						            if (vQuestion.VideoId === valueVideo.VideoId) {
						                $scope.categories[keyCategory].Roles[keyCourse].hasQuestions = true;
                                    }
						        });
						    });
							// Create list of updated videos
							videoList.push(valueVideo);
						}

					
					}, videoList);
					// Sort the videos
					videoList.sort(function (a, b) {
						return a.OrderIndex > b.OrderIndex;
					});

					// If first video is not complete, mark as isNext
					// Else, iterate through each video and find the first 
					// video that is not complete, then break from loop
					if (videoList.length > 0 && videoList[0].complete != true) {
						videoList[0].isNext = true;
					} else {
						for (var i = 0; i < videoList.length; i++) {
							if (videoList[i].complete != true) {
								videoList[i].isNext = true;
								break;
							};
						}
					}
					$scope.categories[keyCategory].Roles[keyCourse].isFirst = counter == 0 ? true : false;

					// Populate videos in roles with new video list
					$scope.categories[keyCategory].Roles[keyCourse].videos = videoList;

					// Check for videos
					$scope.categories[keyCategory].Roles[keyCourse].hasVideos = videoList.length > 0 ? true : false;

					counter++;

					// calculate course completion status
					angular.forEach($scope.categories[keyCategory].Roles[keyCourse].videos, function (valueVideo) {
						if (valueVideo.complete == true)
							$scope.categories[keyCategory].Roles[keyCourse].completeTotal++;
					});
					if ($scope.categories[keyCategory].Roles[keyCourse].completeTotal != 0) {
						$scope.categories[keyCategory].Roles[keyCourse].amountComplete = ($scope.categories[keyCategory].Roles[keyCourse].completeTotal / $scope.categories[keyCategory].Roles[keyCourse].videos.length) * 100;
						$scope.categories[keyCategory].Roles[keyCourse].percentComplete = $scope.categories[keyCategory].Roles[keyCourse].amountComplete + '%';
					} else {
						$scope.categories[keyCategory].Roles[keyCourse].amountComplete = 0;
						$scope.categories[keyCategory].Roles[keyCourse].percentComplete = $scope.categories[keyCategory].Roles[keyCourse].amountComplete + '%';
					}
				});



			});
		}

		// #endregion 

		// #region Show Duration helper function

		$scope.showDuration = function () {
			var time = $scope.selectedVimeo.duration;
			var minutes = Math.floor(time / 60);
			var seconds = time - minutes * 60;
			function strPadLeft(string, pad, length) {
				return (new Array(length + 1).join(pad) + string).slice(-length);
			}

			var finalTime = strPadLeft(minutes, '', 2) + ':' + strPadLeft(seconds, '0', 2);
			return finalTime;
		}

		// #endregion

	}]);
angular
	.module('videoControllers')
	.controller("TabsChildController", function ($scope, $log) {

});