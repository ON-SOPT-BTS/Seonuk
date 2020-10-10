const memberContainer = require("./member");
const members = memberContainer.members;

const teamNumber = Math.floor(Math.random() * 10) + 1; //from 1 to random (< 10)
const shuffleMembers = members.sort(() => Math.random() - 0.5);

const team = {};

for (let i = 0; i < teamNumber; i++) {
    team[`${i + 1}조`] = [];
}

let OBIdx = 0,
    YBIdx = 0;

shuffleMembers.forEach(member => {
    if (member.status === "OB") {
        team[`${OBIdx + 1}조`].push(member);
        OBIdx = ++OBIdx % teamNumber;
    } else {
        team[`${YBIdx + 1}조`].push(member);
        YBIdx = ++YBIdx % teamNumber;
    }
});

console.log(`조 개수 : ${teamNumber}`);
console.log(team);
