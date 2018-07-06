# Project Footprint: Extended

## Changes made:
### Refactoring:
- [x] Refactored CSV parsing and footprint computation to minimize code-duplication. (Consolidated trial upload, footprint upload and footprint edit to follow one set of functions.)
- [x] Refactored routers into multiple files.
- [x] Fixed graphs that were broken in refactoring by changing route URLs.
- [x] Cleaned up the code for the custom doughnut/line charts, abstracting into one function.

### Bug-fixing:
- [x] Fixed bug where CSV was not being properly parsed (because of extra date column).
- [x] Fixed bug where conversion to Imperial measurement required integer value.
- [x] Fixed bug where sometimes controller reloads when you submit second part of transition tool -- was an issue with hashing (which were stored in URL and hence cached on refresh, but not hard refresh).
- [x] Refactoring the charts seems to have fixed bug of chart sometimes refusing to be redrawn.
- [x] Changed order of calling value changes vs string changes, seems to have fixed `ng-change`-not-firing issue.
- [x] Fixed viewByCategory chart function, which was always computing Shipping.

### New features (April/May):
- [x] Created new page and hide/show functionality for sequential diesel-to-solar calculator.
- [x] Add more instructions for the user on how to navigate through the site.
- [x] Store user-entered data about diesel systems (like with trial footprints) for admin to view.
- [x] Let user get to transition tool and save their data; display proper return-button and post to proper table in database.
- [x] Only display fiscal savings if it's a positive number.
- [x] Added a workaround (second input) for now. [Problem: Change gallons/day to input (and probably also kWh/ day). Seems to be a 2-way binding issue. Yeesh... a lot of research into angular is turning up nothing for fixing this. There must be an easy fix.]
- [x] Added instructions for using Excel (the formatting looks fine on a few different machines I've checked).
- [x] On Projects page, display project's country and type(s).
- [x] Charts' legends now display names of countries and types.
- [x] Cleaned up UI for Tracking tool on home (non-logged in) page (add hover-instructions, change download link format, add hover effects to buttons). Also made `hr` lines thicker.
- [x] Added Bootstrap to make calculator page responsive -- odd that it retains its instruction to scroll user to next box on *second* time visiting the page after a refresh...
- [x] Add hover text to clarify the meaning of Overspec.
- [x] Change DB posts to reflect our workaround (user can alter dailyGallons).
- [x] Issue with deployment was failing to change server `app.use` for static serving before zipping up source code. Also, don't forget to connect via Postico to the endpoint provided by AWS.
  - Add source 0.0.0.0/0 to 5432 rule. Use a database name that exists when connecting from Postico. (or you don't have to???)
  - OK we FINALLY got there: simply followed [these helpful steps](https://medium.com/@harrison0723/beginners-guide-to-aws-beanstalk-using-node-js-d061bb4b8755) to allow Beanstalk app access to the database, and allowed access to the database from anywhere so that Postico can hook onto it. Then we had to put our data inside the "ebdb" database, rather than the "postgres" database.

### New features (July):
- [x] Lock out submit button until have chosen metric/non, submitted org name, and submitted a file.
- [x] Click on top header takes you back home.
- [x] "Check out our impact." "Now try it for your organization." "Carbon footprint" => "footprint"
- [x] Let user know CSV has uploaded (bar?). (Cursor still annoying).
  - [x] Times two (turned out to be harder than anticipated to finagle the `ng-model` and clean up UI. Also can't make the "download template" links stack, and the Month and Year are invisible now...)
- [x] Have user's own FP data pop up next to the upload.
  - [ ] Really not sure why chart is so small...
- [x] Say "country: " on upload modal. Generally clean up UI for footprint and project uploads.
- [x] New month does not show up after uploading immediately. This was a trickier issue -- had to emit from one controller to another (couldn't see how to do it with a service). Had to add some promises as well to ensure order was correct. There is still an issue, because it seems injecting the scope causes things (like getProjectFootprints) to run before they should. Uh oh, bigger issue, now will only let me click on upload project ONCE. (or use the nav in general).
- [x] Fixed that mess with an Observer in the service. Nice. Ughhh no the nav bar is still broken. All right, had to remove `$scope: scope` -- and again, it didn't work the first time....But now seems to?
- [x] Still need confirmation alerts.
  - [ ] Still needed for projects.
- [x] Cleaned up login failure messages.
- [x] Make delete button easier to read (angular Material makes harder than it should be).
- [x] When user submits new project, go to that screen immediately (more observers).

## Next Steps:

### Top priority:

- [ ] Auto-select the current project when Uploading new footprint from projects page.
- [ ] User's info over time line chart buggy.
- [ ] Popup FAQ like on footprintproject.io site.
- [ ] Implement forgot password.
- [ ] Give diesel higher priority in CSV.
- [ ] Make sure line chart of FP's footprint does not disappear on Trial Upload.
- [ ] Add total to donut chart.
- [ ] Issue discovered: Project is added to DB if it has no types, but will NOT show up in our query for all of a user's projects. Easiest fix is validate for a type, which we probably want anyway.
- [ ] Issue: Trial run card now looks bad on narrower screens.
- [ ] Oh we could even validate on whether it's a CSV -- that's a good idea.
- [ ] Add a scroller to the Projects list, so it doesn't get too long.


### High-priority:
- [ ] Non-metric CSV is not correct. (just get rid of dates columns?)
- [ ] Do not show options for chart query unless it contains data -- don't even display it as an option in the dropdown. (Alert user if there is no data (i.e. identify all of those errors -- "cannot read property plane of undefined", for example))?
- [ ] Disallow user from entering two projects of same name (creates `md-duplicate` error) -- ask if they instead want to view that project.
- [ ] Disallow user from entering two footprints of the same month for one project.
- [ ] Set up Admin page to display all relevant data.
- [ ] Update `databasesetup.sql` file to reflect changes to db structure. (Shit I forgot what they were...)

### Bugs:
- [ ] I don't think size of solar grid is appropriately sensitive to overspec/dayPower.
- [ ] Bug: adding new CSV doesn't seem to be affecting totals graph, unless the numbers are too small to be affecting it.
- [ ] Sometimes hovering over project names on side-dash makes them invisible???
- [ ] Sometimes hovering over bar chart switches values???
- [ ] The divided-by input dropdown sometimes displays two values???
- [ ] If user submits project without all info, it kills server.

### Testing:
- [ ] Make sure to test uploading test CSVs and see that graphs properly reflect them.


## Quality of Life Improvements:
### Simpler:
- [ ] The lower shadow on hover over a button (e.g. AWS) is a nice touch.
- [ ] Add response to user when footprint or project has been successfully posted/edited.
- [ ] Split up controllers and services further (especially user controller and user service).
- [ ] Let user choose metric or non- for transition tool.
- [ ] Make background color on home screen uniform.
- [ ] Add ` isMetric` field to Footprints table (for hover feature).
- [ ] Change title from "check out FP's FP" to "this is yours" on submit.
- [ ] Add animations for the diesel-to-solar calculator.

### Less simple:
- [ ] Would be nice to fix the page refresh issue (cacheing, etc.). (IDEA: We could use localStorage!)
- [ ] Let user view current CSV when editing or deleting -- or for that matter, show them on hover on the page or something.
- [ ] Add animations for the user-customizable charts, to ensure that there's not so much gaping white space before charts are generated. Move two large buttons to two tabs on the left when user clicks one.
- [ ] Overall line chart should include gaps for non-uploaded months (otherwise it's prettier, but misleading).
- [ ] Follow Emma's idea: wrap calc page with a Start button, and walk user through inputs one by one.
