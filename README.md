# semantic-version
[![CI](https://github.com/pearnaly/semantic-version/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/pearnaly/semantic-version/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/%40pearnaly%2Fsemantic-version.svg)](https://badge.fury.io/js/%40pearnaly%2Fsemantic-version)

Javascript/Typescript class to represent, parse and compare semantic versions 2.0.0 according to [semver.org](https://semver.org)

## Installation
### NPM
```
npm install @pearnaly/semantic-version
```
### Bundles
https://unpkg.com/browse/@pearnaly/semantic-version/bundles/

## Use
### Object Oriented
```typescript
const fullVersion = new SemVersion('1.2.3-beta.1a+build2');
fullVersion.major // 1
fullVersion.minor // 2
fullVersion.patch // 3
fullVersion.preReleaseIdentifiers // ['beta', '1a']
fullVersion.buildMetadataIdentifiers // ['build2']

const myVersion = new SemVersion('1.2.3');

// comparaison: returns -1 / 0 / 1 according to order
myVersion.compare('1.3.0'); // returns -1

//comparaison:  operators eq, gt, ge, lt, le
myVersion.eq('1.2.3'); // returns true
myVersion.lt('1.3.0'); // returns true
```

### Functional
```typescript
// comparaison
SemVersion.compare('1.2.3', '1.3.0'); // returns -1

// comparaison: operators eq, gt, ge, lt, le
SemVersion.eq('1.2.3', '1.2.3'); // returns true
SemVersion.lt('1.2.3', '1.3.0'); // returns true
```
