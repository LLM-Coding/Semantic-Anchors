These Semantic Contracts define this project's shared vocabulary and rules. Explicit user instructions always override them.

## {{CONTRACT_TITLE_1}}

{{CONTRACT_TEMPLATE_1}}

_Anchors: {{CONTRACT_ANCHORS_1}}_

## {{CONTRACT_TITLE_2}}

{{CONTRACT_TEMPLATE_2}}

_Anchors: {{CONTRACT_ANCHORS_2}}_

<!--
  One "## Title / template / _Anchors:_" group per selected contract.
  Fill each CONTRACT_TEMPLATE from the contract's `template` (or `templateDe`)
  field in data/contracts.json; fill CONTRACT_ANCHORS from its `anchors[]`.
  Keep only the groups for the contracts the project actually uses.
  Do not add the <!-- semantic-anchors:start/end --> markers — install.sh adds them.
-->
