//circuitthis.Table.js
module.exports = class CircuitTable {
  constructor(nInputs) {
    (this.table = []),
      (this.input = {}),
      (this.numberOfInputs = 0),
      (this.starterNumberOfInputs = 0),
      (this.gates = []);
    this.operators = {
      and: function (x, y) {
        return x & y;
      },
      or: function (x, y) {
        return x | y;
      },
    };
    this.numberOfInputs = nInputs;
    this.starterNumberOfInputs = this.numberOfInputs;
    for (let i = 0; i < nInputs; i++) {
      this.input[String.fromCharCode(65 + i)] = i;
    }
    for (let number = 0; number < Math.pow(2, nInputs); number++) {
      this.table.push(("00000000" + number.toString(2)).slice(-nInputs));
    }
  }

  startTable(nInputs) {
    this.numberOfInputs = nInputs;
    this.starterNumberOfInputs = this.numberOfInputs;
    for (let i = 0; i < nInputs; i++) {
      this.input[String.fromCharCode(65 + i)] = i;
    }
    for (let number = 0; number < Math.pow(2, nInputs); number++) {
      this.table.push(("00000000" + number.toString(2)).slice(-nInputs));
    }
  }

  addGate(addGateInputs, op) {
    var gateInputs = addGateInputs;
    var notGateInputs = [];

    for (let index = 0; index < gateInputs.length; index++) {
      if (gateInputs[index][0] == "~") {
        gateInputs[index] = gateInputs[index][1];
        notGateInputs.push(1);
      } else {
        notGateInputs.push(0);
      }
    }

    this.gates.push({
      outputName: String.fromCharCode(65 + this.numberOfInputs),
      counterY: [0, 0],
      pY: [0, 0],
      iY: [0, 0],
      counterX: [],
      pX: [],
      iX: [],

      hY: 0,
      hX: 0,
    });

    let outNot = 0;
    if (op[0] == "n") {
      outNot = 1;
      op = op.substring(1);
    }
    for (let index = 0; index < this.table.length; index++) {
      let out = notGateInputs[0]
        ? this.table[index][this.input[gateInputs[0]]] == "1"
          ? "0"
          : "1"
        : this.table[index][this.input[gateInputs[0]]];
      let stateInput = out;
      for (let inputN = 1; inputN < gateInputs.length; inputN++) {
        stateInput += this.table[index][this.input[gateInputs[inputN]]];
        let inputNow = notGateInputs[inputN]
          ? this.table[index][this.input[gateInputs[inputN]]] == "1"
            ? "0"
            : "1"
          : this.table[index][this.input[gateInputs[inputN]]];
        out = this.operators[op](out, inputNow);
      }
      let gateResult = outNot ? Number(!out) : Number(out);
      //Conta se a saída foi 0 ou 1
      this.gates[this.gates.length - 1].counterY[gateResult] += 1;
      //Conta o estado da entrada
      if (
        typeof this.gates[this.gates.length - 1].counterX[
          parseInt(stateInput, 2)
        ] !== "undefined"
      ) {
        this.gates[this.gates.length - 1].counterX[
          parseInt(stateInput, 2)
        ] += 1;
      } else {
        this.gates[this.gates.length - 1].counterX[parseInt(stateInput, 2)] = 1;
      }
      //Escreve na saída
      this.table[index] += gateResult;
    }

    //Calcula tudo, agora que contamos cada caso na tabela
    //Primeiro para a saída
    this.gates[this.gates.length - 1].pY[0] =
      this.gates[this.gates.length - 1].counterY[0] /
      Math.pow(2, this.starterNumberOfInputs);

    this.gates[this.gates.length - 1].pY[1] =
      this.gates[this.gates.length - 1].counterY[1] /
      Math.pow(2, this.starterNumberOfInputs);

    this.gates[this.gates.length - 1].iY[0] =
      -this.gates[this.gates.length - 1].pY[0] *
      Math.log2(this.gates[this.gates.length - 1].pY[0]);
    this.gates[this.gates.length - 1].iY[1] =
      -this.gates[this.gates.length - 1].pY[1] *
      Math.log2(this.gates[this.gates.length - 1].pY[1]);

    this.gates[this.gates.length - 1].hY =
      this.gates[this.gates.length - 1].iY[0] +
      this.gates[this.gates.length - 1].iY[1];

    //Agora para as entradas
    for (
      let index = 0;
      index < this.gates[this.gates.length - 1].counterX.length;
      index++
    ) {
      this.gates[this.gates.length - 1].pX[index] =
        this.gates[this.gates.length - 1].counterX[index] /
        Math.pow(2, this.starterNumberOfInputs);

      this.gates[this.gates.length - 1].iX[index] =
        -this.gates[this.gates.length - 1].pX[index] *
        Math.log2(this.gates[this.gates.length - 1].pX[index]);

      this.gates[this.gates.length - 1].hX += Number(
        this.gates[this.gates.length - 1].iX[index]
      );
    }
    this.input[String.fromCharCode(65 + this.numberOfInputs)] =
      this.numberOfInputs;
    this.numberOfInputs += 1;
  }
  showTable() {
    console.log("");
    console.log("A B C D E F G H");
    for (let i = 0; i < this.table.length; i++) {
      let linha = "";
      for (let j = 0; j < this.table[i].length; j++) {
        const element = this.table[i][j];
        linha += element + " ";
      }
      console.log(linha);
    }
  }

  showResults() {
    let saldo = 0;
    for (let index = 0; index < this.gates.length; index++) {
      const gate = this.gates[index];
      saldo += gate.hY - gate.hX;
      console.log(
        "Para a gate ",
        index + 1,
        " Hx:",
        gate.hX,
        " Hy:",
        gate.hY,
        " H",
        gate.hY - gate.hX
      );
    }
    console.log("Saldo do circuito: ", saldo);
  }
};
