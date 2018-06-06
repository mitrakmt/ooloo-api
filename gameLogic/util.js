const findOverlap = (interestsArray1, interestsArray2) => {
    const interestsObj = interestsArray1.reduce((obj, interest) => {
        obj[interest] = true;
        return obj;
    }, {});

    const mutualInterests = interestsArray2.filter((interest) => {
        return Boolean(interestsObj[interest]);
    });

    if (mutualInterests.length > 0) {
        return mutualInterests;
    }
    return null;
};

const findOpponent = (player, opponents) => {
    for (let i = 0; i < opponents.length; i++) {
        const opponent = opponents[i];
        const interests = findOverlap(player, opponent);
        if (interests !== null) {
            return { index: i, interests };
        }
    }
    return null;
};

module.exports = {
    findOverlap,
    findOpponent
}