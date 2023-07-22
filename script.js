const inputSlider = document.querySelector("[data-lenghtSlider]");
const lengthDisplay = document.querySelector("[data-lenghtNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
// at starting the password is empty
let password = "";
// the default lenght of the password is 10
let passwordLength = 10;
// first checkbox has a tick 
let checkCount = 0;
// it sets the password lenght
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");



//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// set the color of the circle indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// it generates random numbers between min and max
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// to generate a random number(0-9)
function generateRandomNumber() {
    return getRndInteger(0,9);
}

// to generate and convert asci-value to lowercase character

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

// to generate and convert asci-value to upercase character

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

//   to generate symbol
function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    // charAt tells that what character is there on that index
    return symbols.charAt(randNum);
}

//  this function sets the indicator wheather the password
// made is strong or weak and also chages the color of the indicator 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
  }

// this function copies the password for further use.
async function copyContent() {
    try {
      // this method copies the created password to the clipboard
        await navigator.clipboard.writeText(passwordDisplay.value);
     // until the password is copied the copies text wont be shown because of await method
        copyMsg.innerText = "copied";
    }
    catch(e) {
     // this line tells that by any chance if there is an error then the copyMsg logo will show "failed " text
        copyMsg.innerText = "Failed";
    }

    //  to make the copyMsg span visible 
    copyMsg.classList.add("active");
    
    
    //    this helps to remove the class after a paticular time
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// this fuction is applied to check and count each time when the
//  checkbox is checked and when the checkbox is unchecked.
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

// it is a special condition 
// if the passwordLenght is less than the checkboxes you have checked the 
// the passwordLength will automatically change to the number of the checkboxes you have checked
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// here the above function is added to the eventlistener 
// here the eventlistener is applied so that we can get the count how many checkboxes are ticked or checked
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//  an eventListener is appiled to the inputSlider so that to change the lenghtDisplay
//  everytime whenever there is a change in the InputSlider .
inputSlider.addEventListener('input', (e) => {
      // it will update the value of passwordLenght
    passwordLength = e.target.value;
     // this function call will change the value of lenghtDisplay
    handleSlider();
})

// this eventListener tells us that if there is a value in the passwordDisplay then only the copyConent () will work.
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});






 





   





