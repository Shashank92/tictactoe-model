#new-browserify-project
Minimalistic starter project for node.js with Browserify, Babelify, UglifyJS, and Watchify.
##Usage
First clone the project.
>git clone git@github.com:Shashank92/new-browserify-project.git  

Rename the directory and enter it. 
>mv new-browserify-project/ your-app-name && cd your-app-name

Install the dependencies and save them as dev dependencies inside package.json.
>npm install -D babel-preset-es2015 babelify

You may need to install browserify, watchify, and uglify-js if you don't already have their CLIs.
>npm install -g browserify watchify uglify-js

Edit package.json to customize your application.

This pattern uses the `npm run` scripts in `package.json`.
>npm run watch # reactive build for development and debugging  
>npm run build # minified build for production

##Additional Information
This is based on a blog post that I found very helpful.
>http://spapas.github.io/2015/05/27/using-browserify-watchify/
