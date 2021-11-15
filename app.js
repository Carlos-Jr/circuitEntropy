const CircuitTable = require("./CircuitTable");

let circuito1 = new CircuitTable(4);
circuito1.addGate(["A", "B"], "nand"); //E
circuito1.addGate(["C", "D"], "and"); //F
circuito1.addGate(["E", "F"], "or"); //G
circuito1.addGate(["E", "F"], "nand"); //H

console.log("\nResultados para circuito 1");
circuito1.showResults();

// #############################################
let circuito2 = new CircuitTable(4);
circuito2.addGate(["~A", "~B"], "or"); //E
circuito2.addGate(["~C", "~D"], "nor"); //F
circuito2.addGate(["E", "F"], "or"); //G
circuito2.addGate(["E", "F"], "nand"); //H

console.log("\nResultados para circuito 2");
circuito2.showResults();

// #############################################
let circuito3 = new CircuitTable(4);
circuito3.addGate(["A", "B"], "nand"); //E

circuito3.addGate(["~A", "C", "D"], "and"); //F
circuito3.addGate(["~B", "C", "D"], "and"); //G
circuito3.addGate(["F", "G"], "or"); //H

circuito3.addGate(["A", "B", "~C"], "and"); //I
circuito3.addGate(["A", "B", "~D"], "and"); //J
circuito3.addGate(["I", "J"], "or"); //K equivalente à G

console.log("\nResultados para circuito 3");
circuito3.showTable();
