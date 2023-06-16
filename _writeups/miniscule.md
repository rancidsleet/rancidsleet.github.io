---
title: TJCTF 2023 - miniscule
date: 2023-05-26
tags: [png]
---

A broken PNG is given: [source]({{ '/assets/files/miniscule.png' | relative_url }})

Looking at the hex data, the IDAT chunks clearly did not contain a zlib stream, which is what PNGs use to store their image data. Most strikingly, the first two bytes of IDAT data were not zlib magic file header bytes. Further analysis would be needed, so I extracted the data in the IDAT chunks to a separate file.

My teammate checked the data with `file` and it turned out to be `Zstandard compressed data`. They correctly mused that the image bytes were recompressed.

Uncompressing the bytes, deflating them into a zlib stream, and crafting together a new IDAT chunk for the PNG revealed the flag.

![solved]({{ '/assets/files/miniscule-solved.png' | relative_url }})

<style> img { height: 100px } </style>
