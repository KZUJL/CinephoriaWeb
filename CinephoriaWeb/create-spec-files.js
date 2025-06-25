import fs from 'fs/promises';
import path from 'path';

const componentsDir = path.resolve('./src/components');
const testsDir = path.resolve('./src/tests/unit/components');

const template = (componentPath, componentName) => `\
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ${componentName} from '${componentPath}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    const wrapper = mount(${componentName});
    expect(wrapper.exists()).toBe(true);
  });
});
`;

async function getAllVueFiles(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(await getAllVueFiles(filePath));
    } else if (file.name.endsWith('.vue')) {
      results.push(filePath);
    }
  }
  return results;
}

async function ensureDirExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function run() {
  const vueFiles = await getAllVueFiles(componentsDir);

  for (const vueFile of vueFiles) {
  const componentName = path.basename(vueFile, '.vue');
  const relativeDir = path.relative(componentsDir, path.dirname(vueFile));
  const targetDir = path.join(testsDir, relativeDir);
  await ensureDirExists(targetDir);

  const testFilePath = path.join(targetDir, `${componentName}.spec.ts`);

  try {
    await fs.access(testFilePath);
    console.log(`Test file already exists, skipping: ${testFilePath}`);
    continue;
  }  catch {
  // Ignorer l'erreur car on veut créer le fichier s'il n'existe pas
}

  // ici on calcule le chemin relatif du composant depuis le dossier du test
  const importPath = './' + path.relative(targetDir, vueFile).replace(/\\/g, '/');

  const content = template(importPath, componentName);

  await fs.writeFile(testFilePath, content);
  console.log(`Created test file: ${testFilePath}`);
}
}

run();
