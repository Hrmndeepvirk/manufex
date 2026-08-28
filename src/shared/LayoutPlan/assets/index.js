import as1 from "./bench-press.png";
import as2 from "./bench.png";
import as3 from "./chair.png";
import as4 from "./yoga-mat.png";
import as5 from "./leg-press.png";
import as6 from "./physiotherapy-table.png";
import as7 from "./punching-bag.png";
import as8 from "./reformer.png";
import as9 from "./rowing-machine.png";
import as10 from "./squat-racks.png";
import as11 from "./stair-climber.png";
import as12 from "./stationary-bicycle.png";
import as13 from "./treadmil.png";

const resources = {
  BenchPress: {
    src: as1,
    offsetX: 128,
    offsetY: 128,
    shortName: "BP",
    name: "BenchPress",
  },
  Bench: {
    src: as2,
    offsetX: 128,
    offsetY: 128,
    shortName: "B",
    name: "Bench",
  },
  Chair: {
    src: as3,
    offsetX: 128,
    offsetY: 128,
    shortName: "C",
    name: "Chair",
  },
  YogaMat: {
    src: as4,
    offsetX: 64,
    offsetY: 64,
    shortName: "Y",
    name: "YogaMat",
  },
  Legpress: {
    src: as5,
    offsetX: 138,
    offsetY: 128,
    shortName: "LP",
    name: "Legpress",
  },
  PhysiotherapyTable: {
    src: as6,
    offsetX: 128,
    offsetY: 128,
    shortName: "PT",
    name: "PhysiotherapyTable",
  },
  PunchingBag: {
    src: as7,
    offsetX: 100,
    offsetY: 100,
    shortName: "PB",
    name: "PunchingBag",
  },
  Reformer: {
    src: as8,
    offsetX: 128,
    offsetY: 128,
    shortName: "R",
    name: "Reformer",
  },
  RowingMachine: {
    src: as9,
    offsetX: 128,
    offsetY: 128,
    shortName: "RM",
    name: "RowingMachine",
  },
  SquatRack: {
    src: as10,
    offsetX: 128,
    offsetY: 128,
    shortName: "SR",
    name: "SquatRack",
  },
  StairClimber: {
    src: as11,
    offsetX: 128,
    offsetY: 128,
    shortName: "SC",
    name: "StairClimber",
  },
  StationaryBicycle: {
    src: as12,
    offsetX: 128,
    offsetY: 128,
    shortName: "SB",
    name: "StationaryBicycle",
  },
  Treadmil: {
    src: as13,
    offsetX: 128,
    offsetY: 128,
    shortName: "T",
    name: "Treadmil",
  },
};

const resourcesArray = Object.values(resources);
export { resources };
export default resourcesArray;
