# Blockstack Android SDK (Pre-release)

[![](https://jitpack.io/v/blockstack/blockstack-android.svg)](https://jitpack.io/#blockstack/blockstack-android)

Blockstack is a platform for developing a new, decentralized internet, where
users control and manage their own information. Interested developers can create
applications for this new internet using the Blockstack platform.

This repository contains a pre-release for Android developers:

- the Blockstack Android SDK ([`/blockstack-sdk`](blockstack-sdk/))
- tools that assist development ([`/tools`](tools/))
- a tutorial that teaches you [how to use the SDK](docs/tutorial.md)


All of the material in this is a pre-release, if you encounter an issue please
feel free to log it [on this
repository](https://github.com/blockstack/blockstack-android/issues).

## Get started

Use the [detailed tutorial](docs/tutorial.md) and to build your first Blockstack
Android application with React. You can also work through two example apps in
module ([`/example`](examples/)) and
([`/example-multi-activity`](example-multi-activity/))

## Adding to your project
```
    repositories {
          maven { url 'https://jitpack.io' }
    }

    dependencies {
        implementation 'com.github.blockstack:blockstack-android:0.3.0'
    }
```

## API Reference Documentation
Please see [generated documenatation](https://31-124568327-gh.circle-artifacts.com/0/javadoc/blockstack-sdk/index.html)
on the project's circle CI.

## Contributing
Please see the [contribution guidelines](CONTRIBUTING.md).

## License
Please see [license file](LICENSE)
