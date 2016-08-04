/// <reference path="C:\websites\dnndev.me\Website\DesktopModules\DNNVideoCourse\Scripts/angular.js" />
angular
	.module('videoControllers')
	.controller('editQuestionsCtrl',
	['$scope',
		'$routeParams',
		'$http',
		'$sce',
		'$window',
		'vimeoFactory',
		'$location',
		'localizationFactory',
		'questionsFactory',
        'videosFactory',
	function ($scope,
		$routeParams,
		$http,
		$sce,
		$window,
		vimeoFactory,
		$location,
		localizationFactory,
		questionsFactory,
        videosFactory) {

		// #region Test for Edit mode
		if (typeof editMode !== 'undefined' || editMode === false) {
			$scope.editMode = true;

			// #region Get Data from sources

			// Get Questions
			var videoId = parseInt($routeParams.VideoId);
		    
			var loadQuestions = function (videoId) {
				questionsFactory.callQuestionsData(videoId)
					.then(function (data) {
						$scope.questions = angular.fromJson(data);
					}, function (data) {
						console.log(data);
					});
			}

			// Add New Questions
			function editQuestion(NewQuestionDTO) {
				questionsFactory.setQuestions(NewQuestionDTO)
					.success(function () {
						loadQuestions(videoId);
					}).
					error(function (error) {
						$scope.status = 'Unable to insert question: ' + error.message;
						console.log(NewQuestionDTO);
					});
			}

		    // Get videos
			videosFactory.callVideosData()
                .then(function (data) {
                    $scope.videos = angular.fromJson(data);
			        loadVideo();
			    }, function (data) {
                    alert(data);
			    });

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

			// Get Localization Resources
			localizationFactory.callResx()
				.then(function(data) {
					$scope.resx = angular.fromJson(data.ClientResources);
				}, function(data) {
					alert(data);
				});

			// #endregion

			$scope.editQuestion = true;
			$scope.toggleeditQuestion = function () {
				$scope.editQuestion = $scope.editQuestion === false ? true : false;
			};

		    // #region Drag and Drop directive

			function assignOrder() {
			    angular.forEach($scope.questions, function (value, key) {
			        console.log(key);
			        value.OrderIndex = key;
			        console.log(value);
			        $scope.EditQuestionOrder(value);
			    }, $scope.questions);
			    $(function () {

			        //$.ui.sortable.refresh();
			    });
			}

		    // Sortable directive
			$scope.sortableOptions = {
			    handle: '> .video-drag-handle',
			    placeholder: "sortable-placeholder",
			    helper: 'helper',
			    forceHelperSize: true,
			    'ui-floating': true,
			    update: function (e, ui) {
			        console.log(e);
			        console.log(ui);
			        assignOrder();			    },
			    stop: function (e, ui) {

			    }
			};

		    // #endregion

			// #region Edit Question

			$scope.editQuestionText = function (QuestionText, QuestionId, VideoId, OrderIndex) {
				function editQuestionObject(QuestionText, QuestionId, VideoId, OrderIndex) {
					this.QuestionId = QuestionId,
					this.VideoId = VideoId,
					this.QuestionText = QuestionText,
					this.ModuleId = moduleId,
					this.OrderIndex = OrderIndex;
				}
				// Update Role Object
				var newQuestion = new editQuestionObject(QuestionText, QuestionId, VideoId, OrderIndex);
				editQuestion(newQuestion);
				$scope.editQuestion = true;
				$scope.QuestionText = '';
			}

		    // #endregion

		    // #region Edit Question Order
            $scope.EditQuestionOrder = function(question) {
                // updated Video Class
                function UpdateQuestion(question) {
                    this.QuestionId = question.QuestionId;
                    this.VideoId = question.VideoId;
                    this.QuestionText = question.QuestionText;
                    this.OrderIndex = question.OrderIndex;
                    this.ModuleId = moduleId;
                }

                // Create updated video object
                var updatedQuestion = new UpdateQuestion(question);
                console.log('updatedQuestion');
                console.log(updatedQuestion);
                // Save question updated video object
                questionsFactory.setQuestions(updatedQuestion)
                    .success(function () {
                        loadQuestions(videoId);
                    }).
                    error(function (error) {
                        $scope.status = 'Unable to insert question: ' + error.message;
                        console.log(NewQuestionDTO);
                    });

            }

			// #region Add Question

			$scope.addNewQuestion = function (newQuestionText) {
				console.log('$scope.addNewQuestionText: ' + newQuestionText);
				function QuestionText(newQuestionText) {
					this.VideoId = videoId,
					this.QuestionText = newQuestionText,
					this.ModuleId = moduleId,
					this.OrderIndex = $scope.questions.length;
				}
				// Set New Role Object
				var newQuestion = new QuestionText(newQuestionText);
				editQuestion(newQuestion);
				$scope.editQuestion = true;
				$scope.question.addNewQuestionText = '';
			}

			// #endregion

			// #region Remove Question

			$scope.removeQuestion = function (item) {
				var index = $scope.questions.indexOf(item);
				var questionToDelete = item;
				$scope.questions.splice(index, 1);
				questionsFactory.deleteQuestion(questionToDelete);

				// Sort the videos
				$scope.questions.sort(function (a, b) {
					return a.OrderIndex > b.OrderIndex;
				});

				assignOrder();
			}

			// #endregion

			// #region Create List of Questions
			loadQuestions(videoId);

		    // #endregion

            function loadVideo() {
                angular.forEach($scope.videos, function (video, key) {
                    if (video.VideoId === videoId) {
                        $scope.thisVideo = video;
                    }
                });

			    callVimeo($scope.thisVideo.VimeoId, loadVimeoData);
			    function loadVimeoData(video) {
			        $scope.thisVideo.name = video.title;
			    }



                $scope.courseId = $scope.thisVideo.CourseId;
                
                console.log($scope.thisVideo);
            }

			$scope.courseList = function () {
				$location.path('/videos/');
			}

			// #endregion

		} else {
			$scope.editMode = false;
			$location.path('/videos/');
			$scope.courseList = function () {
				$location.path('/videos/');
			}
		}

		// #endregion

	}]);