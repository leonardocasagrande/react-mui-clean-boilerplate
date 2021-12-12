#! /usr/bin/env node
const prompt = require("prompt");
const { execSync } = require("child_process");

const schema = {
  properties: {
    projectName: {
      required: true,
      description: "Enter the project name"
    },
    gitUrl: {
      description: "Enter the git url of the project (optional)"
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
    );

    execSync("rm -rf .git", { cwd: projectPath });
    const fs = require('fs');
    console.log("Updating package.json");
    if (!fs.existsSync(`${projectPath}/package.json`) ) {
       console.log('file doesnt exists')
    }
    else {
      const content = fs.readFileSync(`${projectPath}/package.json`, 'utf8')
      const pkg = JSON.parse(content);
      pkg.name = result.projectName;
      console.log("PKG", pkg)
      fs.writeFileSync(`${projectPath}/package.json`, JSON.stringify(pkg, null, "\t"));
    }
    
    if (git) {
      execSync("git init", { cwd: projectPath });
      execSync(`git remote add origin ${git}`, { cwd: projectPath });
      execSync("git add .", { cwd: projectPath });
      execSync('git commit -m "Initial commit" ', { cwd: projectPath });
      execSync("git push -u origin master", { cwd: projectPath });
    }
    console.log("\n\n\nProject created successfully!");
    console.log(`Run cd ${result.projectName} to start coding!`);
  } catch (err) {
    console.log(`\n  ERROR CLONING PROJECT \n`);
    console.log(err);
  }
});
