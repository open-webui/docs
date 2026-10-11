---
sidebar_position: 320
title: "Milvus Native Hybrid Search Migration"
---

v0.12.0 brings native hybrid search to Milvus 2.5 and newer. To use it, Open WebUI migrates your existing Milvus data once, on the first start of the new version. Nothing is re-embedded: Open WebUI copies each collection with its existing vectors and text into a new collection, and Milvus builds the keyword index from the stored text. Depending on the size of your data this takes minutes or hours.

:::danger Back up first
Back up your Milvus data before upgrading, and make sure Milvus has free disk space for a full second copy of it. See the [Milvus warning in the environment reference](/reference/env-configuration#milvus) for the full checklist.
:::

## What to Expect

- The migration runs when [`ENABLE_DB_MIGRATIONS`](/reference/env-configuration#enable_db_migrations) is on, which is the default. On Milvus older than 2.5 it is skipped and hybrid search keeps working the way it did before.
- **Open WebUI does not serve requests until the migration is done.**
- The log shows `Migrating N Milvus collections to native hybrid search.` when it starts and `Migrated N Milvus collections to native hybrid search.` when it is done. Nothing is logged in between, so use the [monitoring script](#monitoring-progress) below to follow the progress.
- **Do not restart Open WebUI during the migration.** An interrupted run discards its partial copies on the next start and begins again from zero.
- Your original collections are deleted only after every copy has succeeded. If a copy fails, the log shows `Milvus migration to native hybrid search failed, all collections are kept unchanged.` and Open WebUI keeps using the original collections.
- If you run several Open WebUI instances, start only one for the upgrade and start the others after the `Migrated` line appears.
- With [`ENABLE_RAG_HYBRID_SEARCH_ENRICHED_TEXTS`](/reference/env-configuration#enable_rag_hybrid_search_enriched_texts) on, Open WebUI keeps its own keyword search and does not use the native one.

## Reference Speeds

| Hardware | Data | Time |
|----------|------|------|
| Latest generation Intel Xeon (12 cores allocated), 250 GB RAM, fast NVMe over LAN | 9.1 million chunks | about 50 minutes |
| AMD Ryzen 7 8845HS, 28 GB RAM, normal NVMe | 200 GB | about 3 hours |

Plan your downtime accordingly. As long as storage and memory keep up, the migration is CPU bound: Milvus builds the vector index, the keyword index and the BM25 statistics for every copied row. Giving Milvus more CPU cores for the migration makes it faster.

## Monitoring Progress

This script shows how far the migration is. It runs on any machine that can reach Milvus, prints one line per minute and only reads metadata, so it does not slow the migration down.

It uses the Milvus REST API, which Milvus standalone and cluster provide. Milvus Lite has no REST API, so the script does not work with it.

1. Save the script as `milvus-progress.sh`.
2. If Milvus requires authentication, set `TOKEN` to the value of your `MILVUS_TOKEN`. Leave it empty otherwise.
3. Start it before or during the migration, since it counts the total rows at start. Pass your Milvus address:

```bash
bash milvus-progress.sh http://milvus-host:19530
```

```bash title="milvus-progress.sh"
#!/bin/bash
# Leave TOKEN empty if Milvus has no authentication. Change PREFIX only if you run Milvus multitenancy mode with a custom MILVUS_COLLECTION_PREFIX.
TOKEN='user:password'
PREFIX='open_webui'
URL="${1:-http://localhost:19530}/v2/vectordb"

auth=()
[ -n "$TOKEN" ] && auth=(-H "Authorization: Bearer $TOKEN")
post() { curl -s -X POST "$URL/$1" -H "Content-Type: application/json" "${auth[@]}" -d "$2"; }
field() { grep -o "\"$1\":[0-9]*" | head -1 | cut -d: -f2; }
rows() { post collections/get_stats "{\"collectionName\":\"$1\"}" | field rowCount; }
names() { post collections/list '{}' | grep -o "\"${PREFIX}_[^\"]*\"" | tr -d '"'; }
percent() { echo "$1/$2 ($((100 * $1 / ($2 ? $2 : 1)))%)"; }
index_progress() {
  local indexed=0 total=0 response collection_indexed collection_total
  for name in $2; do
    response=$(post indexes/describe "{\"collectionName\":\"$name\",\"indexName\":\"$1\"}")
    collection_indexed=$(field indexedRows <<<"$response")
    collection_total=$(field totalRows <<<"$response")
    indexed=$((indexed + ${collection_indexed:-0}))
    total=$((total + ${collection_total:-0}))
  done
  percent $indexed $total
}

originals=$(names | grep -v '_bm25_staging$')
total_rows=0
for name in $originals; do total_rows=$((total_rows + $(rows "$name"))); done
echo "$(grep -c . <<<"$originals") collections, $total_rows rows"

while true; do
  staging=$(names | grep '_bm25_staging$')
  if [ -z "$staging" ]; then
    collections=$(names)
    copy="no copies running (not started yet, or finished)"
  else
    collections=$staging
    copied=0
    for name in $staging; do copied=$((copied + $(rows "$name"))); done
    copy="copies started: $(grep -c . <<<"$staging")  |  rows copied: $(percent $copied $total_rows)"
  fi
  echo "$(date +%T)  $copy  |  vector index: $(index_progress vector "$collections")  |  keyword index: $(index_progress sparse "$collections")"
  sleep 60
done
```

Reading the output:

- `0 collections` at start means Milvus rejected the request. Check `TOKEN`.
- Before the migration starts, the keyword index shows `0/0`, since the old collections have none.
- While the copy runs, the line shows how many rows are copied and how far Milvus is with indexing them.
- When the copy is complete, the numbers drop and the line reads `no copies running`. The new collections are swapped in and the `Migrated` line follows in the Open WebUI log.
