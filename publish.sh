#!/usr/bin/env bash
npm config get registry
npm config set registry=http://registry.npmjs.org

echo 'Login http://registry.npmjs.org'
npm login

echo "Publish to http://registry.npmjs.org"
npm publish

exit