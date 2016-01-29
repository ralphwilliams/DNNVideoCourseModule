# DNNVideoCourseModule
DNN SPA module that uses DNN Security Roles and Security Groups to create dynamic Courses and Categories. The course videos are created with Vimeo videos.

## Getting Started with Development

1. Begin with DNN 7.3.0
2. Put the repository into the following folder in your site:  ~\DesktopModules\Calvary_VideoCourse\
3. Build
4. Make sure the RalphWilliams_CalvaryVideo.dll file is generated in the website bin folder
5. Run the SQL data provider script(s)
6. "Install" the module in DNN
7. Make sure the module shows on a page without error
8. Pick and/or create an issue in GitHub
9. Code
10. Submit a pull request

## About the Module
### What is the module?
The DNN Video Course Module provides a way to create courses using videos that allow only the users in specific roles to view the course. The user can only watch videos that have been previously watched or the next unwatched video. The progress of each user is saved to allow the user to watch portions of the course and return to the site to continue watching at a later time. The progress of all the users can be reviewed by a site administrator. Once a user has completed their course, an email will be sent to the site administrator. 

### How it works
## Roles and Categories
This module leverages the built in functionality of DNN’s Security Categories and Security Roles. When a new category is created through the module, a new Role Group is created with a string of text (“CCV_”) prepended to the name. This allows the module to filter and show only Role Groups associated to the video course module. All Courses added to the Category will be a Security Role within that specific Role Group.

### User Progress
During installation of the module, a new hidden User Profile property is added to the User Profile. As a video has been marked as complete by reaching the end of the video (a listener for the Vimeo API is used) the user’s profile is updated with the id for that video. 

## Module Administration
### Installing the module
This module is installed as any other DNN module is installed.

1. Once logged into the site as a host, navigate to Host > Extensions.
2. Click the Add Extension button and follow the prompts to install your module.

## Setting up the module
Once the module has been installed, add the module to a page. Categories and Courses must be added prior to adding a video. There are no module settings for this module. There are 4 views, however. Course List view (default view), Video Player view, User Status view, Edit Categories and Courses view.

### Creating Categories and Courses
1. Navigate to the Edit Categories and Courses view by clicking the Course Admin dropdown and selecting “Edit Categories & Courses”.
2. Click the “Add A New Category button”.
3. Enter a name for the Category and click the “Add Category” button.
4. Add Courses to the Category by clicking the “Add A New Course” button.
5. Then, enter a name for the Course and click the “Add Course” button.
6. Navigate to the Video List view by clicking the “Return to List” button in the top right of the module.

### Adding Users to Courses
1. Navigate to the Edit Categories and Courses view.
2. Once a course has been created, add existing users to the course by clicking the Users icon for the course where the user will be added.
3. In the popup window, select the user from the dropdown and click the “Add User to Role” button.
4. Continue adding users to the course as needed.
5. Once all needed users have been added to the course, click the Close button.

### Removing Users from Courses
1. Navigate to the Edit Categories and Courses view.
2. Click the Users icon for the course from which the user will be removed.
3. In the popup window, click the delete icon for the user that is to be removed.
4. Once all needed users have been removed from the course, click the close button.

### Renaming Categories and Courses
1. Navigate to the Edit Categories and Courses view
2. Click the edit icon to the right of the Category or Course.
3. Make the edit to the name and click the “Edit Category/Course Name” button.

### Archiving Courses
A course can be archived, however, it cannot be deleted. If the course needs to be deleted, the role can be removed through the Security Roles in DNN Admin. However, note that deleting a Security Role does fully remove the Role from the database. This means that they Role name will not be able to be reused.
1. Navigate to the Edit Categories and Courses view.
2. To archive a course toggle the switch for the specified course to grey.
3. A course can be reactivated by toggling the switch back to green.

### Adding Videos to a Course
1. On the Course List view, click the “Edit Videos in Course” button on the right for the course.
2. Add the URL for a Vimeo video in the text box in the “Add new Video to Course” section and click the check mark.
3. Continue adding videos for the course.
4. To change the sort order, click and drag the thumbnail to the desired location.

### Removing a Video from a course
1. On the Course List view, click the “Edit Videos in Course” button on the right for the course.
2. Click the Edit icon to the right of the video to be removed.
3. Click the Delete button for the video.
