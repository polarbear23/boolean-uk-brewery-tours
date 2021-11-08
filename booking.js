
const h3StateEl = document.querySelector("h3");
const form = document.querySelector("form");
h3StateEl.innerText = `${state.selectStateInput} Booking service`;
const inputName = document.createElement("input");
const inputEmail = document.createElement("input");
const inputDateOfBooking = document.createElement("input");
const inputTimeOfBooking = document.createElement("input");
const submitBtn = document.createElement("button");
inputName.className = "formBooking";
inputEmail.className = "formBooking";
inputDateOfBooking.className = "formBooking";
inputTimeOfBooking.className = "formBooking";
inputName.type = "text";
inputName.placeholder = "Name";
inputEmail.type = "email";
inputEmail.placeholder = "Email";
inputDateOfBooking.type = "date";
submitBtn.innerText = "Confirm Booking";
inputDateOfBooking.min = getCurrentDate();
inputTimeOfBooking.type = "time";
inputTimeOfBooking.min = "09:00";
inputTimeOfBooking.max = "18:00";
form.append(inputName, inputEmail, inputDateOfBooking, inputTimeOfBooking, submitBtn);

function getCurrentDate(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
    let yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
      mm='0'+mm
    } 
    today = yyyy+'-'+mm+'-'+dd;
    return today;
}