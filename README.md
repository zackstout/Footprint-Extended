# Project Footprint: Extended

## Changes made:
### Refactoring:
- [x] Refactored CSV parsing and footprint computation to minimize code-duplication. (Consolidated trial upload, footprint upload and footprint edit to follow one set of functions.)
- [x] Refactored routers into multiple files.
- [x] Fixed graphs that were broken in refactoring by changing route URLs.

### Bug-fixing:
- [x] Fixed bug where CSV was not being properly parsed (because of extra date column).
- [x] Fixed bug where conversion to Imperial measurement required integer value.
- [x] Fixed bug where sometimes controller reloads when you submit second part of transition tool -- was an issue with hashing (which were stored in URL and hence cached on refresh, but not hard refresh).

### New features:
- [x] Created new page and hide/show functionality for sequential diesel-to-solar calculator.
- [x] Add animations for the diesel-to-solar calculator.
- [x] Add more instructions for the user on how to navigate through the site.
- [x] Store user-entered data about diesel systems (like with trial footprints) for admin to view.
- [x] Let user get to transition tool and save their data; display proper return-button and post to proper table in database.
- [x] Only display fiscal savings if it's a positive number.
- [x] Added a workaround (second input) for now. [Problem: Change gallons/day to input (and probably also kWh/ day). Seems to be a 2-way binding issue. Yeesh... a lot of research into angular is turning up nothing for fixing this. There must be an easy fix.]
- [x] Added instructions for using Excel (the formatting is fine on Dad's and Kyle's computers).


## Next Steps:
### High-priority:
- [ ] Change DB posts to reflect our workaround (user can alter dailyGallons).
    - [ ] This is a bit harder than I thought. We need to know whether or not user has altered that field (?) -- I guess we can check whether kWh/day is equal to product of the first three input fields.
    - [ ] No, an easier way to check is to see if knownDailyLiters is same as dailyLiters.
- [ ] As is deployment...why isn't it working anymore???
- [ ] Non-metric CSV is not correct. (will be easy to fix when adding in Excel versions.)
- [ ] Need to make mobile-friendly (or AT LEAST tablet-friendly).

### Bugs:
- [ ] Bug: All charts work; the issue is with changing to a new query after having viewed one chart. So it's an Angular/Chart.js issue, not an issue with the logic. (Same) bug with `md-options` and duplicate values. Just clear all values on submit?
- [ ] Bug: When budget per watt is higher, time to cover costs should also be higher (since cost of solar grid is higher). We see the opposite effect. Yeah, time-to-cover-cost function is definitely broken. *I am fairly confident this is because of an ordering problem* -- because on the happy path, if you happen to do things in the right order, the math works out.
- [ ] I don't think size of solar grid is appropriately sensitive to overspec/dayPower.
- [ ] Bug: adding new CSV doesn't seem to be affecting totals graph, unless the numbers are too small to be affecting it.

### Testing:
- [ ] Make sure to test uploading test CSVs and see that graphs properly reflect them.


## Quality of Life Improvements:
### More simple:
- [ ] Add response to user when footprint or project has been successfully posted/edited.
- [ ] Disallow user from uploading new month for already-uploaded month.
- [ ] Split up controllers and services further (especially user controller and user service).
- [ ] Let user choose metric or non for transition tool.
- [ ] Add hover text to clarify the meaning of overspec and day Power.
- [ ] Add a "no data for this query" image or text, so there's more than just an error in the console.
- [ ] Should probably just remove Start date/End date columns from the CSV altogether.
- [ ] Ensure there are hover-changes on *every* button.
- [ ] On Projects page, display project's country and type(s).

### Less simple:
- [ ] Would be nice to fix the page refresh issue (cacheing, etc.).
- [ ] Let user view current CSV when editing or deleting -- or for that matter, show them on hover on the page or something.
- [ ] Add animations for the user-customizable charts, to ensure that there's not so much gaping white space before charts are generated. Move two large buttons to two tabs on the left when user clicks one.
- [ ] Overall line chart should include gaps for non-uploaded months (otherwise it's prettier, but misleading).
