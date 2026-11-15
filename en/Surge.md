# Surge guide

Choose a format and profile in the [subscription builder](./Sub.html?tool=surgeRuleSet). Use **one** of the three methods below, not several. If your profile is hosted by someone else and can't be edited, the module is the easiest.

## RULE-SET {#rule-set}

Choose **Surge / Surfboard RULE-SET**, copy the `.list` link, and add it under `[Rule]`, above `FINAL` and any broad allow rules (the example uses the full-profile link):

```ini
[Rule]
RULE-SET,https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Surge-RULE-SET.list,REJECT
```

## DOMAIN-SET {#domain-set}

Choose **Surge / Surfboard DOMAIN-SET**. It's a plain domain list and matches faster than RULE-SET:

```ini
[Rule]
DOMAIN-SET,https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Surge.list,REJECT
```

RULE-SET and DOMAIN-SET files have different formats; their links aren't interchangeable.

## Surge module {#module}

Requires Surge iOS 5.14.0 / Mac 5.9.0 or later.

1. In the [builder](./Sub.html?tool=surgeModule), choose **Surge Module** and a profile, and copy the `.sgmodule` link.
2. In Surge, open **Modules** → install from URL, paste the link, and enable it.
3. The module only has domain block rules; no certificate or MitM needed.

## Check that it works

- With Surge running in rule mode, the request log shows requests matched by AWAvenue Ads Rule with the **REJECT** policy.
- If nothing matches, check rule order and whether the module is enabled.
- When switching profiles, replace the old link instead of running two at once.

Surfboard users: use the [RULE-SET](https://getsurfboard.com/docs/profile-format/rule/ruleset/) or [DOMAIN-SET](https://getsurfboard.com/docs/profile-format/rule/domainset/) method.

References: [Surge rule sets](https://manual.nssurge.com/rules/ruleset.html), [domain rules](https://manual.nssurge.com/rules/domain.html), [modules](https://manual.nssurge.com/profile/module.html).

## Undo

Disable the module, or comment out the rule line and reload the profile.

Module rules are placed before your main profile, so allow rules in the main profile don't override them. If you need your own exceptions, use RULE-SET or DOMAIN-SET and put the allow rules above it.
