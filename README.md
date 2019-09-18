


git clone https://github.com/janpaulettles/logaliser.git

cd logaliser

npm init --yes

npm install fast-csv
npm install yargs
npm install async


git add .
git commit -m "initial"
git push origin master

node runner.js -i test.log -c test.headers

