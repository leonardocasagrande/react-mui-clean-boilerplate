#! /usr/bin/env node
const prompt = require("prompt");
const { execSync } = require("child_process");

const schema = {
  properties: {
    projectName: {
      required: true,
    },
    gitUrl: {
      required: true,
    },
  },
};

function onErr(err) {
  console.log(err);
  return 1;
}


prompt.start();

prompt.get(schema, (err, result) => {
  if (err) {
    return onErr(err);
  }

  const projectPath = `${__dirname}/${result.projectName}`;
  const git = result.gitUrl;


  try {

    execSync(
      `git clone git@github.com:leonardocasagrande/react-material-boilerplate.git ${result.projectName}`,
      { cwd: __dirname }
    )

    execSync('rm -rf .git', { cwd: projectPath })
    execSync('git init', { cwd: projectPath })
    execSync(`git remote add origin ${git}`, { cwd: projectPath })
    execSync('git add .', { cwd: projectPath })
    execSync('git commit -m "Initial commit" ', { cwd: projectPath })
    execSync('git push -u origin master', { cwd: projectPath })
    execSync('npm install', { cwd: projectPath })
    execSync('npm start', { cwd: projectPath })
    
  } catch (err) {
    console.log(`\n  ERROR CLONING PROJECT \n`);
    console.log(err);
  }

});