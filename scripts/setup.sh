#!/bin/bash

cd server; npm install & cd ../client; npm install

npm run gen:chakra-typings
