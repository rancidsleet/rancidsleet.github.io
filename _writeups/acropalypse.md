---
title: Year of the aCropalypse (in CTF challenges)
date: 2023-06-01
tags: [png, wanictf, seectf]
---

The breakthrough of the [aCropalypse vulnerability](https://en.wikipedia.org/wiki/ACropalypse) (CVE 2023-21036) has also come a new wave of CTF challenges themed around it. Not all of them actually require the exploit's methodology though, whether intentional or not.

I've combined three such challenges into a single writeup for the sake of analysis by juxtaposition. Before going onto them, here's a few rough notes on the PNG file format.


{% capture table %}
- [Preface](#preface)
- [WaniCTF 2023: apocalpyse](#wanictf-2023-apocalpyse)
- [robot underdog](#robot-underdog)
- [SEECTF 2023: acrophobia](#seectf-2023-acrophobia)
- [AllesCTF 2023: redacted](../allesctf-redacted/)
{% endcapture %}

{%- include table_of_contents.html contents=table %}

*"August" 2023 update: added "[redacted](../allesctf-redacted/)": yet another acropalypse challenge, but with jpeg instead of png.*

## Preface

PNGs consist of a file signature and several chunks. Each chunk is of the following structure: length (4 bytes); type (4 bytes); data (*length* bytes); and a CRC-32 checksum of type & data (4 bytes).

By protocol, the last chunk is `IEND`, which has a length of zero bytes, and by protocol, it will always be `00 00 00 00 49 45 4E 44 AE 42 60 82` in hex data.

Following the file signature, the first chunk of a PNG is the `IHDR` chunk. It consists of 13 bytes of data, the first and second four being the proposed width and height of the image respectively. These are the dimensions that (most) PNG readers will respect.

The optional `pHYs` chunk contains the image aspect ratio.

A PNG's actual pixel data is stored as a single zlib deflate-compressed stream of bytes, which is then processed accordingly.
This zlib stream is broken up in one or more `IDAT` chunks.


## WaniCTF 2023: apocalpyse

Find the challenge on their GitHub: [wani-hackase/wanictf2023-writeup](https://github.com/wani-hackase/wanictf2023-writeup/tree/main/for/Apocalypse).

The image is, clearly, broken, though Windows will render half of the image before calling it quits.

Per the official solution, there are two instances of `IEND` chunks in the image. Even though the first is in the middle of the IDAT stream, most PNG readers will stop parsing the file once hitting the 12 magic bytes. Modifying the first instance of `IEND` bytes will reveal the image.

Not realising this at the time, I had simply extracted all of the IDAT data and decompressed and rendered the raw bytes to reveal the flag.

## robot underdog

This was a closed-door CTF. Participants were provided this file:

![robot-underdog]({{ '/assets/files/robot-underdog.png' | relative_url }})

Analyzing the file reveals a lot of strange, unrecognized chunks like `idOT`, though PNG readers will still parse it nonetheless. As it turns out, these were red herrings.

The intended solution was to perform acropalypse tricks on it.

However, the exif metadata specified a width and height for the image that differed from that specified in the `IHDR` chunk (a common forensics CTF trick is to reduce the height). Modifying the header chunk revealed the flag. Note that the CRC-32 checksum of the header will need to be changed as well, something easily calculated with CyberChef or pngcheck.


## SEECTF 2023: acrophobia

This challenge finally required me to use acropalypse tricks instead of cheese.

{% include overflow-img.html src='/assets/files/acrophobia.png' alt="acrophobia" %}

As heavily implied by the challenge name and description, this image was cropped. However, the previous tricks won't work, since the original zlib stream isn't roughly intact.

The provided image has a `pHYs` chunk, providing the aspect ratio of the image, `3779x3779` (pixels per unit).
In this case, it can be directly used as the resolution in [acropalypse.app](https://acropalypse.app/) to recover the original image.

Some PNG readers cannot render the resulting image, but looking at the bytes, it's a valid PNG file ([link to export]({{ '/assets/files/acrophobia-export.png' | relative_url }})).

From here, decompressing the zlib stream in the IDAT chunks and rendering the raw bytes, then finding the correct width renders the following image:

![solved]({{ '/assets/files/acrophobia-solved.png' | relative_url }})

Contained in the pastebin link is the flag.

<style> h2 + p + p > img { height: 100px } </style>
