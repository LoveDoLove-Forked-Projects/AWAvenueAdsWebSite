# Shadowrocket guide

## Import the module

1. Choose a profile in the [subscription builder](./Sub.html?tool=shadowrocket) and copy the **Shadowrocket `.module`** link.
2. In Shadowrocket, open **Config → Modules**, add it, paste the link, download, and enable it.
3. Set global routing to **Config** and connect.

The module only has domain block rules; no certificate or MitM needed.

## Alternative: rule set

If the module doesn't work, choose **Surge / Surfboard RULE-SET** (same profile) in the [builder](./Sub.html?tool=surgeRuleSet), add the `.list` link as a `RULE-SET` with the `REJECT` policy above `FINAL`, and disable the module.

## Check that it works

- The module shows a successful download.
- Connection logs show requests matched with the `REJECT` result.
- If nothing matches, check that global routing is **Config** and the module is enabled.

## Update and undo

When switching profiles, replace the old link instead of running two at once. For troubleshooting, disable the module (or rule set). Once you confirm a false positive, add an allow rule for the domain from the log.
