class CommandLine {
    constructor() {
        this.commandDiv = document.createElement('div');
    }

    init() {
        this.callbacks = [];
        this.aliases = [];
        this.setupDiv();
        this.setupKeyBindings();
    }

    setupDiv() {
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

    setupKeyBindings() {
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

    clean() {
        this.commandDiv.textContent = '';
    }

    show() {
        this.commandDiv.style.display = 'block';
    }

    hide() {
        this.commandDiv.style.display = 'none';
    }

    focus() {
        this.commandDiv.focus();
        // this.commandDiv.setSelectionRange(this.commandDiv.textContent.length,this.commandDiv.textContent.length);
    }

    defineCommand( command, callback ) {
        this.callbacks[command] = callback;
    }

    defineAlias( alias, command ) {
        this.aliases[alias] = command;
    }

    handleKeydown(event) {
        let self = this;
        // event.preventDefault();
        // event.stopPropagation();
        if (event.key === 'Escape') {
            self.hide();
        } else if (event.key === 'Enter') {
            self.processCommand();
            self.hide();
        }
        // console.log(event);
    }

    processCommand() {
        let self = this;
        let command = self.commandDiv.textContent;
        if( self.aliases[command] ) {
            command = self.aliases[command];
        }
        if( self.callbacks[command] ) {
            setTimeout( self.callbacks[command] , 0);
        }
    }
}

let command = new CommandLine();
command.init();
command.defineCommand(":hi",()=>{ alert("Hey there!"); });
command.defineAlias(":hey",":hi");
