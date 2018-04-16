import React, { Component } from 'react';
import CurrencyFormatter from 'currency-formatter';
import './App.css';

class SalaryInput extends React.Component {
  render() {
    return (
      <label>
        Salary:
        <input type="number" value={this.props.value} onChange={this.props.onChange} />
      </label>
    );
  }
}

function Contributions(props) {
  var employeeAmount = CurrencyFormatter.format(props.employeeAmount, { code: 'GBP' });
  var employerAmount = CurrencyFormatter.format(props.employerAmount, { code: 'GBP' });
  return(
    <ul>
      <li>Employee contributions: {employeeAmount}</li>
      <li>Employer contributions: {employerAmount}</li>
    </ul>
  );
}

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = { salary: 0 };

    this.lel = 6032;
    this.pt = 8424;
    this.st = 8424;
    this.uel = 46350;

    this.employeeRates = {
      belowLEL: 0.00,
      betweenLELandPT: 0.00,
      betweenLELandST: 0.00, // unused
      betweenPTandUEL: 0.12,
      betweenSTandUEL: 0.00, // unused
      aboveUEL: 0.02,
    }

    this.employerRates = {
      belowLEL: 0.00,
      betweenLELandPT: 0.00, // unused
      betweenLELandST: 0.00,
      betweenPTandUEL: 0.00, // unused
      betweenSTandUEL: 0.138,
      aboveUEL: 0.138,
    }
  }

  handleChange(event) {
    this.setState({ salary: event.target.value });
  }

  amountBetweenThresholds(amount, lower, upper = Number.POSITIVE_INFINITY) {
    return Math.max(Math.min(amount - lower, upper - lower), 0);
  }

  salarySplit(salary) {
    return {
      belowLEL: this.amountBetweenThresholds(salary, 0, this.lel),
      betweenLELandPT: this.amountBetweenThresholds(salary, this.lel, this.pt),
      betweenLELandST: this.amountBetweenThresholds(salary, this.lel, this.st),
      betweenPTandUEL: this.amountBetweenThresholds(salary, this.pt, this.uel),
      betweenSTandUEL: this.amountBetweenThresholds(salary, this.st, this.uel),
      aboveUEL: this.amountBetweenThresholds(salary, this.uel),
    };
  }

  contributions(salarySplit, rates) {
    var total = 0.0;
    for (var property in salarySplit) {
      total += salarySplit[property] * rates[property];
    };
    return total;
  }

  employeeContributions() {
    var salarySplit = this.salarySplit(this.state.salary);
    return this.contributions(salarySplit, this.employeeRates);
  }

  employerContributions() {
    var salarySplit = this.salarySplit(this.state.salary);
    return this.contributions(salarySplit, this.employerRates);
  }

  render() {
    return (
      <div>
        <SalaryInput
          value={this.state.salary}
          onChange={(event) => this.handleChange(event)}
        />
        <Contributions
          employeeAmount={this.employeeContributions()}
          employerAmount={this.employerContributions()}
        />
      </div>
    );
  }
}

class App extends Component {
  render() {
    return(
      <Calculator/>
    )
  }
}

export default App;
