<!--
Copyright 2025 Digital Bazaar, Inc.

SPDX-License-Identifier: BSD-3-Clause
-->
# Vocabulary Template

This is a vocabulary template that can be used to generate human-readable
RDF vocabularies as well as their corresponding machine-readable
vocabulary files.

# Setup

To use this template, copy it and perform the following step:

```
npm i
```

# Building the Documentation

To build the documentation, run the following command:

```
npm run build
```

# Viewing the Documentation

To view the documentation, serve this directory using the following command:

```
npm run serve
```

Use your web browser to go to the URL provided from the command above.

# Releasing the Vocabulary and Context

By default, the context will be published alongside the documentation into the
`dist/` folder as `context.jsonld`. However, because that file will change over
time, cutting a release (i.e. naming the context and then never changing it) is
best practice.

To do that, use the release command (see below--where `v1rc1` is the release):

```sh
npm run release -- v1rc1
```

This will rebuild the documentation and context and copy `dist/context.jsonld`
to `dist/v1rc1.jsonld` (in the above example) and force add it to the `dist/`
folder--as no other files should be committed here by developers.

Once those changes are committed and pushed, the commit should be tagged (i.e.
`git tag v1rc1`) and pushed (`git push origin --tags`).

A permanent alias URL can be created at https://w3id.org/

## License

[BSD-3-Clause](LICENSE) Copyright 2023 W3C, Inc., W3C Credentials Community Group
