// NOTE: Kanka provider removed from registration (deprecated).
// If you need the original implementation it should be moved to src/providers/deprecated/kanka

const ddb = require('./ddb/ddbProvider');
register(ddb);