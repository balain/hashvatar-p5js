/*
 * Partial port of Francois Best's Hashvatar
 * https://francoisbest.com/posts/2021/hashvatars
 * https://github.com/franky47/francoisbest.com/blob/next/src/pages/posts/2021/hashvatars.mdx
 *
 * License: https://github.com/franky47/francoisbest.com/blob/next/LICENSE.txt
 *
 * Done: Basic display with random values
 *
 * ToDo:
 *  - Parse input hash and generate real image
 *  - Souls
 *  - Staggering
 *  - Convert to class
 *
 * Notes:
 *  - Uses p5js canvas, not SVG
 *  - blendFactor is bogus/broken
 */
const w = 400;
const h = w;
const ringRadii = [];
const lineThickness = 2;
const sectionCount = 8;
const ringCount = 4;
let values = [];

function setup() {
  createCanvas(w, h);
  colorMode(HSL);
  hashvatar = new Hashvatar();
  
  input = createInput();
  input.position(w-10, h-25);

  button = createButton('submit');
  button.position(w-10, h-5);
  button.mousePressed(process);

  textAlign(CENTER);
  textSize(50);
}

function draw() {
  background(255, 0);
  noLoop();
  noFill();
}

function process() {
  hashvatar.reset();
  for (let i = 0; i < (sectionCount * ringCount); i++) {
    hashvatar.addValue(random(255));
  }
    hashvatar.display();
}

class Hashvatar {
  constructor() {
    for (let r = 1; r <= ringCount; r++) {
      let blendFactor = 0.2;
      let modx = ((1 - blendFactor) * (2 * (r - 1))) / (ringCount * 2);
      let factor = 1 - modx;
      ringRadii.push(w * factor);
      // console.log(`ringRadii: added ${w*factor}`)
    }
  }

  addValue(v) {
    values.push(v);
  }
  
  reset() {
    values = [];
  }

  convertPosToSectionAndRing(pos) {
    let section = (pos % sectionCount) + 1;
    let ring = Math.ceil((pos + 1) / sectionCount);
    // console.log(`${pos}: section: ${section}; ring: ${ring}`);
    return({ section: section, ring: ring });
  }

  buildValueList() {
    for (let sectionCtr = 0; sectionCtr < sectionCount; sectionCtr++) {
      for (let ring = 0; ring < ringCount; ring++) {
        let c = calcColor(random(255));
        values.push(c);
        // console.log(`pushing ${c} to values`);
      }
    }
  }

  display() {
    let section = 0;
    let ring = 0;
    for (let i = 0; i < values.length; i++) {
      // let v = values[i];
      // console.log(section, ring);
      this.drawSection(i);
      section++;
      if (section >= sectionCount) {
        section = 0;
        ring++;
        // console.log(`incrementing ring to ${ring}`)
      }
    }
  }

  calcColor(value) {
    const colorH = value >> 4;
    const colorS = (value >> 2) & 0x03;
    const colorL = value & 0x03;
    const normalizedH = colorH / 16;
    const normalizedS = colorS / 4;
    const normalizedL = colorL / 4;
    const h = Math.round(360 * normalizedH);
    const s = 50 + 50 * normalizedS; // Saturation between 50 and 100%
    const l = 40 + 30 * normalizedL; // Lightness between 40 and 70%
    let opacity = 75;
    // console.log(value, h,s,l,opacity);
    let colorStr = "hsla(" + h + ", " + s + "%, " + l + "%, " + opacity + ")";
    return color(colorStr);
  }

  drawSection(ndx) {
    let val = values[ndx];
    let info = this.convertPosToSectionAndRing(ndx);
    // console.log(`info: `, info);
    let num = info.section;
    let ring = info.ring-1;
    stroke(255);
    strokeWeight(lineThickness);

    fill(this.calcColor(val));
    let start = (sectionCount - 1 - num) * (PI / (sectionCount / 2));
    let stop = (sectionCount - num) * (PI / (sectionCount / 2));
    // console.log(`arc(${w} / 2, ${w} / 2, ringRadii[${ring}], ringRadii[${ring}], ${start}, ${stop}, PIE)`);
    arc(w / 2, w / 2, ringRadii[ring], ringRadii[ring], start, stop, PIE);
  }
}
