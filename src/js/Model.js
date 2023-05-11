import { en } from "./en";
import { ru } from "./ru";

export class Keyboard {
  constructor() {
    this.container = '';
    this.textArea = '';
    this.keyBoard = '';
    this.groups = [...Array(5)].map(() => '');
    this.keys = [];
    this.switchLang = true;
    this.lang = this.switchLang ? en : ru;
    this.flattenDict = this.lang.flat(); 
    this.sets = {
      cursorPosX: 0,
      cursorPosY: 0,
      areaLength: [ 0 ]
    };
    this.properties = {
      capsLock: false,
      shiftKey: false,
      controlKey: false,
      altKey: false,
      winKey: false,
    };
    this.eventHandlers = {
      oninput: null,
      onclose: null
    };
  }

  init() {
    this.container = this.createDOMNode(this.container, 'div', 'container');
    this.textArea = this.createDOMNode(this.textArea, 'textarea', 'textarea');
    this.keyBoard = this.createDOMNode(this.keyBoard, 'div', 'keyboard');

    document.body.append(this.container);
    this.container.append(this.textArea);
    this.container.append(this.keyBoard);
 
    this.createGroups();
    this.createKeys();
    this.fillKeysWithSymbols();

    // check for symbols
    this.textArea.addEventListener('focus', (letter) => {
      this.open(letter.value, currentValue => {
        letter.value = currentValue;
      });
    });

    // check for cursor position
    this.textArea.addEventListener('click', (e) => {
      this.sets.cursorPosX = e.target.selectionStart;
    });

    // listen for keys pressed
    this.keys.forEach((key, index) => {
      key.addEventListener('click', () => {
        this.getRuleforKey(index)
      });
    });
  }

  createDOMNode(node, element, ...classes) {
    node = document.createElement(element);
    node.classList.add(...classes);
    return node;
  }
 
  createGroups() {
    for ( let i = 0; i < this.groups.length; i++) {
      this.keyBoard.append(this.groups[i] = this.createDOMNode(this.groups[i], 'div', 'keyboard__group'));
    }
  }

  createKeys() {
    for (let i = 0; i < this.groups.length; i++) {
      for ( let j = 0; j < this.lang[i].length; j++) {
        const key = this.createDOMNode('', 'button', 'keyboard__key');
        key.innerHTML = this.createSpan(this.lang[i][j]);

        this.keys.push(key);
        this.groups[i].append(key);
      }
    }
    
  }

  createSpan(symbol) {
    if (symbol[0] === symbol[1]) {
      return `<span class='symbol'></span>`;
    } else return `
      <span class='symbol top_left'></span>
      <br />
      <span class='symbol bottom_right'></span>
      `;
  }
  /*
  createKeys() {  // creates 64 keys here
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.groups.length; i++) {
      this.keyBoard.append(this.groups[i] = this.createDOMNode(this.groups[i], 'div', 'keyboard__group'));

      this.lang[i].forEach(el => {
        const key = this.createDOMNode('', 'button', 'keyboard__key');
        key.innerHTML = this.createSymbol(el);
        console.log(this.keys)
        this.getKeys(key, el[0], el[1]); //
        this.keys.push(key);
        this.groups[i].append(key)
      });
      fragment.appendChild(this.groups[i]);
    }

    return fragment;
  }*/ 

  fillKeysWithSymbols() {
    for (let i = 0; i < this.keys.length; i++) {
      if (this.flattenDict[i][0] === this.flattenDict[i][1]) {     
        this.keys[i].childNodes[0].textContent = this.flattenDict[i][0];
      } else {
        this.keys[i].childNodes[1].textContent = this.flattenDict[i][1];
        this.keys[i].childNodes[5].textContent = this.flattenDict[i][0];
      }
      this.getSpecialKeys(this.keys[i], this.flattenDict[i][0]);
    }
  }

  getSpecialKeys(key, symbol) {
    switch (symbol) {
      case 'backspace':
        key.classList.add('backspace');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fas fa-long-arrow-left"></i>
          </span>
        `;
        break;
      case 'tab':
        key.classList.add('tab');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fa-solid fa-arrow-right-arrow-left"></i>
          </span>
        `;
        break;
      case 'del':
        key.classList.add('del');
        break;
      case 'capslock':
        key.classList.add('capslock');
        break;
      case 'enter':
        key.classList.add('enter');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fas fa-level-down fa-rotate-90"></i>
          </span>
        `;
        break;
      case 'shift_left':
        key.classList.add('shift', 'shift_left');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fa-solid fa-arrow-up"></i>
          </span>
        `;
        break;
      case 'shift_right':
        key.classList.add('shift', 'shift_right');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fa-solid fa-arrow-up"></i>
          </span>
        `;
        break;
      case 'ctrl':
        key.classList.add("ctrl");
        break;
      case 'alt':
        key.classList.add("alt");
        break;
      case 'win':
        key.classList.add("win");
        key.innerHTML = `
          <span class='symbol'>
            <i class="fa-brands fa-windows"></i>
          </span>
        `;
        break;
      case 'space':
        key.classList.add('space');
        key.innerHTML = `<span class='symbol'>&nbsp;</span>`;
        break;
      case 'up':
        key.classList.add('up');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fa-solid fa-angle-up"></i>
          </span>
        `;
        break;
      case 'down':
        key.classList.add('down');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fa-solid fa-angle-down"></i>
          </span>
        `;
        break;
      case 'left':
        key.classList.add('left');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fa-solid fa-angle-left"></i>
          </span>
        `;
        break;
      case 'right':
        key.classList.add('right');
        key.innerHTML = `
          <span class='symbol'>
            <i class="fa-solid fa-angle-right"></i>
          </span>
        `;
        break;
      default:
        break;
    }
  }

  getRuleforKey(index) {
    /*
    TODO
    1. rules for kes
    2. change languages
    */
    let symbol = this.flattenDict[index][0];
    switch (symbol) {
      case 'backspace':        
        if (this.sets.cursorPosX === 0) {  // beginning position
          this.textArea.value = (this.sets.areaLength[this.sets.cursorPosY] === 0) ? '' : this.textArea.value;
        } else if (this.sets.cursorPosX === this.sets.areaLength) {  // ending position
          this.textArea.value = this.textArea.value.slice(0, -1);
        } else {  // intermediate position
          this.textArea.value = this.textArea.value.slice(0, this.sets.cursorPosX - 1) + this.textArea.value.slice(this.sets.cursorPosX);
        }
        this.sets.cursorPosX = (this.sets.cursorPosX > 0) ? this.sets.cursorPosX - 1 : 0;
        this.sets.areaLength[this.sets.cursorPosY] = (this.sets.areaLength[this.sets.cursorPosY] > 0) ? this.sets.areaLength[this.sets.cursorPosY] - 1 : 0;
        console.log(this.sets.cursorPosX, this.sets.cursorPosY, this.sets.areaLength[this.sets.cursorPosY])
        this.triggerEvent("oninput");
        
        break;
      case 'tab':
        if (this.sets.cursorPosX === 0) {  // beginning position
          this.textArea.value = (this.sets.areaLength[this.sets.cursorPosY] === 0) ?
            '    ' :
            '    ' + this.textArea.value.slice(0, this.sets.areaLength);
        } else if (this.sets.cursorPosX === this.sets.areaLength[this.sets.cursorPosY]) {  // ending position
          this.textArea.value += '    ';
        } else {  // intermediate position
          this.textArea.value = this.textArea.value.slice(0, this.sets.cursorPosX) + '    ' + this.textArea.value.slice(this.sets.cursorPosX);
        }
        this.sets.cursorPosX += 4;
        this.sets.areaLength[this.sets.cursorPosY] += 4;
        this.triggerEvent("oninput");
        
        break;
      case 'del':
        if (this.sets.cursorPosX === 0) {  // beginning position
          this.textArea.value = (this.sets.areaLength[this.sets.cursorPosY] === 0) ?
            '' :
            this.textArea.value.slice(1);
        } else if (this.sets.cursorPosX === this.sets.areaLength[this.sets.cursorPosY]) {  // ending position
          return;
        } else {  // intermediate position
          this.textArea.value = this.textArea.value.slice(0, this.sets.cursorPosX) + this.textArea.value.slice(this.sets.cursorPosX + 1);
        }
        this.sets.cursorPosX = (this.sets.cursorPosX > 0) ? this.sets.cursorPosX : 0;
        this.sets.areaLength[this.sets.cursorPosY] = (this.sets.areaLength[this.sets.cursorPosY] > 0) ? this.sets.areaLength[this.sets.cursorPosY] - 1 : 0;
        this.triggerEvent("oninput");
        
        break;
      case 'capslock':
        this.keys[index].classList.toggle('pressed');
        this.toggleCapsLock();
        break;
      case 'enter':
        this.textArea.value += "\n";
        this.sets.cursorPosX = 0;
        this.sets.cursorPosY++;
        this.sets.areaLength.push(0);
        this.triggerEvent("oninput");
        
        break;
      case 'shift_left':

          this.toggleShiftKey();

        break;
      case 'shift_right':

          this.toggleShiftKey();

        break;
      case 'ctrl':

          if (this.properties.shiftKey) {
            this.toggleControlKey();
            this.switchLanguage();
          }

          this.toggleControlKey();          

        break;
      case 'alt':

          this.toggleAltKey();
 
        break;
      case 'win':


          this.toggleWinKey();
 
        break;
      case 'space':
          if (this.sets.cursorPosX === 0) {  // beginning position
            this.textArea.value = (this.sets.areaLength === 0) ?
              ' ' :
              ' ' + this.textArea.value.slice(0, this.sets.areaLength);
          } else if (this.sets.cursorPosX === this.sets.areaLength) {  // ending position
            this.textArea.value += ' ';
          } else {  // intermediate position
            this.textArea.value = this.textArea.value.slice(0, this.sets.cursorPosX) + ' ' + this.textArea.value.slice(this.sets.cursorPosX);
          }

          this.sets.cursorPosX++;
          this.sets.areaLength[this.cursorPosY]++;

          this.triggerEvent("oninput");
        
        break;
      case 'up':

        break;
      case 'down':

        break;
      case 'left':

        break;
      case 'right':

        break;
      default:
        // capslock pressed
        symbol = this.properties.capsLock ? this.flattenDict[index][1] : this.flattenDict[index][0];
        // shift pressed
        if (this.properties.shiftKey) {
          symbol = this.flattenDict[index][1];
          
          this.toggleShiftKey();
        }
        // count position sets
        if (this.sets.areaLength[this.sets.cursorPosY] < 78) {
          if (this.sets.cursorPosX === 0) {  // beginning position
            this.textArea.value = (this.sets.areaLength[this.sets.cursorPosY] === 0) ?
              this.textArea.value + symbol :
              symbol + this.textArea.value.slice(0, this.sets.areaLength[this.sets.cursorPosY]);
          } else if (this.sets.cursorPosX === this.sets.areaLength[this.sets.cursorPosY]) {  // ending position
            this.textArea.value += symbol;
          } else {  // intermediate position
            this.textArea.value = this.textArea.value.slice(0, this.sets.cursorPosX) + symbol + this.textArea.value.slice(this.sets.cursorPosX);
          }
          this.sets.cursorPosX++;
          this.sets.areaLength[this.sets.cursorPosY]++;
          
          console.log(this.sets.cursorPosX, this.sets.cursorPosY, this.sets.areaLength[this.sets.cursorPosY])
        } else {
          this.textArea.value += '\n';
          
          this.sets.cursorPosX = 0;
          this.sets.cursorPosY++;
          this.sets.areaLength.push(0);
        }
        
        this.triggerEvent("oninput");
        break;
    }
  }

  open(initialValue, oninput, onclose) {
    this.textArea.value = initialValue || this.textArea.value;
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  }

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  }

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
  }

  toggleShiftKey() {
    this.properties.shiftKey = !this.properties.shiftKey;

    document.querySelectorAll('.shift').forEach(el => {
      el.classList.toggle('pressed');
    });
  }

  toggleControlKey() {
    this.properties.controlKey = !this.properties.controlKey;

    document.querySelectorAll('.ctrl').forEach(el => {
      el.classList.toggle('pressed');
    });
  }

  toggleAltKey() {
    this.properties.altKey = !this.properties.altKey;

    document.querySelectorAll('.alt').forEach(el => {
      el.classList.toggle('pressed');
    });
  }

  toggleWinKey() {
    this.properties.winKey = !this.properties.winKey;

    document.querySelector('.win').classList.toggle('pressed');
  }

  switchLanguage() {
    this.switchLang = !this.switchLang;

    this.toggleShiftKey();
  }
}