#!/bin/bash

mkdir -p dist/firefox
rm -r dist/firefox/*
cp -R platforms/firefox/* dist/firefox
cp -R src/* dist/firefox
