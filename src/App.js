import React from "react";
import "./styles/index.css";
import { WorkField } from "./WorkField";
import {Display} from './Display';


function avoidEval(num) {
  return Function(`'use strict'; return (${num})`)();
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEqualed: false,
      rightHand: "",
      leftHand: "",
      lastTerm: 0,
      display: 0,
      hasDecimal: false,
      lastClicked: "",
    };

    this.handleChangeNumber = this.handleChangeNumber.bind(this);
    this.handleChangeDecimal = this.handleChangeDecimal.bind(this);
    this.handleChangeZero = this.handleChangeZero.bind(this);
    this.handleChangeOperator = this.handleChangeOperator.bind(this);
    this.handleChangeSubtract = this.handleChangeSubtract.bind(this);
    this.handleChangeEquals = this.handleChangeEquals.bind(this);
    this.handleChangeAC = this.handleChangeAC.bind(this);
  }

  /// -----------one thru nine------------

  handleChangeNumber(event) {
    let pressed = event.target.attributes["data-value"].value;

    if (this.state.isEqualed == true || this.state.display === 0) {
      this.setState((state) => ({
        isEqualed: false,
        rightHand: "",
        leftHand: pressed,
        lastTerm: "",
        display: pressed,

        lastClicked: pressed,
      }));
    } else {
      this.setState((state) => ({
        display: state.display + pressed,
        leftHand: state.leftHand + state.lastTerm + pressed,

        lastClicked: pressed,
        lastTerm: "",
      }));
    }
  }

  //------- all clear-------------

  handleChangeAC() {
    this.setState({
      isEqualed: false,
      rightHand: "",
      leftHand: "",
      lastTerm: "",
      display: 0,
      hasDecimal: false,
      lastClicked: "",
    });
  }

  //---------Zero-------------

  handleChangeZero(event) {
    let pressed = event.target.attributes["data-value"].value;
    if (this.state.lastTerm || this.state.display === 0) {
      return;
    }
    if (this.state.isEqualed == true) {
      this.setState((state) => ({
        isEqualed: false,
        rightHand: "",
        leftHand: pressed,
        lastTerm: "",
        display: pressed,

        lastClicked: pressed,
      }));
    } else {
      this.setState((state) => ({
        display: state.display + pressed,
        leftHand: state.leftHand + state.lastTerm + pressed,
        lastClicked: pressed,
        hasDecimal: false,
        lastTerm: "",
      }));
    }
  }
  //--------Decimals---------
  // make so you can't enter more than one decimal in same number-- fixed
  // write "0." after operator rather than just '.'-- fixed

  handleChangeDecimal(event) {
    let pressed = event.target.attributes["data-value"].value;
    if (this.state.lastClicked == pressed || this.state.hasDecimal == true) {
      return;
    } else if (this.state.lastTerm) {
      this.setState((state) => ({
        display: state.display + pressed,
        leftHand: state.leftHand + state.lastTerm + pressed,
        lastClicked: pressed,
        lastTerm: "",
        hasDecimal: true,
      }));
    } else if (this.state.isEqualed == true || this.state.display === 0) {
      this.setState((state) => ({
        isEqualed: false,
        rightHand: "",
        leftHand: pressed,
        lastTerm: "",
        display: pressed,
        lastClicked: pressed,
        hasDecimal: true,
      }));
    } else {
      this.setState((state) => ({
        display: state.display + ".",
        leftHand: state.leftHand + state.lastTerm + ".",
        lastClicked: pressed,
        lastTerm: "",
        hasDecimal: true,
      }));
    }
  }

  //------------Operators---------------------

  handleChangeOperator(event) {
    let pressed = event.target.attributes["data-value"].value;
    if (this.state.isEqualed == false && this.state.display === 0) {
      return;
    } else if (this.state.isEqualed == true) {
      this.setState((state) => ({
        isEqualed: false,
        display: pressed,
        leftHand: state.rightHand,
        hasDecimal: false,
        lastClicked: pressed,
        lastTerm: pressed,
        rightHand: "",
      }));
    } else if (this.state.lastTerm) {
      this.setState((state) => ({
        display: pressed,
        lastClicked: pressed,
        lastTerm: pressed,
        hasDecimal: false,
      }));
    } else {
      this.setState((state) => ({
        display: pressed,
        lastClicked: pressed,
        lastTerm: pressed,
        hasDecimal: false,
      }));
    }
  }

  //-----------subtract------------
  // todo:  operator + subtract + subtract --> plus? ie /-- becomes +

  handleChangeSubtract(event) {
    let pressed = event.target.attributes["data-value"].value;
    if (this.state.isEqualed == true) {
      this.setState((state) => ({
        isEqualed: false,
        display: pressed,
        leftHand: state.rightHand,
        hasDecimal: false,
        lastClicked: pressed,
        lastTerm: pressed,
        rightHand: "",
      }));
    } else if (this.state.lastClicked == "+") {
      this.setState((state) => ({
        display: pressed,
        hasDecimal: false,
        lastClicked: pressed,
        lastTerm: pressed,
      }));
    } else if (this.state.lastClicked == "-") {
      this.setState((state) => ({
        display: "+",
        hasDecimal: false,
        lastClicked: "+",
        lastTerm: "+",
      }));
    } else if (this.state.lastClicked == "*" || this.state.lastClicked == "/") {
      this.setState((state) => ({
        display: state.display + pressed,
        lastClicked: pressed,
        lastTerm: state.display + pressed,
        hasDecimal: false,
      }));
    } else {
      this.setState((state) => ({
        display: state.display + pressed,
        lastClicked: pressed,
        lastTerm: pressed,
        hasDecimal: false,
      }));
    }
  }

  //---evalutate--------

  handleChangeEquals(event) {
    let pressed = event.target.attributes["data-value"].value;
    if (this.state.isEqualed == true) {
      return;
    } else {
      //parseFloat removes trailing zeros & toPrecision deals with JS's decimal problems
      let result = parseFloat(
        avoidEval(`${this.state.leftHand}`).toPrecision(16)
      );

      this.setState((state) => ({
        display: result,
        leftHand: state.leftHand + pressed + result,
        isEqualed: true,
        rightHand: result,
        lastTerm: "",
        lastClicked: "",
        hasDecimal: false,
      }));
    }
  }

  render() {
    return (
      <div>
        <div id="calculator">
          <WorkField show={this.state.leftHand} />
          <Display show={this.state.display} />
          <div id="button-field">
            <div id="clear" onClick={this.handleChangeAC}>
              {" "}
              AC{" "}
            </div>
            <div
              class="number oneThruNine"
              data-value="1"
              id="one"
              onClick={this.handleChangeNumber}
            >
              1
            </div>
            <div
              class="number"
              data-value="2"
              id="two"
              onClick={this.handleChangeNumber}
            >
              2
            </div>
            <div
              class="number"
              data-value="3"
              id="three"
              onClick={this.handleChangeNumber}
            >
              3
            </div>
            <div
              class="number"
              data-value="4"
              id="four"
              onClick={this.handleChangeNumber}
            >
              4
            </div>
            <div
              class="number"
              data-value="5"
              id="five"
              onClick={this.handleChangeNumber}
            >
              5
            </div>
            <div
              class="number"
              data-value="6"
              id="six"
              onClick={this.handleChangeNumber}
            >
              6
            </div>
            <div
              class="number"
              data-value="7"
              id="seven"
              onClick={this.handleChangeNumber}
            >
              7
            </div>
            <div
              class="number"
              data-value="8"
              id="eight"
              onClick={this.handleChangeNumber}
            >
              8
            </div>
            <div
              class="number"
              data-value="9"
              id="nine"
              onClick={this.handleChangeNumber}
            >
              9
            </div>
            <div
              class="number"
              data-value="0"
              id="zero"
              onClick={this.handleChangeZero}
            >
              0
            </div>
            <div
              class="number"
              data-value="0."
              id="decimal"
              onClick={this.handleChangeDecimal}
            >
              .
            </div>

            <div
              class="operator"
              data-value="/"
              id="divide"
              onClick={this.handleChangeOperator}
            >
              /
            </div>
            <div
              class="operator"
              data-value="*"
              id="multiply"
              onClick={this.handleChangeOperator}
            >
              *
            </div>
            <div
              class="operator"
              data-value="+"
              id="add"
              onClick={this.handleChangeOperator}
            >
              +
            </div>
            <div
              class="operator"
              data-value="-"
              id="subtract"
              onClick={this.handleChangeSubtract}
            >
              -
            </div>

            <div
              class="operator"
              data-value="="
              id="equals"
              onClick={this.handleChangeEquals}
            >
              =
            </div>
          </div>
        </div>
        <div id="by-line">
          {" "}
          Made by Cary Tanner <br /> July 2020{" "}
        </div>
      </div>
    );
  }
}



export default App;
