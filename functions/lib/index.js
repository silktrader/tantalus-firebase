"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
exports.searchFields = functions.firestore.document('foods/{foodID}').onWrite((change, context) => {
    const food = change.after;
    // was deleted, leave
    if (!food)
        return null;
    const oldName = food.get('name');
    // update and name was unchanged
    if (food.get('searchableName') === oldName)
        return null;
    // update name when it differs to avoid infinite onWrite triggers
    const newName = getNormalisedName(oldName);
    if (oldName !== newName) {
        return change.after.ref.update({
            searchableName: newName,
        });
    }
    return null;
});
function getNormalisedName(name) {
    // return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return name.toLowerCase();
}
//# sourceMappingURL=index.js.map