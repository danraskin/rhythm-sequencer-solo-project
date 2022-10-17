!undefined ? console.log(true) : console.log(false);
const test = {
    BD: 'bass',
    SD: 'snare',
    HH: 'high-hat'
}

for (let drum in test) {
    console.log(`${drum}: ${test[drum]}`);
}

const nullObj = {}
const obj = {}

console.log( Object.entries(nullObj),true)
 Object.entries(nullObj).length === 0 ? console.log("''",true) : console.log("''",false);