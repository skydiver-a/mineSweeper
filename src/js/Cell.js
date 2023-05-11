export class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.state = 'closed';
    this.mined = false;
    this.counter = 0;
    this.markSequence = ['closed', 'flagged', 'questioned'];
  }

  open() {
    this.state = (this.state !== 'flagged') ? 'opened' : 'flagged';
  }

  nextMark() {
    if (this.markSequence.includes(this.state)) {
      let stateIndex = this.markSequence.indexOf(this.state);
      this.state = this.markSequence[(stateIndex + 1) % this.markSequence.length];
    }
  }
}