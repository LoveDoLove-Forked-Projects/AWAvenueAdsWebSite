# Loon guide

Requires Loon 3.0.3 or later.

## Import the plugin

1. Choose a profile in the [subscription builder](./Sub.html?tool=loon) and copy the **Loon `.module`** link.
2. On Loon's config page, open **Plugins**, add a remote plugin, paste the link, download, and enable it.
3. Start Loon in auto (rule-based) mode.

Despite the `.module` extension, it's a Loon plugin: import it under Plugins, not as a rule subscription. It only has domain block rules; no certificate or MitM needed.

## Alternative: rule subscription

If the plugin doesn't work, choose **Surge / Surfboard RULE-SET** (same profile) in the [builder](./Sub.html?tool=surgeRuleSet), add the `.list` link as a **rule subscription** with the `REJECT` policy, and disable the plugin.

## Check that it works

- The plugin shows a successful download.
- Request details show matches with the `REJECT` result.
- Loon's priority is local rules > plugins > rule subscriptions. If nothing matches, check whether a local rule allows it first.

References: [Loon plugins](https://nsloon.app/en/docs/Plugin/), [rule priority](https://nsloon.app/en/docs/Rule/). Original guide by ink_hitori.

## Update and undo

When switching profiles, replace the old link instead of running two at once. For troubleshooting, disable the plugin (or rule subscription). Once you confirm a false positive, add a local allow rule for the domain from the request details — local rules have the highest priority and override the plugin.
