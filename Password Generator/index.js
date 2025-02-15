const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#upperCase");
const lowercaseCheck = document.querySelector("#lowerCase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=Checkbox]");
const symbols = '!@#$%^&*()<>,./?-+=][{}';

let password = "";
let passwordLength = 10;
let CheckCount = 1;
handleSlider();
setIndicator("#ccc");


//set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) + "% 100%"

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}';

}
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){                                    //a --------> z
 return String.fromCharCode(getRndInteger(97,123));            //97 -------> 123
}

function generateUpperCase(){                                 //A----------> Z
   return String.fromCharCode(getRndInteger(65,91));           //65---------> 91
  }

function generateSymbols(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
   let hasUpper = false;
   let hasLower = false;
   let hasNum = false;
   let hasSym = false;
   if(uppercaseCheck.checked) hasUpper=true;
   if(lowercaseCheck.checked) hasLower=true;
   if(numbersCheck.checked) hasNum=true;
   if(symbolsCheck.checked) hasSym=true;

   if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
    setIndicator("#0f0");
   } 
   else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6 ){
    setIndicator("#ff0");
   }
   else{
    setIndicator("#f00");
   }


}

async function copyContent(){ // other parts of your code can continue to run while the asynchronous task is in progress.
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}


function shufflePassword(array){
    //Fischer Yates Method
    for(let i=array.length - 1; i>0; i--){
        const j = Math.floor(Math.random()) * (i+1);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str+=el));
    return str;
}

function handleCheckBoxChange(){
    CheckCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        CheckCount++;
    });
    
    //special condition
    if(passwordLength < CheckCount){
        passwordLength = Checkcount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
   checkbox.addEventListener('change', handleCheckBoxChange);

})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    if(CheckCount <= 0) return;    //none of checkbox clicked
     
    if(passwordLength < CheckCount){
        passwordLength = CheckCount;
          handleSlider();
    }

    //remove old password
    password = "";
    
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbols();
    // }
 
  



    let funcArr = [];
    
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);
  

    //compulsary addition
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //Remaining addition
    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randIndex =  getRndInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }

    //Shuffle password
    password = shufflePassword(Array.from(password));

    passwordDisplay.value =  password;
    calcStrength();

});





