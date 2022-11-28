function checkEmail(email) {
    //email error checking
    let re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (re.test(email.trim()) === false) {
      throw "INVALID EMAIL! TRY AGAIN!";
    }
};
  
function validatePhone(phone) {
    //Validate Phone number
    let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (re.test(phone.trim()) === false) {
      throw "INVALID PHONE NUMBER! TRY AGAIN!";
    }
};
function checkInputString(input) {
    if(!input) throw 'ERROR: ALL FIELDS MUST HAVE AN INPUT!';
    if (typeof input !== 'string') throw "ERROR: INPUT MUST BE A STRING!";
    if (input.trim().length === 0)
      throw 'INPUT CANNOT BE AN EMPTY STRING OR STRING WITH JUST SPACES';
};
function checkInputPassword(input) {
    if (!input){
        throw "ERROR: PASSWORD MUST BE INPUTTED";
    }
    if (typeof input !== "string") {
        throw "ERROR: PASSWORD MUST BE A STRING!"
    }
    let rePass = /^[a-zA-Z0-9.\-_$#&@*!]{6,}$/;
    if (rePass.test(input) === false) {
        throw "ERROR: Not a valid password!";
    }
}
function checkAge(input){
    if(!input) throw "Error : Age must have an input."
    if(typeof input !== 'number') throw "Error : Age must be a number."
    if(input <16 || input >90) throw "Error : Invalid Age"
}
module.exports ={
    checkEmail,
    validatePhone,
    checkInputString,
    checkInputPassword,
    checkAge
};