
const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector("[data-length-count]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '`~@#$%^&*()_+-={[}]:;"?/><.,\|'

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

// sets password length acc to slider

console.log(document);

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min)) + "% 100%";
    // inputSlider.style.background =  yellow;
}


function setIndicator(color){
    indicator.style.background = color;
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}';
    console.log(color);
}

function getRandomInt(min,max){
   return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNum(){
    return getRandomInt(0,9);
}
function generateLowercase(){
  return String.fromCharCode(getRandomInt(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInt(65,91));
}

function generateSymbols(){
    const random = getRandomInt(0,symbols.length);
    return symbols.charAt(random);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum  = false;
    let hasSym  = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper ) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied"
    }
    catch{
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active")
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array){
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el) => (str += el));
    return str;
}

// 
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    })

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value != null){
        copyContent();
    }
})

generateBtn.addEventListener('click',() => {
    //none of the checkbox are selected 
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //find new password

    // remvoe old password
    console.log('starting the journey');
    password = "";

    // lets put the stuf mentioned by the checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNum();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbols();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNum);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    console.log('compulsory addition done');

    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRandomInt(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log('additional addition done');

    //shuffle the password

    password = shufflePassword(Array.from(password));
    console.log('shuffling  done');

    //show in UI

    passwordDisplay.value = password;
    //calculate strength
    calcStrength();
});

