#!/usr/bin/env bash
DIR=${1:-../subschema}
OPWD=$PWD
HASH=
function check(){
	open index.html &
}


function push(){
	git add app.${HASH}.{js,js.map} && \
	git commit -a -m "Updated hash ${HASH}" && \
	git status && \	
	git push origin gh-pages && \
	echo "gh-pages now running $HASH " && \
	echo "http://jspears.github.io/subschema"
}
function build(){
	cd $DIR
	npm run build-demo
	cd $OPWD
	HASH=$(ls app.*.js | sed 's,app\.\(.*\)\.js,\1,g' )
}
function index(){
	cp $DIR/public/index.html .
	sed -i "s,\"app.js\",app.${HASH}.js," index.html
}
rm -f ./app.*.{js,js.map} 
build  && \
index && \
check
read -p "Do you want to push[y|Y]" dp;
case $dp in
	y|Y) push; break;;
	n|N) echo "Don't forget to publish"; exit 0;;
esac