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

### New features:
- [x] Created new page and hide/show functionality for sequential diesel-to-solar calculator.
- [ ] Add animations for the diesel-to-solar calculator.
- [x] Add more instructions for the user on how to navigate through the site.
- [x] Store user-entered data about diesel systems (like with trial footprints) for admin to view.
- [x] Let user get to transition tool and save their data; display proper return-button and post to proper table in database.
- [x] Only display fiscal savings if it's a positive number.
- [x] Added a workaround (second input) for now. [Problem: Change gallons/day to input (and probably also kWh/ day). Seems to be a 2-way binding issue. Yeesh... a lot of research into angular is turning up nothing for fixing this. There must be an easy fix.]
- [x] Added instructions for using Excel (the formatting looks fine on a few different machines I've checked).
- [x] On Projects page, display project's country and type(s).
- [x] Charts' legends now display names of countries and types.
- [x] Cleaned up UI for Tracking tool on home (non-logged in) page (add hover-instructions, change download link format, add hover effects to buttons).
- [x] Added Bootstrap to make calculator page responsive -- odd that it retains its instruction to scroll user to next box on *second* time visiting the page after a refresh...
- [x] Add hover text to clarify the meaning of overspec.
- [x] Change DB posts to reflect our workaround (user can alter dailyGallons).
- [x] Issue with deployment was failing to change server `app.use` for static serving before zipping up source code. Also, don't forget to connect via postico to the endpoint provided by AWS.
  - [ ] Oooook and it looks like we have to do the VPC setup and security stuff *first*, before deploying to EB.


## Next Steps:
### High-priority:
- [ ] Non-metric CSV is not correct. (will be easy to fix when adding in Excel versions.)
- [ ] Do not show options for chart query unless it contains data.
- [ ] Disallow user from entering two projects of same name (creates `md-duplicate` error)
- [ ] Alert user if there is no data (i.e. identify all of those errors -- "cannot read property plane of undefined", for example)
- [ ] Wait, I messed up the countries display for each project: it's not showing the right country.

### Bugs:
- [ ] I don't think size of solar grid is appropriately sensitive to overspec/dayPower.
- [ ] Bug: adding new CSV doesn't seem to be affecting totals graph, unless the numbers are too small to be affecting it.
- [ ] Sometimes hovering over project names on side-dash makes them invisible???
- [ ] Sometimes hovering over bar chart switches values???
- [ ] The divided-by input dropdown sometimes displays two values???


### Testing:
- [ ] Make sure to test uploading test CSVs and see that graphs properly reflect them.


## Quality of Life Improvements:
### More simple:
- [ ] Add response to user when footprint or project has been successfully posted/edited.
- [ ] Disallow user from uploading new month for already-uploaded month.
- [ ] Split up controllers and services further (especially user controller and user service).
- [ ] Let user choose metric or non- for transition tool.
- [ ] Add a "no data for this query" image or text, so there's more than just an error in the console.
- [ ] Should probably just remove Start date/End date columns from the CSV altogether.
- [ ] Make background color on home screen uniform.
- [ ] Make `hr` tags more visible.
- [ ] Add ` isMetric` field to Footprints table (for hover feature).

### Less simple:
- [ ] Would be nice to fix the page refresh issue (cacheing, etc.). (IDEA: We could use localStorage!)
- [ ] Let user view current CSV when editing or deleting -- or for that matter, show them on hover on the page or something.
- [ ] Add animations for the user-customizable charts, to ensure that there's not so much gaping white space before charts are generated. Move two large buttons to two tabs on the left when user clicks one.
- [ ] Overall line chart should include gaps for non-uploaded months (otherwise it's prettier, but misleading).
