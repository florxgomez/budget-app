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
        }
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

            data.allItems[type].push(newItem);
            return newItem;
        },

        testing: function(){
            console.log(data);
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
        expensesContainer: '.expenses__list'
    }
    return {
        getInput: function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value, // inc or exp
                desc : document.querySelector(DOMStrings.inputDesc).value,
                value : document.querySelector(DOMStrings.inputValue).value
            }
        },

            addListItem: function(obj, type){
                let html, newHTML, element;
                if(type === 'inc'){
                    element = DOMStrings.incomeContainer;
                    html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                } else if(type === 'exp'){
                    element = DOMStrings.expensesContainer;
                    html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                }

                newHTML = html.replace('%id%', obj.id);
                newHTML = newHTML.replace('%desc%',obj.desc);
                newHTML = newHTML.replace('%value%', obj.value);
                
                document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

            },

            getDOMStrings: function(){
                return DOMStrings;
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
    };

    const ctrlAddItem = function(){
        let input, newItem;
        
        input = UICont.getInput();

        newItem = budgetCont.addItem(input.type, input.desc, input.value);

        UICont.addListItem(newItem, input.type);


    };

    return {
        init: function(){
            console.log('application has started');
            setUpEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();