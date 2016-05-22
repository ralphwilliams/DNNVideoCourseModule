/// <reference path="C:\websites\dnndev.me\Website\DesktopModules\DNNVideoCourse\Scripts/angular.js" />
angular
	.module('videoControllers')
	.controller('videoPlayerCtrl',
	['$scope',
		'$routeParams',
		'$http',
		'$sce',
		'$window',
		'vimeoFactory',
		'$location',
		'categoriesFactory',
		'videosFactory',
		'usersFactory',
		'userInfoFactory',
		'localizationFactory',
		'questionsFactory',
		'answersFactory',
		'emailFactory',
	function ($scope,
		$routeParams,
		$http,
		$sce,
		$window,
		vimeoFactory,
		$location,
		categoriesFactory,
		videosFactory,
		usersFactory,
		userInfoFactory,
		localizationFactory,
		questionsFactory,
		answersFactory,
		emailFactory) {
		var VideoId = $routeParams.VideoId;
		$scope.answers = '';
		// Get User Info
		userInfoFactory.callUserInfo()
			.then(function(data) {
				$scope.userId = data;
				loadPlayer();
			}, function(data) {
				alert(data);
			});


		function loadPlayer() {
			// #region Test for Edit mode
			if ($scope.userId > -1) {

			// #region Controller Global Variables

			$scope.nextButton = 'Next Video'; // Text is localized further down before displaying on view

			if (typeof editMode !== 'undefined') {
				$scope.editMode = true;
			} else {
				$scope.editMode = false;
			}
			$scope.courseComplete = false;
			$scope.courseFinished = false;
			$scope.showNext = true;


			// #endregion

			// #region Get Data from sources

			// Get user's completed videos
			usersFactory.callUsersData()
			.then(function (data) {
				$scope.userData = angular.fromJson(data);
				loadVids();
			}, function (data) {
				console.log('Error Getting User Data');
				console.log(data);
			});

			var loadVids = function () {
				videosFactory.callVideosData()
				.then(function (data) {
					$scope.videos = angular.fromJson(data);
					$scope.loadVideo();
				}, function (data) {
					console.log('Error getting videos');
					console.log(data);
				});
			}

			// Get Vimeo data
			function callVimeo(video) {
				vimeoFactory.callVimeoData(video.VimeoId)
				.then(function (data) {
					$scope.selectedVimeo = data;
					loadVideoDetails(video.VideoId);
				}, function (data) {
					console.log('vimeo Ajax Fail');
					console.log(data);
				});
			}

			// Get categories

			$scope.sendEmail = function (categoryId) {
				var loadCats = function (categoryId) {
					categoriesFactory.callCategoriesData()
					.then(function (data) {
						$scope.categories = angular.fromJson(data);
						angular.forEach($scope.categories, function (valueCategory, keyCategory) {
							valueCategory.RoleGroupName = valueCategory.RoleGroupName.replace('DVC_', '');
						});

						buildEmail(categoryId, $scope.categories);

					}, function (data) {
						console.log(data);
					})
				}
				loadCats(categoryId);

				function buildEmail(selectedId, categories) {
					var thisCourse;
					function getCatById(selectedId) {
						for (var i = 0; i < categories.length; i++) {
							for (key in categories[i].Roles) {
								if (categories[i].Roles[key].RoleID == selectedId) {
									thisCourse = categories[i].Roles[key];
									break;
								}
							}
						}
					}
					getCatById(selectedId);
					function email(thisCourse) {
						this.Title = thisCourse.RoleName;
						this.RoleId = thisCourse.RoleID;
						this.CategoryId = thisCourse.RoleGroupID;
						this.Body = $scope.resx.Email_Body;
						this.SubjectTitle = $scope.resx.Email_Subject;
					}
					var newEmail = new email(thisCourse);

					// Get category by ID
					emailFactory.sendEmail(newEmail)
					.success(function () {
						$scope.status = 'Email Sent.';
						console.log($scope.status);
						$scope.courseComplete = true;
					}).
					error(function (error) {
						$scope.status = 'Email not sent: ' + error.message;
						console.log($scope.status);
					});
				}

			}

			// Get Localization Resources
			localizationFactory.callResx()
			.then(function (data) {
				$scope.resx = angular.fromJson(data.ClientResources);
				$scope.resx.CouresCompletionText_Html = $sce.trustAsHtml($scope.resx.CouresCompletionText_Html);
			}, function (data) {
				alert(data);
			});

				// Get Questions
			// var questionId = 1;

			// var loadQuestions = function (videoId) {
				questionsFactory.callQuestionsData(VideoId)
					.then(function (data) {
						$scope.questions = angular.fromJson(data);
						loadUserAnswers();
					}, function (data) {
						console.log(data);
					});
			// }


			var loadAnswers = function () {
				answersFactory.callAnswersData(questionId)
					.then(function (data) {
						$scope.answers = angular.fromJson(data);
					}, function (data) {
						console.log(data);
					});
			}


			var loadUserAnswers = function () {
				answersFactory.callUserAnswersData()
					.then(function (data) {
						$scope.answers = angular.fromJson(data);
						buildQandA();
					}, function (data) {
						console.log(data);
					});
			}

				// Add New Questions
			function editAnswer(NewAnswerDTO) {
				answersFactory.setAnswers(NewAnswerDTO)
					.success(function () {
						//loadAnswer(videoId);
						$scope.savedStatus = 'Answers saved';
					}).
					error(function (error) {
						$scope.status = 'Unable to insert question: ' + error.message;
						console.log(NewAnswerDTO);
						$scope.savedStatus = 'Error Saving Answers';
					});
			}

			$scope.editAnswers = function (answer) {
			}

			// #endregion

			// #region Load Vimeo and other details

			// Check to see if video is complete and calcuate duration
			function loadVideoDetails(selectedId) {

				// If video is in list of completed videos mark this video as complete
				if ($.inArray(parseInt(selectedId), $scope.userData) != -1) {
					$scope.selectedVimeo.complete = true;
				}

				// Convert duration to minutes
				$scope.showDuration = function () {
					var time = $scope.selectedVimeo.duration;
					return convertToMinutes(time);
				}
			}
			// #endregion

			// #region Load Video

			// Get video by ID
			function getVideoById(selectedId) {
				for (var i = 0; i < $scope.videos.length; i++) {
					if ($scope.videos[i].VideoId == selectedId) {
						$scope.thisVideo = $scope.videos[i];
						break;
					}
				}
			}

			// Get video from URL by ID
			$scope.loadVideo = function () {

				//thisVideo = thisVideo;

				var selectedId = $routeParams.VideoId;
				getVideoById(selectedId);

				var VimeoId = $scope.thisVideo.VimeoId;
				callVimeo($scope.thisVideo);
				$scope.orderIndex = $scope.thisVideo.OrderIndex;

				//#region Next and Previous Navigation

				var orderIndex = $scope.thisVideo.OrderIndex;

				$scope.courseLength = 0;
				var courseComplete = 0;
				for (var i = 0; i < $scope.videos.length; i++) {
					if ($scope.videos[i].CourseId == $scope.thisVideo.CourseId) {
						$scope.courseLength++;
					}
					if ($.inArray($scope.videos[i].VideoId, $scope.userData) !== -1) {
						courseComplete++;
					}
				}
				//console.log(courseComplete);
				if (courseComplete == $scope.videos.length) {
					$scope.courseFinished = true;
				}

				$scope.lookup = {};
				var id = $scope.thisVideo.OrderIndex;
				$scope.nextPrevVideo = function (direction) {
					var newID;
					for (var i = 0, len = $scope.videos.length; i < len; i++) {
						if ($scope.videos[i].CourseId === $scope.thisVideo.CourseId) {
							$scope.lookup[$scope.videos[i].OrderIndex] = $scope.videos[i];
						}
					}
					newID = direction == 'prev' ? (parseInt(id) - 1) : (parseInt(id) + 1);
					return $scope.lookup[newID].VideoId;
				}

				//#endregion

				//#region Navigation for videos
				$scope.go = function (path) {
					$location.path('/videos/' + path);
				};
				$scope.nextVideo = function () {
					$scope.go(parseInt($scope.nextPrevVideo('next')));
				}
				$scope.prevVideo = function () {
					$scope.go($scope.nextPrevVideo('prev'));
				}
				$scope.courseList = function () {
					$location.path('/videos/');
				}
				$scope.goHome = function() {
					$location.path('/');
				}

				//#endregion

				//#region Set Selected Vimeo link

				var selectedVideo = $scope.thisVideo.VimeoId;
				$scope.vimeoUrl = $sce.trustAsResourceUrl('https://player.vimeo.com/video/' + $scope.thisVideo.VimeoId + '?api=1&player_id=player1');

				//#endregion

				//#region Next Button Text

				// Check that this is the last video of the course
				if ($scope.courseLength - 1 == $scope.thisVideo.OrderIndex) {

					if ($scope.courseFinished !== true) {
						// Check that all videos are complete &&
						// all videos in this course are complete

						// Display check mark icon
						$scope.showCheck = true;
						// Hide next arrow icon
						$scope.showNext = false;
						// Set button text to Complete Course
						$scope.nextButton = $scope.resx.VideoPlayerComplete_Btn;
					} else {
						// all videos are not complete &&
						// all videos in this course are complete

						// Hide check mark icon
						$scope.showCheck = false;
						// Hide Next arrow
						$scope.showNext = false;
						// Set button text to Return to Course List
						$scope.nextButton = $scope.resx.ReturnToCourse_Btn;
					}
				


					$scope.moveNext = function () {

						// If Last video of the course, return to main list,
						// Email admin, and 
						// save course to completedCourses
						if ($scope.courseLength - 1 == $scope.thisVideo.OrderIndex) {
							if ($scope.courseFinished == true) {
								$scope.courseList();
							} else {
								$scope.sendEmail($scope.thisVideo.CourseId);
								$scope.courseComplete = true;
							}
						} else {
							$scope.nextVideo();
						}
					}

				} else {
					$scope.showCheck = false;
					$scope.showNext = true;
					$scope.nextButton = $scope.resx.VideoPlayerNext_Btn;
					$scope.moveNext = function () {
						// console.log('move next')

						// If Last video of the course, return to main list,
						// Email admin, and 
						// save course to completedCourses
						if ($scope.courseLength - 1 == $scope.thisVideo.OrderIndex) {
							if ($scope.courseFinished == true) {
								$scope.courseList();
							} else {
								$scope.sendEmail($scope.thisVideo.CourseId);
								$scope.courseComplete = true;
							}
						} else {
							$scope.nextVideo();
						}
					}
				}

				$scope.markComplete = function () {
					//console.log('Mark Complete')
						if ($.inArray(parseInt($scope.thisVideo.VideoId), $scope.userData) > -1) {
							//do nothing
						}
						else {
							//console.log($scope.thisVideo);
							$scope.userData.push(parseInt($routeParams.VideoId));
							// confirm($scope.videosComplete);
							$scope.userData = angular.toString($scope.userData);
							usersFactory.setUsersData($scope.thisVideo)
								.success(function () {
									$scope.status = 'Upadated Video! Refreshing video list.';
									if ($scope.courseLength - 1 == $scope.thisVideo.OrderIndex) {
										if ($scope.courseFinished == true) {
										} else {
											console.log('course finished');
											$scope.sendEmail($scope.thisVideo.CourseId);
											$scope.courseComplete = true;
										}
									} 
								}).
								error(function (error) {
									$scope.status = 'Unable to insert video: ' + error.message;
									console.log($scope.status);
								});
						}
					}

				// #region vimeo stuff
				var iframe = $('#player1')[0];
				var player = $f(iframe);
				var status = $('.status');

				// When the player is ready, add listeners for pause, finish, and playProgress
				player.addEvent('ready', function () {
					status.text('ready');
					player.addEvent('finish', onFinish);
					player.addEvent('playProgress', onPlayProgress);
				});

				function getCookie(cname) {
					var name = cname + "=";
					var ca = document.cookie.split(';');
					for (var i = 0; i < ca.length; i++) {
						var c = ca[i];
						while (c.charAt(0) == ' ') c = c.substring(1);
						if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
					}
					return "";
				}

				function onFinish(id) {
					if ($scope.userData === false) {
						alert($scope.resx.SessionTimedOut_Alert);
						window.location.href = '/';
					} else {
						$('#nextVideo').removeClass('disabled');
						$scope.markComplete();
					}

				}

				function onPlayProgress(data, id) {
					status.text(data.seconds + 's played');
				}

				// #endregion


				//#endregion

			};

				// #endregion 

			var buildQandA = function() {
				angular.forEach($scope.questions, function (qv,qk) {
					angular.forEach($scope.answers, function (av,ak) {
						if (qv.QuestionId === av.QuestionId) {
							$scope.questions[qk].answer = av;
						}
					});
					function savedStuff() {
						console.log('This is saved!');
					}

						$scope.$watch('questions[qk].answer', savedStuff);
				});
			}

			$scope.updateAnswer = function (answer) {
				$scope.savedStatus = 'Saving...';
				console.log('say it is saved, please!');
				console.log(answer);
				function editAnswerObject(answer) {
					this.AnswerId = answer.answer.AnswerId,
					this.QuestionId = answer.QuestionId,
					this.AnswerText = answer.answer.AnswerText,
					this.ModuleId = moduleId,
					this.OrderIndex = answer.OrderIndex;
				}
				// Update Role Object
				var newAnswer = new editAnswerObject(answer);
				console.log(newAnswer);

				editAnswer(newAnswer);
				// $scope.savedStatus = 'Answers saved';
			}

				$scope.toggleComplete = function () {
				$scope.courseComplete = $scope.courseComplete === false ? true : false;
			};
			} else {
				$location.path('/videos/');
				$scope.courseList = function () {
					$location.path('/videos/');
				}
			}
			// $scope.loadQuestions();
			// #endregion

		}


	}]);