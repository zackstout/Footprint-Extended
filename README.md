# Project Footprint: Extended

## Changes made:
- [x] Refactored CSV parsing and footprint computation to minimize code-duplication. (Consolidated trial upload, footprint upload and footprint edit to follow one set of functions.)
- [x] Refactored routers into multiple files.
- [x] Fixed bug where CSV was not being properly parsed (because of extra date column).
- [x] Fixed bug where conversion to Imperial measurement required integer value.
- [x] Created new page and hide/show functionality for sequential diesel-to-solar calculator.

## Next Steps:
- [ ] Add response to user when footprint or project has been successfully posted/edited.
- [ ] Disallow user from uploading new month for already-uploaded month.
- [ ] Would be nice to fix the page refresh issue (cacheing, etc.).
- [ ] Split up controllers and services further.
- [ ] Add animations for the diesel-to-solar calculator.
- [ ] Add animations for the user-customizable charts, to ensure that there's not so much gaping white space before charts are generated. Move two large buttons to two tabs on the left when user clicks one.
- [ ] Let user view current CSV when editing or deleting -- or for that matter, show them on hover on the page or something.
- [ ] Add more instructions for the user on how to navigate through the site.
- [ ] Bug: adding new CSV doesn't seem to be affecting totals graph, unless the numbers are too small to be affecting it. 
