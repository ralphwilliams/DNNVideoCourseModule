# DNNVideoCourseModule
DNN SPA module that uses DNN Security Roles and Role Groups to create dynamic Courses and Categories. The course videos are created with Vimeo ids.

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
 

## Creating Categories and Courses
After installing the module onto a DNN website, follow the instructions below for setting up the courses.

This module makes use of DNN's Security and Role groups to create courses and course categories. Roles create courses and Role Groups create the courses' categories.

To create a new Categories and Courses, follow the instructions below:

1. While logged in as an Administrator or Host, navigate to Admin > Security Roles.
2. Add New Role Group and prepend the Role Group Name with "CCV_". The module uses this to show only the role groups intended to be used for the module. 
3. Add new Roles to the Role Group for each course you wish to create in each category. The module will only use the roles within the Role Groups whose names are prepended with the string "CCV_".

## Adding Videos
Once the Categories and Courses are created, videos can then be added to the module. This module uses videos that have already been added to your Vimeo account.

1. Click the Add Video button for the course you wish to add videos. In the Edit Course screen, add the Vimeo video Id in the input box and click Add Video. 
2. Once the videos have been added, they can be sorted by dragging and dropping them into the desired order.
(Videos are saved immediately upon adding, sorting or deleting.)
