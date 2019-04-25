# SFDX App

## Dev, Build and Test

sfdx force:auth:web:login --setdefaultdevhubusername

sfdx force:org:create -f config/project-scratch-def.json -d 30 -a so

sfdx force:source:push -u so

sfdx force:org:open -u so

sfdx force:source:pull -u so

## Resources

## Description of Files and Directories

## Issues
