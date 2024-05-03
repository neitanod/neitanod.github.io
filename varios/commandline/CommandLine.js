try { let CommandLineConstructor = {}; } catch(e) {}
CommandLineConstructor = function() {

    if(window.SLGCommandLine) {
      window.SLGCommandLine.removeKeyBindings();
    }
    window.SLGCommandLine = new CommandLine();
    let c = window.SLGCommandLine;
    c.init();



    c.defineCommand(":st",()=>{ addStreaming() });
    c.defineCommand(":nost",()=>{ removeStreaming() });
    c.defineCommand(":r",()=>{ openRoom() });





    c.defineCommand(":help",()=>{ SLGCommandLine.listCommands(); });
    c.defineCommand(":history",()=>{ console.log(SLGCommandLine.history); });
    c.defineCommand(":hi",()=>{ alert("Hey!"); });
    c.defineAlias(":hey",":hi");
    c.defineCommand(":alert",(text, title)=>{
       console.log(title, text);
       alert(text);
    });
}































function firstIndex(object) {
      const keys = Object.keys(object);
      return keys.length > 0 ? keys[0] : null;
}
function addStreaming() {
  // openRoom();
  lc.getLotteryClient().emitEvent("streaming", 1)
}
function removeStreaming() {
  // openRoom();
  lc.getLotteryClient().emitEvent("streaming", 0)
}
function openRoom(room_id) {
  lc.getLotteryClient().handleOpenRoom(room_id || 106);
}













try { let CommandLine = {}; } catch(e) {}

CommandLine = function() {
    let self = this;

    this.init = function() {
        this.commandDiv = document.createElement('div');
        this.callbacks = [];
        this.aliases = [];
        this.setupDiv();
        this.setupKeyBindings();
        this.history = [];
        this.historyIndex = 0;
        let history = JSON.parse(localStorage.getItem("SLGVim_history"));
        if( history ) this.history = history;
    }

    this.setupDiv = function() {
        this.commandDiv.style.position = 'fixed';
        this.commandDiv.style.bottom = '0';
        this.commandDiv.style.left = '0';
        this.commandDiv.style.width = '100%';
        this.commandDiv.style.height = '35px';
        this.commandDiv.style.backgroundColor = 'black';
        this.commandDiv.style.color = 'white';
        this.commandDiv.style.zIndex = '1000000';
        this.commandDiv.style.display = 'none';
        this.commandDiv.style.padding = '5px';
        this.commandDiv.style.opacity = '0.7';
        this.commandDiv.style.fontSize = '20px';
        this.commandDiv.style.fontFamily = 'monospace';
        this.commandDiv.textContent = '';
        this.commandDiv.contentEditable = true;
        this.commandDiv.addEventListener('keydown', (ev)=>{ this.handleKeydown(ev) } );
        document.body.appendChild(this.commandDiv);
    }

    this.setupKeyBindings = function() {
        document.addEventListener('keydown', this.keyHandler);
    }

    this.removeKeyBindings = function() {
        document.removeEventListener('keydown', this.keyHandler);
    }

    this.keyHandler = function(event) {
        if (event.key === ':') {
            // console.log(event);
            if(
                event.currentTarget.isContentEditable ||
                event.currentTarget.tagName == "TEXTAREA" ||
                event.currentTarget.tagName == "INPUT" ||
                event.target.idContentEditable ||
                event.target.tagName == "TEXTAREA" ||
                event.target.tagName == "INPUT"
            ) {
                return;
            }
            self.clean();
            self.show();
            self.focus();
        }
    }

    this.clean = function() {
        this.commandDiv.textContent = '';
    }

    this.show = function() {
        this.commandDiv.style.display = 'block';
    }

    this.hide = function() {
        this.commandDiv.style.display = 'none';
    }

    this.focus = function() {
        this.commandDiv.focus();
        // this.moveCursorToEnd(this.commandDiv);
    }

    this.defineCommand = function( command, callback ) {
        this.callbacks[command] = callback;
    }

    this.defineAlias = function( alias, command ) {
        this.aliases[alias] = command;
    }

    this.listCommands = function( ) {
        console.log(Object.keys(this.callbacks));
        console.log(Object.keys(this.aliases));
    }

    this.handleKeydown = function(event) {
        let self = this;
        // event.preventDefault();
        // event.stopPropagation();
        if (event.key === 'Escape') {
            self.hide();
        } else if (event.key === 'Enter') {
            self.addToHistory();
            self.hide();
            setTimeout(()=>{self.processCommand();}, 0);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            self.historyBack();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            self.historyForward();
        }
        //console.log(event);
    }

    this.addToHistory = function() {
        this.lastCommand = this.commandDiv.textContent;
        let history = JSON.parse(localStorage.getItem("SLGVim_history"));
        if( history ) this.history = history;

        let index = this.history.indexOf(this.lastCommand);
        if (index !== -1) {
            // Remove the existing entry
            this.history.splice(index, 1);
        }
        this.history.push(this.lastCommand);
        localStorage.setItem("SLGVim_history", JSON.stringify(this.history));
        this.historyIndex = 0;
    }

    this.historyBack = function() {
        this.historyIndex++;
        if(this.historyIndex > this.history.length){
          this.historyIndex = this.history.length;
        }
        this.commandDiv.textContent = this.history[this.history.length-this.historyIndex];
        this.moveCursorToEnd(this.commandDiv);
    }

    this.historyForward = function() {
        this.historyIndex--;
        if(this.historyIndex < 0){
          this.historyIndex = 0;
        }
        this.commandDiv.textContent = this.history[this.history.length-this.historyIndex];
        this.moveCursorToEnd(this.commandDiv);
    }

    this.moveCursorToEnd = function(element) {
        if (element.tagName === 'TEXTAREA') {
            element.focus();
            const length = element.value.length;
            elemento.setSelectionRange(length, length);
        } else if (element.isContentEditable) {
            let range = document.createRange();
            let selection = window.getSelection();
            range.selectNodeContents(element);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    this.processCommand = function() {
        let self = this;
        let args = this.parseArguments(self.commandDiv.textContent);
        let command = args.shift();
        if( self.aliases[command] ) {
            command = self.aliases[command];
        }
        if( self.callbacks[command] ) {
            setTimeout( self.callbacks[command](...args) , 0);
        }
    }

    this.parseArguments = function(line) {
        const arguments = [];
        let current = '';
        let quoted = false;
        let qouteType = null;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '\\') {
                current += line[++i];
            } else if ((char === '"' || char === "'") && !quoted) {
                quoted = true;
                qouteType = char;
            } else if (char === qouteType && quoted) {
                quoted = false;
                qouteType = null;
            } else if (char === ' ' && !quoted) {
                if (current.length > 0) {
                    arguments.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }

        if (current.length > 0) {
            arguments.push(current);
        }

        return arguments;
    }

}

document.addEventListener('DOMContentLoaded', () => CommandLineConstructor());
