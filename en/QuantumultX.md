# Quantumult X guide

## Import

1. Choose a profile in the [subscription builder](./Sub.html?tool=quantumultX) and copy the **Quantumult X `.list`** link.
2. Open Quantumult X settings, go to **Filter → Filter resources**, and add a remote filter resource (not a server subscription or a rewrite).
3. Paste the link, use "AWAvenue Ads Rule" as the tag, and set the policy to **reject**.
4. **Leave the resource parser off**, turn on auto update, and save.
5. Start Quantumult X in rule-based filter mode.

To toggle blocking quickly, create a policy group containing `reject` and `direct` and use it as the policy; selecting `direct` temporarily allows everything.

## Edit the config directly (optional)

Add a line under `[filter_remote]` (the example uses the full-profile link; use yours):

```ini
[filter_remote]
https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-QuantumultX.list, tag=AWAvenue-Ads-Rule, force-policy=reject, update-interval=86400, opt-parser=false, enabled=true
```

## Check that it works

- The filter resource shows a rule count and no download error.
- Activity logs show requests matched by this resource with the **reject** policy.
- If nothing matches, check the filter mode, rules placed earlier, and whether the policy group is set to `reject`.

## Update and undo

When switching profiles, replace the old link instead of running two at once. For a false positive, find the domain in the activity log and add an allow rule; for quick troubleshooting, just disable the resource.

Reference: [official Quantumult X sample config](https://github.com/crossutility/Quantumult-X/blob/master/sample.conf). Original guide by 过去式.
