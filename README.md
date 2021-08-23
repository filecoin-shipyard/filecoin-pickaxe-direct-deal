filecoin-pickaxe-direct-deal
============================

## Status

This repository is in a **frozen** state. It is not being maintained or kept in sync with the tools and libraries it depends on. Even though work on this repository has been **shelved**, anyone interested in updating or maintaining this library should express their interest on one Filecoin community conversation mediums: <https://github.com/filecoin-project/community#join-the-community>.

---

**Work-in-progress**

This is a command-line tool for interactively storing "bundles" of
files from [filecoin-pickaxe](https://github.com/filecoin-shipyard/filecoin-pickaxe)
into the Filecoin network.

![Screenshot](screenshot.png)

This front-end program just provides a user interface. It updates a database,
which can be replicated to Filecoin nodes which you control - the
[filecoin-pickaxe-agent](https://github.com/filecoin-shipyard/filecoin-pickaxe-agent)
running on those nodes will conduct any requested deals.

More documentation to come later...

# Related tools

* [filecoin-pickaxe](https://github.com/filecoin-shipyard/filecoin-pickaxe)
* [filecoin-pickaxe-agent](https://github.com/filecoin-shipyard/filecoin-pickaxe-agent)

# License

MIT/Apache-2 ([Permissive License Stack](https://protocol.ai/blog/announcing-the-permissive-license-stack/))
