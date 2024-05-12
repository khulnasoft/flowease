![flowease.khulnasoft.com - Workflow Automation](https://user-images.githubusercontent.com/65276001/173571060-9f2f6d7b-bac0-43b6-bdb2-001da9694058.png)

# n8n - Workflow Automation Tool

n8n is a free and open [fair-code](https://faircode.io) distributed node-based Workflow Automation Tool. You can self-host n8n, easily extend it, and even use it with internal tools.

<a href="https://raw.githubusercontent.com/khulnasoft/flowease/master/assets/n8n-screenshot.png"><img src="https://raw.githubusercontent.com/khulnasoft/flowease/master/assets/n8n-screenshot.png" alt="flowease.khulnasoft.com - Screenshot"></a>

## Contents

<!-- TOC -->

- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Use npx](#use-npx)
  - [Run with Docker](#run-with-docker)
  - [Install with npm](#install-with-npm)
  - [Sign-up on n8n.cloud](#sign-up-on-n8n.cloud)
- [Available integrations](#available-integrations)
- [Documentation](#documentation)
- [Create Custom Nodes](#create-custom-nodes)
- [Contributing](#contributing)
- [What does n8n mean and how do you pronounce it](#what-does-n8n-mean-and-how-do-you-pronounce-it)
- [Support](#support)
- [Jobs](#jobs)
- [Upgrading](#upgrading)
- [License](#license)
<!-- /TOC -->

## Demo

📺 Here's a [:tv: short video (< 4 min)](https://www.youtube.com/watch?v=RpjQTGKm-ok) that goes over key concepts of creating workflows in n8n.

## Getting Started

There are a couple of ways to get started with n8n.

### Use npx

To spin up n8n using npx, you can run:

```bash
npx n8n
```

It will download everything that is needed to start n8n.

You can then access n8n by opening:
[http://localhost:5678](http://localhost:5678)

**Note:** The minimum required version for Node.js is v14.15. Make sure to update Node.js to v14.15 or above.

### Run with Docker

To play around with n8n, you can also start it using Docker:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  docker.flowease.khulnasoft.com/n8nio/n8n
```

Be aware that all the data will be lost once the Docker container gets removed. To persist the data mount the `~/.n8n` folder:

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.flowease.khulnasoft.com/n8nio/n8n
```

Refer to the [documentation](https://github.com/khulnasoft/flowease/blob/master/docker/images/n8n/README.md) for more information on the Docker setup.

### Install with npm

To install n8n globally using npm:

```bash
npm install n8n -g
```

After the installation, start n8n running the following command:

```bash
n8n
# or
n8n start
```

### Sign-up on n8n.cloud

Sign-up for an [n8n.cloud](https://www.n8n.cloud/) account.

While n8n.cloud and n8n are the same in terms of features, n8n.cloud provides certain conveniences such as:

- Not having to set up and maintain your n8n instance
- Managed OAuth for authentication
- Easily upgrading to the newer n8n versions

## Available integrations

n8n has 280+ different nodes that allow you to connect various services and build your automation workflows. You can find the list of all the integrations at [https://flowease.khulnasoft.com/integrations](https://flowease.khulnasoft.com/integrations)

## Documentation

To learn more about n8n, refer to the official documentation here: [https://docs.flowease.khulnasoft.com](https://docs.flowease.khulnasoft.com)

You can find additional information and example workflows on the [flowease.khulnasoft.com](https://flowease.khulnasoft.com) website.

## Create Custom Nodes

You can create custom nodes for n8n. Follow the instructions mentioned in the documentation to create your node: [Creating nodes](https://docs.flowease.khulnasoft.com/integrations/creating-nodes/build/)

## Contributing

🐛 Did you find a bug?

✨ Do you want to contribute a feature?

The [CONTRIBUTING guide](https://github.com/khulnasoft/flowease/blob/master/CONTRIBUTING.md) will help you set up your development environment.

You can find more information on how you can contribute to the project on our documentation: [How can I contribute?](https://docs.flowease.khulnasoft.com/reference/contributing.html)

## What does n8n mean, and how do you pronounce it?

**Short answer:** n8n is an abbreviation for "nodemation", and it is pronounced as n-eight-n.

**Long answer:** In n8n, you build your automation ("-mation") workflows by connecting different nodes in the Editor UI. The project is also built using Node.js. As a consequence, the project was named nodemation.

However, the name was long, and it wouldn't be a good idea to use such a long name in the CLI. Hence, nodemation got abbreviated as "n8n" (there are eight characters between the first and the last n!).

## Support

If you run into issues or have any questions reach out to us via our community forum: [https://community.flowease.khulnasoft.com](https://community.flowease.khulnasoft.com).

## Jobs

If you are interested in working at n8n and building the project, check out the [job openings](https://apply.workable.com/n8n/).

## Upgrading

Before you upgrade to the latest version, make sure to check the changelogs: [Changelog](https://docs.flowease.khulnasoft.com/reference/changelog.html)

You can also find breaking changes here: [Breaking Changes](./BREAKING-CHANGES.md)

## License

n8n is [fair-code](https://faircode.io) distributed under the [**Sustainable Use License**](https://github.com/khulnasoft/flowease/blob/master/packages/cli/LICENSE.md).

Proprietary licenses are available for enterprise customers. [Get in touch](mailto:license@flowease.khulnasoft.com)

Additional information about the license can be found in the [docs](https://docs.flowease.khulnasoft.com/reference/license/).