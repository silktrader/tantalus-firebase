import * as functions from 'firebase-functions';

export const searchFields = functions.firestore.document('foods/{foodID}').onWrite((change, context) => {

    const food = change.after;

    // was deleted, leave
    if (!food)
        return null;

    const oldName = food.get('name');
    const searchableName = food.get('searchableName');

    // update and name was unchanged
    if (searchableName === oldName)
        return null;

    // update name when it differs to avoid infinite onWrite triggers
    const newName = getNormalisedName(oldName);
    if (searchableName !== newName) {
        return change.after.ref.update({
            searchableName: newName,
        });
    }

    return null;
});

function getNormalisedName(name: string): string {
    // return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return name.toLowerCase();
}
