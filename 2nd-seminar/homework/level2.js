function getFemale(members) {
    return new Promise((resolve, reject) => {
        if (typeof members !== typeof []) {
            reject(new Error("type error!"));
        }

        const FEMALE = "여";

        setTimeout(() => {
            const femaleMembers = members.filter(member => {
                return member.gender === FEMALE;
            });

            resolve(femaleMembers);
        }, 500);
    });
}

function getYB(members) {
    return new Promise((resolve, reject) => {
        if (typeof members !== typeof []) {
            reject(new Error("type error!"));
        }
        const YB = "YB";

        setTimeout(() => {
            const YBMembers = members.filter(member => {
                return member.status === YB;
            });

            resolve(YBMembers);
        }, 500);
    });
}

function getIOS(members) {
    return new Promise((resolve, reject) => {
        if (typeof members !== typeof []) {
            reject(new Error("type error!"));
        }

        const IOS = "iOS";

        setTimeout(() => {
            const IOSMembers = members.filter(member => {
                return member.part === IOS;
            });

            resolve(IOSMembers);
        }, 500);
    });
}

function init() {
    const members = require("./members");

    getFemale(members)
        .then(filteredData => getYB(filteredData))
        .then(filteredData => getIOS(filteredData))
        .then(filteredData => console.log(filteredData))
        .catch(error => console.error(error));
}

init();
