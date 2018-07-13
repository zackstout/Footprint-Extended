# Project Footprint: Extended

## Changes made:
### April:
- [x] Refactored CSV parsing and footprint computation to minimize code-duplication. (Consolidated trial upload, footprint upload and footprint edit to follow one set of functions.)
- [x] Refactored routers into multiple files.
- [x] Fixed graphs that were broken in refactoring by changing route URLs.
- [x] Cleaned up the code for the custom doughnut/line charts, abstracting into one function.
- [x] Fixed bug where CSV was not being properly parsed (because of extra date column).
- [x] Fixed bug where conversion to Imperial measurement required integer value.
- [x] Fixed bug where sometimes controller reloads when you submit second part of transition tool -- was an issue with hashing (which were stored in URL and hence cached on refresh, but not hard refresh).
- [x] Refactoring the charts seems to have fixed bug of chart sometimes refusing to be redrawn.
- [x] Changed order of calling value changes vs string changes, seems to have fixed `ng-change`-not-firing issue.
- [x] Fixed viewByCategory chart function, which was always computing Shipping.

### May:
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

### July:
- [x] Lock out submit button until have chosen metric/non, submitted org name, and submitted a file.
- [x] Click on top header takes you back home.
- [x] "Check out our impact." "Now try it for your organization." "Carbon footprint" => "footprint"
- [x] Let user know CSV has uploaded (bar?). (Cursor still annoying).
  - [x] Times two (turned out to be harder than anticipated to finagle the `ng-model` and clean up UI. Also can't make the "download template" links stack, and the Month and Year are invisible now...)
  - [x] Issue was with `md-selected-text`; wasn't changed to `pdc.user`. Although, why are we doing it like this, rather than as the Projects selector is done?
- [x] Have user's own FP data pop up next to the upload.
  - [ ] Really not sure why chart is so small...
  - [ ] Its size seems buggy. Def make it responsive either with percentage or `flex`.
  - [ ] Resubmit makes it bigger! Need to destroy, for sure, and probably more.
- [x] Say "country: " on upload modal. Generally clean up UI for footprint and project uploads.
- [x] New month does not show up after uploading immediately. This was a trickier issue -- had to emit from one controller to another (couldn't see how to do it with a service). Had to add some promises as well to ensure order was correct. There is still an issue, because it seems injecting the scope causes things (like getProjectFootprints) to run before they should. Uh oh, bigger issue, now will only let me click on upload project ONCE. (or use the nav in general).
- [x] Fixed that mess with an Observer in the service. Nice. Ughhh no the nav bar is still broken. All right, had to remove `$scope: scope` -- and again, it didn't work the first time....But now seems to?
- [x] Still need confirmation alerts.
  - [ ] Still needed for projects. -- No it's not, we will direct them to project page. Only alert if error (low-priority).
- [x] Cleaned up login failure messages.
- [x] Make delete button easier to read (angular Material makes harder than it should be).
- [x] When user submits new project, go to that screen immediately (more observers).

(Was I really overthinking things with the observers stuff? I don't think so -- I don't think a change in the service's value would automatically eb changed in a controller that was looking at it. You have to tell the controller: "look at it now!")

- [x] Issue discovered: Project is added to DB if it has no types, but will NOT show up in our query for all of a user's projects. Easiest fix is validate for a type, which we probably want anyway.
- [x] Organization name can now be changed and saved to DB (this was a casualty of the recent refactoring).


- [x] Clicking X on modals closes them
- [x] New project from dash (no observer needed)
- [x] New project from projects (seems observer needed -- so could just observe new project, change clickedProject)
- [x] Popup FAQ like on footprintproject.io site
  - [ ] Should probably put similar one on the Footprint upload modal.
  - [ ] Also, it's a BIG issue that they don't work if they don't have enough height space.
  - [ ] Would also be nice to get the width of their hover-activation element constrained.
- [x] Add total to donut chart. (or at least make it visible somewhere). Ok it's showing below.
 - [ ] No styling yet.
- [x] Added trademark footer and facebook icon.
   - [ ] Link to other FP page -- check out our field projects (??) -- make Contact Us button functional. (Almost there.)
   - [ ] Don't forget to add Facebook icon to Dashboard footer.
- [x] Add new Logo (edited color to charcoal).
- [x] Disallow user from entering two projects of same name (creates `md-duplicate` error)
  - [ ] ask if they instead want to view that project.

- [x] Auto-select the current project when Uploading new footprint from projects page. (had to update everyone's clickedProject -- messy architecture).
- [x] Add a scroller to the Projects list, so it doesn't get too long.
- [x] Add recommendation to use CSV to footprint upload validation (x2).
- [x] New footprint from projects (needs to change to Project, and update Project-footprints)
  - [ ] OH -- ALSO NEED TO CHANGE QUERY TO DEAL WITH MULTIPLE-WORD PROJECT NAMES (do we??).


## Next Steps:
### Top priority:
- [ ] New footprint from dash (needs to update chart)
- [ ] User's info-over-time line chart buggy. Make sure that line chart UPDATES when user enters a new footprint.
- [ ] Give diesel higher priority in CSV.
- [ ] Non-metric CSV is not correct. (just get rid of dates columns?)
- [ ] Implement forgot password.
- [ ] Make sure line chart of FP's footprint does not disappear on Trial Upload.
- [ ] Make sure Will can upload from admin page.
- [ ] Set up Admin page to display all relevant data.
- [ ] Do not show options for chart query unless it contains data -- don't even display it as an option in the dropdown. (Alert user if there is no data (i.e. identify all of those errors -- "cannot read property plane of undefined", for example))?
- [ ] Disallow user from entering two footprints of the same month for one project.
- [ ] Update `databasesetup.sql` file to reflect changes to db structure.
- [ ] Mess with the font.. Make it look better, sleeker.

### Known Bugs:
- [ ] Sometimes hovering over project names on side-dash makes them invisible???
- [ ] Sometimes hovering over bar chart switches values???
- [ ] The divided-by input dropdown sometimes displays two values???

### Transition Tool:
- [ ] I don't think size of solar grid is appropriately sensitive to overspec/dayPower.
- [ ] Let user choose metric or non- for transition tool.
- [ ] Add animations for the diesel-to-solar calculator.
- [ ] Follow Emma's idea: wrap calc page with a Start button, and walk user through inputs one by one.
- [ ] Stitch the two tools together so that one upload can take care of all the calculations.

### Quality of Life Improvements:
- [ ] This is finicky but scrolling to top and bottom, the cushion doesn't see the image. It looks bad.
- [ ] The lower shadow on hover over a button (e.g. AWS) is a nice touch.
- [ ] Make background color on home screen uniform.
- [ ] Add ` isMetric` field to Footprints table (for hover feature).
- [ ] Overall line chart should include gaps for non-uploaded months (otherwise it's prettier, but misleading).
- [ ] Would be nice to fix the page refresh issue (cacheing, etc.). (IDEA: We could use localStorage!)
- [ ] Let user view current CSV when editing or deleting -- or for that matter, show them on hover on the page or something.
- [ ] Add animations for the user-customizable charts, to ensure that there's not so much gaping white space before charts are generated. Move two large buttons to two tabs on the left when user clicks one.
- [ ] Issue: Trial run card now looks bad on narrower screens.
