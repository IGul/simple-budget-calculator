// BUDGET CONTROLLER
let budgetController = (() => {

	function Expense(id, description, value){
		this.id = id,
		this.description = description,
		this.value = value,
		this.percentage =-1
	}

	Expense.prototype.calcPercentage = function(totalIncome) {
		console.log(this)
		if(totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100)
		}	else {
			this.percentage =-1;
		}
	};

	Expense.prototype.getPercentage = function() { this.percentage; }

	function Income(id, description, value){
		this.id = id,
		this.description = description,
		this.value = value
	}

	function calculateTotal (type) {
		let sum = 0;

		data.allItems[type].forEach( e => { sum += e.value; });

		data.totals[type] = sum;
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
		percentage: -1

	}

	return{
		addItem: (type, des, val) => {
			let newItem, ID;
			
			// Create new ID // ID = lastId + 1
			if (data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length -1].id + 1;
			} else {
				ID = 0;
			}

			// create new data item based on 'income' or 'expense'
			if (type === 'inc'){
				newItem = new Income(ID, des, val);
			} else if (type === 'exp'){
				newItem = new Expense(ID, des, val);
			}

			data.allItems[type].push(newItem);

			return newItem;
		},

		calculateBudget: () => {

			calculateTotal('inc');
			calculateTotal('exp');

			data.budget = data.totals.inc - data.totals.exp;

			if(data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}

		},

		calculatePercentages: () => {
			data.allItems['exp'].forEach((element) => {
				element.calcPercentage(data.totals.inc);
			})
		},

		getPercentages: () => {
			let allPer = data.allItems.exp.map(current => current.percentage)
			return allPer;
		},

		returnBudget: () => {
			return {
				budget: data.budget,
				income: data.totals.inc,
				expense: data.totals.exp,
				percentage: data.percentage
			}
		},

		deleteItem: (type, id) => {
			data.allItems[type].forEach((element, index) => {
				if(element.id === id){
					data.allItems[type].splice(index, 1);
				}
			});
		},

		testing: function() {
			console.log('testing')
		}
	}

})();

budgetController.testing()

// UI CONTROLLER
let UIController = (() => {
	
	const DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetValue: '.budget__value',
		budgetIncome: '.budget__income--value',
		budgetExpenses: '.budget__expenses--value',
		budgetExpensePercentage: '.budget__expenses--percentage',
		container: '.container',
		expPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	}


	return {
		getInput: () => {
			return {
				type: document.querySelector(DOMstrings.inputType).value,
			 	description: document.querySelector(DOMstrings.inputDescription).value,
			 	value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		addListItem: (obj, type) => {
			let html, newHtml, element;

			if (type === 'inc') {
				element = DOMstrings.incomeContainer;

				html =	`<div class="item clearfix" id="inc-%id%">
			                <div class="item__description">%description%</div>
			                	<div class="right clearfix">
			                   	<div class="item__value">+ %value%</div>
			                    	<div class="item__delete">
			                        	<button class="item__delete--btn">
			                        		<i class="ion-ios-close-outline"></i>'
			                    		</button>
			                   	</div>
			                	</div>
			            	</div>`;

      } else if (type === 'exp') {
				element = DOMstrings.expenseContainer;

      	html = 	`<div class="item clearfix" id="exp-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">- %value%</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn">
                                	<i class="ion-ios-close-outline"></i>
                            	</button>
                            </div>
                        </div>
                    </div>`;
      }


			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: () => {
			let field;

			fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`)
		
			fieldsArray = Array.prototype.slice.call(fields);

			fieldsArray.forEach((current, index, array) => { current.value = ""; })

			fieldsArray[0].focus();
		},

		displayBudget: (total) => {

			document.querySelector(DOMstrings.budgetValue).textContent = total.budget;
			document.querySelector(DOMstrings.budgetIncome).textContent = total.income;
			document.querySelector(DOMstrings.budgetExpenses).textContent = total.expense;
			
			if(total.percentage > 0){
				document.querySelector(DOMstrings.budgetExpensePercentage).textContent = total.percentage + '%';
			} else {
				document.querySelector(DOMstrings.budgetExpensePercentage).textContent = '---';
			}
		},

		updatePercentages: (percentages) => {
			let fields;

			fields = document.querySelectorAll(DOMstrings.expPercLabel);

			let nodeListForEach = (list, callback) => {
				for (let i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
			}

			nodeListForEach(fields, (current, index) => {
				if(percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});

		},

		displayDate: function() {
			let now, months, year, month;

			months = ['January', 'Feburary', 'March', 'April', 'March', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

			now = new Date();
			year = now.getFullYear();
			month = now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]} ${year}`;

		},

		deleteItem: selector => {
			document.getElementById(selector).parentNode.removeChild(document.getElementById(selector));
		},

		formatNumber: (number, type) => {
			let numSplit;

			number = Math.abs(number);
			number = number.toFix(2);

			if(type === 'inc') {
				return '+ ' + number;
			} else if(type === 'exp') {
				return '- ' + number;
			}
		},

		getDOMstrings: function() {
			return DOMstrings;
		}

	} 


})();

// GLOBAL APP CONTROLLER
let controller = ((budgetCntrl, UICntrl) => {

	let setupEventListeners = () => {
		const DOM = UICntrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	
		document.addEventListener('keypress', event => {
			if(event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		})
	}
	
	let updateBudget = () => {
		let total;

		budgetCntrl.calculateBudget();

		total = budgetCntrl.returnBudget();

		UICntrl.displayBudget(total);
	};

	let updatePercentages = () => {
		let percentages;

		budgetCntrl.calculatePercentages()
		
		percentages = budgetCntrl.getPercentages();

		UICntrl.updatePercentages(percentages);
	}

	let ctrlAddItem = function() {
		let input, newItem;

		input = UICntrl.getInput();

		if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

			newItem = budgetCntrl.addItem(input.type, input.description, input.value);

			UICntrl.addListItem(newItem, input.type);

			UICntrl.clearFields();

			updateBudget();

			updatePercentages();
		}

	}

	let ctrlDeleteItem = event => {
		let itemID, splitID,type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if(itemID){

			// inc-1
			splitID = itemID.split('-'); 
			type = splitID[0];
			ID = parseInt(splitID[1]);

			budgetCntrl.deleteItem(type, ID);

			UICntrl.deleteItem(itemID);

			updateBudget();

			updatePercentages();
		}

	}

	return {
		init: function() {
			console.log('Application has started!');
			UICntrl.displayDate();
			UICntrl.displayBudget({
				budget: 0,
				income: 0,
				expense: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	}

	
})(budgetController, UIController);

controller.init();



