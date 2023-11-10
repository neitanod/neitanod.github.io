try { let CommandLineConstructor = {}; } catch(e) {}
CommandLineConstructor = function() {

    window.SLGCommandLine = new CommandLine();
    let c = window.SLGCommandLine;
    c.init();
    c.defineCommand(":hi",()=>{ alert("Hey there!"); });
    c.defineAlias(":hey",":hi");
    c.defineCommand(":alert",(text, title)=>{
       console.log(title, text);
       alert(text);});
    }

try { let CommandLine = {}; } catch(e) {}

CommandLine = function() {

    this.init = function() {
        this.commandDiv = document.createElement('div');
        this.callbacks = [];
        this.aliases = [];
        this.setupDiv();
        this.setupKeyBindings();
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
        this.commandDiv.textContent = '';
        this.commandDiv.contentEditable = true;
        this.commandDiv.addEventListener('keydown', (ev)=>{ this.handleKeydown(ev) } );
        document.body.appendChild(this.commandDiv);
    }

    this.setupKeyBindings = function() {
        document.addEventListener('keydown', (event) => {
            if (event.key === ':') {
                if(
                    event.currentTarget.contentEditable ||
                    event.currentTarget.tagName == "TEXTAREA" ||
                    event.currentTarget.tagName == "INPUT"
                ) {
                    return;
                }
                this.clean();
                this.show();
                this.focus();
            }
        });
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
        // this.commandDiv.setSelectionRange(this.commandDiv.textContent.length,this.commandDiv.textContent.length);
    }

    this.defineCommand = function( command, callback ) {
        this.callbacks[command] = callback;
    }

    this.defineAlias = function( alias, command ) {
        this.aliases[alias] = command;
    }

    this.handleKeydown = function(event) {
        let self = this;
        // event.preventDefault();
        // event.stopPropagation();
        if (event.key === 'Escape') {
            self.hide();
        } else if (event.key === 'Enter') {
            self.addToHistory();
            self.processCommand();
            self.hide();
        } else if (event.key === 'ArrowUp') {
            self.historyBack();
        }
        console.log(event);
    }

    this.addToHistory = function() {
        this.lastCommand = this.commandDiv.textContent;
    }

    this.historyBack = function() {
        this.commandDiv.textContent = this.lastCommand;
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

CommandLineConstructor();
