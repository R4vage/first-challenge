

/* Scripts para saber si tiene menos de un año */

const calculatorForm = document.getElementById('js-calculator__form')

const radioDays = document.getElementById('js-less-than-a-year-radio')

const radioYears = document.getElementById('js-more-than-a-year-radio')

const inputYears = document.getElementById('js-calculator__input-years')
const inputDays = document.getElementById('js-calculator__input-days')
console.log(inputYears.children['years'])

radioYears.onclick = function (){
    inputYears.style.display = 'flex'
    inputYears.children['years'].required = true
    inputDays.style.display = 'none'
    inputDays.children['days'].required = false
}

radioDays.onclick = function (){
    inputYears.style.display = 'none'
    inputYears.children['years'].required = false
    inputDays.style.display = 'flex'
    inputDays.children['days'].required = true
}




