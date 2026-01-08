Kanka provider deprecated

The Kanka provider was removed from active registration and references to Kanka were cleared from docs/config.
If you need to restore it:
- Move the provider implementation back to src/providers/kanka
- Re-register it in src/providers/index.js

This file preserves the note so future maintainers can recover the provider if desired.
