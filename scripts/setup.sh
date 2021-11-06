#!/bin/bash

cd "$(realpath ../server)"; npm install & cd ../client; npm install

npm run gen:chakra-typings
