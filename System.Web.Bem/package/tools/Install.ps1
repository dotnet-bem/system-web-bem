param($installPath, $toolsPath, $package, $project)

$fileInfo = new-object -typename System.IO.FileInfo -ArgumentList $project.FullName

cd $fileInfo.DirectoryName
npm init -y
npm i enb enb-bem-techs enb-bemxjst enb-borschik enb-js enb-stylus -D