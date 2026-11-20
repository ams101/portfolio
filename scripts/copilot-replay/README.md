# Co-Pilot replay data

How `public/data/copilot-replay.json` was made. It's a replay of one real NSE
session (1 October 2026) through the Intraday Co-Pilot's rules.

Source: one-minute candles from the Hugging Face dataset
[xxparthparekhxx/indian-stock-market-minute-data](https://huggingface.co/datasets/xxparthparekhxx/indian-stock-market-minute-data)
(MIT), sourced from Upstox.

```bash
python -m venv venv && ./venv/bin/pip install pyarrow fsspec aiohttp
./venv/bin/python index_shards.py index.json   # read parquet footers only
./venv/bin/python fetch.py index.json raw      # ~15 row groups, last ~95 days per stock
./venv/bin/python replay.py raw                # rank days by clean, aligned setups
./venv/bin/python export.py raw ../../public/data/copilot-replay.json .
```

- `replay.py` mirrors the co-pilot's `ticker_daemon.MinuteIndicators` (60-minute
  rolling VWAP, volume vs 20-minute average, EMA 9/21, RSI 14, Bollinger 20/2,
  30-minute opening range) with a 120-minute backfill from the previous session,
  and scores with `engine.plan()` at the `policy.json` threshold.
- Candles have no tick-level VWAP, so each minute's VWAP contribution uses the
  typical price (high + low + close) / 3 times volume.
- The opening range resets at 09:15 on the replay day.
- Rows with non-positive prices or negative volume are dropped.
- The session was picked for having the most setups where price agreed with the
  bias. The page says so, and shows no returns or performance.
