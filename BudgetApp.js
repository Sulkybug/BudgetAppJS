class Category {
  constructor(name) {
    this.name = name;
    this.ledger = [];
    this.funds = 0;
  }

  deposit(amount, description) {
    this.funds += amount;
    this.ledger.push({ amount: amount, description: description });
  }

  withdraw(amount, description) {
    if (this.check_funds(amount)) {
      amount = -amount;
      this.funds += amount;
      this.ledger.push({
        amount: amount,
        description: description || "Withdraw ",
      });
      return true;
    } else {
      return false;
    }
  }

  get_balance() {
    return this.funds;
  }

  transfer(amount, category) {
    if (this.check_funds(amount)) {
      category.deposit(amount, `Deposit to ${category.name}`);
      amount = -amount;
      this.funds += amount;
      this.ledger.push({
        amount: amount,
        description: `Transfer to ${category.name}`,
      });
      return true;
    } else {
      return false;
    }
  }

  check_funds(amount) {
    return this.funds >= amount;
  }

  // resume to print all movements and total
  resume() {
    let title = "";

    function addingSpaces(description, amount) {
      const spaces =
        30 -
        ((description.length > 23 ? 23 : description.length) + amount.length);
      let result = "";
      for (let i = 0; i < spaces; i++) {
        result += " ";
      }
      return result;
    }

    for (let i = 0; i < 30 - this.name.length; i++) {
      const categoryName = this.name;
      if (i == (30 - categoryName.length) / 2) {
        for (let z = 0; z < categoryName.length; z++) {
          title += categoryName[z];
        }
      }
      title += "*";
    }

    console.log(title);

    for (let i = 0; i < this.ledger.length; i++) {
      console.log(
        (this.ledger[i].description.length > 23
          ? this.ledger[i].description.slice(0, 23)
          : this.ledger[i].description) +
          addingSpaces(
            this.ledger[i].description,
            this.ledger[i].amount.toFixed(2)
          ) +
          this.ledger[i].amount.toFixed(2)
      );
    }

    console.log(`Total: ${this.get_balance()}`);
  }
}

//barchart function
function create_spend_chart(...categories) {
  let allWithdraws = 0;
  let cats = {};
  let catsNames = [];
  for (let i = 0; i < categories[0].length; i++) {
    let expenses = categories[0][i].funds - categories[0][i].ledger[0].amount;
    cats[i] = -expenses.toFixed(2);
    catsNames.push(categories[0][i].name);
    allWithdraws += -expenses;
  }

  for (const key in cats) {
    //setting the percentage to 1 single number without rounding
    cats[key] = Math.trunc((cats[key] * 100) / allWithdraws / 10);
  }

  // count the largest name
  let maxlenght = 0;
  for (let i = 0; i < catsNames.length; i++) {
    if (catsNames[i].length > maxlenght) {
      maxlenght = catsNames[i].length;
    }
  }

  // printing lines
  let line = "";
  let negLines = 0;
  for (let l = 11; l >= -1 - maxlenght; l--) {
    if (l == 11) {
      console.log("Percentage spent by category");
    } else if (l == 10) {
      line = `${l * 10}|`;
    } else if (l == 0) {
      line = `  ${l}|`;
    } else if (l > 0) {
      line = ` ${l * 10}|`;
    }
    if (l <= cats[0] && l >= 0) {
      line += " o";
    }

    for (const key in cats) {
      if (l <= cats[key] && cats[key] != 6 && l >= 0) {
        line += "  o";
      }
    }

    if (l == -1) {
      line = "";
      line += "    -";
      for (const key in cats) {
        line += "---";
      }
    }

    if (l < -1) {
      line = "";
      line += "    ";
      for (let j = 0; j < maxlenght; j++) {
        if (negLines == j) {
          for (let i = 0; i < catsNames.length; i++) {
            if (catsNames[i][negLines] == undefined) {
              line += "   ";
            } else {
              line += ` ${catsNames[i][negLines]} `;
            }
          }
        }
      }
      negLines += 1;
    }
    if (line != "") {
      console.log(line);
    }
  }
}

const food = new Category("Food");
food.deposit(1000, "initial deposit");
food.withdraw(10.15, "groceries");
food.withdraw(15.89, "restaurant and more food for dessert");

const clothing = new Category("Clothing");
food.transfer(50, clothing);
console.log(food.get_balance());

clothing.withdraw(25.55);
clothing.withdraw(100);

const auto = new Category("Auto");
auto.deposit(1000, "initial deposit");
auto.withdraw(15);

food.resume();
clothing.resume();
auto.resume();

create_spend_chart([food, clothing, auto]);
