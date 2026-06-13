import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';

function main() {
  const zip = new AdmZip();
  const rootDir = process.cwd();

  console.log("Starting ZIP generation...");

  // 1. Add directories recursively
  const dirsToAdd = ["src", "assets", "public"];
  for (const dirName of dirsToAdd) {
    const dirPath = path.join(rootDir, dirName);
    if (fs.existsSync(dirPath)) {
      console.log(`Adding folder: ${dirName}`);
      zip.addLocalFolder(dirPath, dirName);
    } else {
      console.warn(`Warning: Directory ${dirName} does not exist at path ${dirPath}`);
    }
  }

  // 2. Add top-level individual files
  const filesToAdd = [
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "vite.config.ts",
    "index.html",
    "metadata.json",
    ".env.example",
    ".gitignore",
    "server.ts"
  ];

  for (const fileName of filesToAdd) {
    const filePath = path.join(rootDir, fileName);
    if (fs.existsSync(filePath)) {
      console.log(`Adding file: ${fileName}`);
      zip.addLocalFile(filePath);
    } else {
      console.warn(`Warning: File ${fileName} does not exist at path ${filePath}`);
    }
  }

  // 3. Make sure the target locations exist
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const distDir = path.join(rootDir, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 4. Save Zip
  const publicZipPath = path.join(publicDir, 'veeresh-portfolio-project.zip');
  console.log(`Writing ZIP to ${publicZipPath}...`);
  zip.writeZip(publicZipPath);

  const distZipPath = path.join(distDir, 'veeresh-portfolio-project.zip');
  console.log(`Writing ZIP to ${distZipPath}...`);
  zip.writeZip(distZipPath);

  console.log("ZIP export successfully created in /public and /dist!");
}

main();
