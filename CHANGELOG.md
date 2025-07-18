# Changelog

## v1.1.7

- Added support for multi-tile Home app view (users can choose one tile or multiple accessories)
- Refactored platform logic to improve accessory initialization and caching behavior
- Improved internal type annotations for Homebridge compliance
- Cleaned up redundant log messages and removed vestigial platform code
- Updated battery and category support for future extension
- Verified plugin alignment with latest Homebridge and iRobot specs

## v1.1.6

- Fixed plugin version mismatch causing 400 error during publish
- Refined `config.schema.json` to match Homebridge UI standards (dropdowns, validation)
- Updated platform file to align with Homebridge lifecycle best practices
- Confirmed accessory category override to ensure Home app compatibility
- Improved accessory switching behavior and fan-based representation

## v1.1.5

- Added hybrid support for local-only and advanced Roomba models
- Switched to classic Fan service for better Home app tile compatibility
- Introduced explicit dock switch accessory
- Integrated basic battery service for legacy Roombas
- Cleaned up accessory code and removed unused constants
- Fixed accessory category handling to prevent build errors
- Improved logging and error feedback
- Updated `.npmignore` to exclude source and simplify package
- Revised publish workflow to default to stable release
- Fully aligned with O‑Matic Factory brand and architecture guidelines

## v1.0.0-beta.1

- Initial O‑Matic Factory release
- Reimagined Homebridge vacuum integration from scratch
- TypeScript-first design, built for extensibility
