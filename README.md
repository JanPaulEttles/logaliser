


git clone https://github.com/janpaulettles/logaliser.git

cd logaliser

npm init --yes


npm install fast-csv

npm install yargs

npm install async


git add .

git commit -m "initial"

git commit -a

git push origin master



node runner.js -i test.log -c test.headers



Convert the spaces in the weblog files to tabs


sed -E 's/(\S+) (\S+) (\S+) (\[.*\]) ("[^"]*") (\S+) (\S+) ("[^"]*") ("[^"]*") (\S+) (\S+)/1\t2\t3\t4\t5\t6\t7\t8\t9\t10\t11/gm



/(\S+) (\S+) (\S+) (\[.*\]) ("[^"]*") (\S+) (\S+) (\S+) ("[^"]*") (\S+) (\S+)/$1\t$2\t$3\t$4\t$5\t$6\t$7\t$8\t$9\t$10\t$11/gm





Ctrl+Shift+P or Cmd+Shift+P in Linux/Windows/OS X

type install, select Package Control: Install Package

type prettify, select HTML-CSS-JS Prettify



To beautify your code when saving the document, set the format_on_save setting to true in HTMLPrettify.sublime-settings:

Ctrl+Shift+P or Cmd+Shift+P in Linux/Windows/OS X
type htmlprettify, select Set Plugin Options

gedit ./.config/sublime-text-3/Packages/HTML-CSS-JS\ Prettify/.jsbeautifyrc.defaults.json 


        // Indentation character
        "indent_char": "\t",

        // Indentation size
        "indent_size": 1,

