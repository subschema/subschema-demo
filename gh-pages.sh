#!/usr/bin/env bash
#This script publishes the current p
DIR=${PWD##*/}
GH_DIR="../subschema-gh-pages"
GH_REPO="git@github.com:subschema/subschema.github.io.git"
GH_BRANCH="master"

OPWD=$PWD
HASH=

function check(){
    echo "Check"
    open $GH_DIR/index.html &
}


function push(){
    echo "Pushing"
    cd $GH_DIR && \
	git add -A && \
	git commit -a -m "Updated hash ${HASH}" && \
	git push origin $GH_BRANCH && \
	echo "$GH_BRANCH now running $HASH "
}

function build(){
   echo "Building"
   cd $OPWD && \
   rm -rf .build && \
   npm run demo && \
   HASH=$(ls ./.build/app.*.js | sed 's,.*app\.\(.*\)\.js,\1,g' )
   echo "Using Hash: ${HASH}"
   rm $GH_DIR/*
   cp ./.build/* $GH_DIR && \
   sed "s/\"app\(\.entry\)\{0,1\}\.js\"/\"app.${HASH}.js\"/" ./public/index.html > $GH_DIR/index.html
}

function init_git() {
   echo "Initing git"
   git clone ${GH_REPO} $GH_DIR
}

function ask() {
    read -p "$1 [Y]" dp;
    RET=1;
    case $dp in
	    y|Y)  RET=0;;
    esac
    return $RET;
}

[ ! -d $GH_DIR ] && init_git

build && check && ask "Do you want to push" && push || echo "Don't forget to publish";
exit 0;
