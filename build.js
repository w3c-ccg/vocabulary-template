/*!
 * Copyright 2025 Digital Bazaar, Inc.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import yml2vocab from 'yml2vocab';

const yamlFilePath = './vocabulary.yml';

export async function loadModel({yamlFilePath}) {
  let yamlObj = {};

  try {
    const yamlText = await fs.readFileSync(yamlFilePath);
    yamlObj = yaml.load(yamlText);
    console.log('Loaded:', yamlFilePath);
  } catch (err) {
    console.error('Error loading YAML vocabulary.', err);
  }

  return yamlObj;
}

export async function populateHtmlTemplate({slug, yamlObj}) {
  try {
    let template = fs.readFileSync('template.html').toString('utf-8');

    let abstract = 'TODO: Generate abstract.';
    let introduction = 'TODO: Generate introduction.';

    yamlObj.ontology.forEach((element) => {
      if(element.property == 'dc:abstract') {
        abstract = element.value;
      } else if(element.property == 'dc:description') {
        introduction = element.value;
      }
    });

    // replace shortname
    template = template.replaceAll('{{SHORTNAME}}', slug);
    // replace abstract
    template = template.replaceAll('{{ABSTRACT}}', abstract);
    // replace introduction
    template = template.replaceAll('{{INTRODUCTION}}', introduction);
    // replace examples from `examples.html`
    const examples = fs.readFileSync('examples.html').toString('utf-8');
    template = template.replaceAll('{{EXAMPLES}}', examples);

    // generate the HTML
    return template;
  } catch(err) {
    console.error('Error generating HTML documentation.', err);
  }
}

export async function writeHtml({baseDir, html}) {
  // `vocabulary.html` is the default filename used by yml2vocab
  const indexHtmlPath = path.join(baseDir, 'vocabulary.html')
  fs.writeFileSync(indexHtmlPath, html);
  console.log('Generated human-readable documentation:', indexHtmlPath);
}

export async function writeContext({baseDir, yamlObj}) {
    const yamlUpdate = yaml.dump(yamlObj);
    const vocab = new yml2vocab.VocabGeneration(yamlUpdate);

    // `vocabulary.context.jsonld` is the default filename used by yml2vocab
    const jsonldContextPath = path.join(baseDir, 'vocabulary.context.jsonld');
    // generate the JSON-LD Context
    const generatedContext = JSON.parse(vocab.getContext());
    generatedContext['@context'].id = '@id';
    generatedContext['@context'].type = '@type';
    const jsonldContext = JSON.stringify(generatedContext);
    fs.writeFileSync(jsonldContextPath, jsonldContext);
    console.log('Generated JSON-LD Context:', jsonldContextPath);
}

const yamlObj = await loadModel({yamlFilePath});
const vocab = new yml2vocab.VocabGeneration(yaml.dump(yamlObj));

const baseDir = '.';
const pkg = createRequire(import.meta.url)('./package.json');
const slug = pkg.name;

const html = vocab.getHTML(await populateHtmlTemplate({slug, yamlObj}));
writeHtml({baseDir, html});
writeContext({baseDir, yamlObj});

// `vocabulary.jsonld` is the default filename used by yml2vocab
fs.writeFileSync(path.join(baseDir, 'vocabulary.jsonld'), vocab.getJSONLD());
// `vocabulary.ttl` is the default filename used by yml2vocab
fs.writeFileSync(path.join(baseDir, 'vocabulary.ttl'), vocab.getTurtle());
