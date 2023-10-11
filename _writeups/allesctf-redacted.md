---
title: AllesCTF - Redacted (acropalypse jpeg) 
date: 2023-08-16
tags: [jpeg, allesctf]
---

[Yet another acropalypse challenge](../acropalypse/) - JPEG edition.

*Regrettably, I don't have the source files nor final file, and am left with screenshots*.

The provided JPEG, when opened, clearly looked like a cropped screenshot of a Windows application (with the maximize/minimize buttons).

A quick ctrl+f in the file's hex data shows that it has two  `0xffd9` bytes; jpeg viewers will not parse beyond the first one. (I believe there were also at least two `0xffda` markers, indicating the Start of Scan (SOS) segment in the jpeg).

Removing the first `ffd9` marker and jigging the bytes (e.g. replacing them with null bytes, replacing it with a SOS header, replacing the first image payload with the one that followed the `ffd9` marker) will yield enough of the original image (a screenshot of some text in WordPad) to piece together the flag.

{% include overflow-img.html src='/assets/files/redacted-screenshot.jpg' alt="redacted.jpg" %}
