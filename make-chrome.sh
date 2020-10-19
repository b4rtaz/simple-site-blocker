#!/bin/bash

mkdir -p dist/chrome
rm -r dist/chrome/*
cp -R platforms/chrome/* dist/chrome
cp -R src/* dist/chrome
