# Project Footprint: Extended

## Changes made:
- [x] Refactored CSV parsing and footprint computation to minimize code-duplication.
- [x] That is, consolidated trial upload, footprint upload and footprint edit to follow one set of functions.
- [x] Fixed bug where CSV was not being properly parsed (because of extra date column).
- [x] Fixed bug where conversion to Imperial measurement required integer value.

## Next Steps:
- [ ] Add response to user when footprint or project has been successfully posted/edited.
- [ ] Disallow user from uploading new month for already-uploaded month.
