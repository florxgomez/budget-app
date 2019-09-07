const budgetController = (function() {

    const Expense = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    const Income = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 //it does not exist at this point
    }

    const calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });
        data.totals[type] = sum;
    }

    return {
        addItem: function(type, des, val){
            let newItem, id;

            if(data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            
            if(type === 'exp'){
                newItem = new Expense(id, des, val);
            } else if(type === 'inc'){
                newItem = new Income(id, des, val);
            }

            const ids = data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id){
            data.allItems[type].map(function(curr){
                return curr.id;
            })

        },

        testing: function(){
            console.log(data);
        },

        calculateBudget: function(){

            //calculate total inc and exp
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget (inc-exp)
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the % of inc that we spent
            (data.totals.inc > 0) ? data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) : data.percentage = -1;
        },

        getBudget: function(){
            return {
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }

    }
     
})(); //IIFI that returns an object containing a method

const UIController = (function() {
    const DOMStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }
    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value, // inc or exp
                desc : document.querySelector(DOMStrings.inputDesc).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: function(obj, type){
            let html, newHTML, element;
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                } else if(type === 'exp'){
                    element = DOMStrings.expensesContainer;
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                }

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%desc%',obj.desc);
            newHTML = newHTML.replace('%value%', obj.value);
                
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

            },

            getDOMStrings: function(){
                return DOMStrings;
            },

            clearFields: function(){
                let fields, fieldsArr;
                fields = document.querySelectorAll(DOMStrings.inputDesc + ', ' + DOMStrings.inputValue);

                //converting fields list to an array
                fieldsArr = Array.prototype.slice.call(fields);

                fieldsArr.forEach(function(current, index, array){
                    current.value = "";
                });

                fieldsArr[0].focus();
            },

            displayBudget: function(obj){
                document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
                document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
                

                obj.percentage > 0 ? document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%' : document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }

        };
})();

const controller = (function(budgetCont, UICont) {

    const setUpEventListeners = function() {

        const DOM = UICont.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    const updateBudget = function(){
        //Calculate budget
        budgetCont.calculateBudget();
        //Return budget
        const budget = budgetCont.getBudget();
        //Display the budget on the UI
        UICont.displayBudget(budget);
    };

    const ctrlAddItem = function(){
        let input, newItem;
        
        input = UICont.getInput();
        if(input.des !== "" && !isNaN(input.value && input.value > 0)){
            newItem = budgetCont.addItem(input.type, input.desc, input.value);

            UICont.addListItem(newItem, input.type);

            UICont.clearFields();

            //Calculate and update budget
            updateBudget();
        }
    };

    const ctrlDeleteItem = function(event){
       let itemID, splitID, type, id;
         itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

       if(itemID){
        //inc-1
        splitID = itemID.split('-');
        type = splitID[0];
        id = splitID[1];

        //Delete item from the data structure

        //Delete item from the UI

        //Update and show the new budget
       }
    }

    return {
        init: function(){
            console.log('application has started');
            UICont.displayBudget({
                budget: 0, 
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();