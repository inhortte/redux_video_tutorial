#!/bin/bash

/usr/local/bin/watchify public/js/vdnamenu.js -v -t reactify -g livereactload -o public/js/vdnabundle.js &
node_modules/.bin/livereactload monitor -n public/js/vdnabundle.js
wait
