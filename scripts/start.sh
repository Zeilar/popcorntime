#!/bin/bash

clear

cd "$(realpath server)"

npm start & cd ../client; npm start
