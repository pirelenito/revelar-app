#!/bin/bash

wget http://dl.node-webkit.org/v0.9.2/node-webkit-v0.9.2-osx-ia32.zip
unzip node-webkit-v0.9.2-osx-ia32.zip
rm node-webkit-v0.9.2-osx-ia32.zip
rm credits.html
rm nwsnapshot
./update.sh
