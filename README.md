# Modular Dependency Manager (MDM)

Modular Dependency Manager (MDM) is a tool designed to manage the dependencies of your project in a modular fashion. It
allows you to install, update, remove, and maintain the libraries and modules your project relies on in a systematic and
scalable way.

## Features

- **Dependency Isolation:** Manage dependencies on a per-module basis to enhance modularity.
- **Flexible Configuration:** Define dependencies with version ranges, commit hashes, or branches.
- **Multiple Package Manager Support:** Compatible with npm, yarn, pnpm, bun(**coming soon**).
- **Support for Multiple Languages:** Manage dependencies for projects in multiple programming languages.

## Installation

```bash
npm i -g modular-dependency-manager
```

## Usage

You can use the CLI to manage your module dependencies.

- Initialize(creates main dependency file from package.json):
  ```bash
  mdm init
  ```
- Installing all Dependencies:
  ```bash
  mdm i [-m <module-name>]
  ```
- Removing all Dependencies:
  ```bash
  mdm r [-m <module-name>] [-k] [-g]
  ```
  
  > **⚠️ Warning**
  > 
  > `mdm r` doesn't remove global dependencies by default!
  > Use **-g flag** to do so

- Adding a Dependency:
  ```bash
  mdm i <package-name>@<version> [-m <module-name>] [-d]
  ```
- Removing a Dependency:
  ```bash
  mdm r <package-name> [-m <module-name>] [-k]
  ```
- Run package manager commands:
  ```bash
  mdm run <package-manager-commands>
  ```
  
## configuration

MDM by default uses below config:
```json
{
  "pathToModules": "./src/@modules",
  "dependencyFileName": "dependencies.json",
  "dependencyLockFileName": "dependency-lock.json"
}
```
you can change this config by creating .mdmrc in the root of your project

## Authors

- Amirreza khordestan

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.