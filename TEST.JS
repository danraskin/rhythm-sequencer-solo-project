!undefined ? console.log(true) : console.log(false);
const test = {
    BD: 'bass',
    SD: 'snare',
    HH: 'high-hat'
}

for (let drum in test) {
    console.log(`${drum}: ${test[drum]}`);
}

'' ? console.log("''",true) : console.log("''",false);