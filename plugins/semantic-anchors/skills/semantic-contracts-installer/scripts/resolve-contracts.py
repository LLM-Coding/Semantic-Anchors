#!/usr/bin/env python3
"""Resolve selected contract ids into the full install list (#896).

A contract may build on other contracts through an optional ``requires``
field in data/contracts.json. Installing it alone would ship a reference to
rules the agent never receives, so the installer renders the resolved list:
required contracts first (transitively), each contract once, otherwise in the
order given.

Prints one id per line. Exits 1 with a message on an unknown id, a cycle, or
a ``requires`` that is not a list of contract ids.

Usage:
  resolve-contracts.py [--catalog PATH] ID [ID ...]

Mirrors website/src/utils/contract-requires.js; a parity test in
scripts/contract-requires.test.js keeps the two in step.
"""

import json
import os
import sys

DEFAULT_CATALOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "contracts.json")


class ContractError(Exception):
    pass


def resolve_contracts(catalog, ids):
    by_id = {c["id"]: c for c in catalog}
    emitted = set()
    result = []

    def visit(cid, path, required_by):
        if cid in emitted:
            return
        contract = by_id.get(cid)
        if contract is None:
            by = f' (required by "{required_by}")' if required_by else ""
            raise ContractError(f'unknown contract "{cid}"{by}')
        if cid in path:
            raise ContractError("contract requires cycle: " + " -> ".join(path + [cid]))
        requires = contract.get("requires")
        for dep in requires if isinstance(requires, list) else []:
            visit(dep, path + [cid], cid)
        emitted.add(cid)
        result.append(cid)

    for cid in ids:
        visit(cid, [], None)
    return result


def validate_catalog(catalog):
    """Raise ContractError unless every `requires` is absent or a list of ids."""
    for contract in catalog:
        requires = contract.get("requires")
        if requires is None and "requires" not in contract:
            continue
        if not (isinstance(requires, list) and all(isinstance(r, str) for r in requires)):
            raise ContractError(
                f'contract "{contract.get("id")}": requires must be a list of contract ids'
            )


def main(argv):
    args = list(argv)
    catalog_path = DEFAULT_CATALOG
    if args[:1] == ["--catalog"]:
        if len(args) < 2:
            print("--catalog requires a path", file=sys.stderr)
            return 2
        catalog_path = args[1]
        args = args[2:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__.strip(), file=sys.stderr)
        return 0 if args else 2
    with open(catalog_path, encoding="utf-8") as fh:
        catalog = json.load(fh)
    try:
        validate_catalog(catalog)
        ids = resolve_contracts(catalog, args)
    except ContractError as err:
        print(f"Error: {err}", file=sys.stderr)
        return 1
    print("\n".join(ids))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
