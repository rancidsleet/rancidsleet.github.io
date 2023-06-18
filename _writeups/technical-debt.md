---
title: Hacky Holidays - Technical Debt
date: 2022-07-09
tags: [wireshark]
---

> Some of the systems in our factory still stem from around 1984, and we noticed the AI was even infecting these systems. We have captured suspicious network traffic between these systems, however have not been able to identify what data was being transferred. Can you identify what data was going over the lines?
>
> File: [technical-debt.pcapng]({{ '/assets/files/technical-debt.pcapng' | relative_url }})

Wireshark indicates that these packets use the AppleTalk protocol, transmitting a file named `image1`. Wireshark reassembled the following bytes in frames 183, 191, and 194 respectively ([link to hex data]({{ '/assets/files/appletalk-hex.txt' | relative_url }})).

Within frame 194's data is the plaintext string `PNTGMPNT`, which an online search shows to indicate that the file is `MacPaint image data` ([source](https://github.com/file/file/blob/master/magic/Magdir/apple)). The string `AppleTalk ImageWriter` is also present.

Snippet of the hexdump of frame 194's data:
```
0030   00 01 9e 00 00 00 9e 00 00 00 57 00 00 00 01 0c   ..........W.....
0040   4d 61 63 69 6e 74 6f 73 68 20 48 44 00 00 00 00   Macintosh HD....
0050   00 00 00 00 00 00 00 00 00 00 00 06 69 6d 61 67   ............imag
0060   65 31 b4 02 00 00 00 50 4e 54 47 4d 50 4e 54 00   e1.....PNTGMPNT.
0070   00 00 00 00 00 00 00 00 00 01 38 00 00 50 4e 54   ..........8..PNT
0080   47 4d 50 4e 54 00 00 00 00 00 00 00 00 00 00 00   GMPNT...........
0090   00 00 00 00 00 00 00 00 00 00 00 00 00 de ec ad   ................
00a0   05 00 00 00 00 00 00 01 f5 00 00 00 00 00 00 00   ................
00b0   00 00 00 00 00 00 1b 25 00 00 00 00 48 15 41 70   .......%....H.Ap
00c0   70 6c 65 54 61 6c 6b 20 49 6d 61 67 65 57 72 69   pleTalk ImageWri
00d0   74 65 72 00 00 00 00 00 00 00 00 00 00 00 00 00   ter.............
```

Research on the MacPaint format yields the following:

* [Wikipedia](https://en.wikipedia.org/wiki/MacPaint) states that "MacPaint is a raster graphics editor ... released with the original Macintosh personal computer on January 24, 1984". The challenge description references this year in the outdated quality of their systems.
* [file-extensions.org](https://www.file-extensions.org/mac-file-extension-macpaint-bitmap-image) states that this format stores **pixel bitmap, compressed using the PackBits method** (which itself uses Run-Length Encoding, as noted by [fileformat.info](https://www.fileformat.info/format/macpaint/egff.htm))
* The [Apple fandom wiki](https://apple.fandom.com/wiki/MacPaint) notes "since the original Macintosh had only a black-and-white monitor, MacPaint only edited **monochrome bitmaps** with a fixed size of **576 x 720 pixels** - the size of the **ImageWriter**'s standard 8 x 10 inch sheet of paper at 72 DPI"

From this, we can gather that the resulting image will be a 576x720px black-and-white bitmap and the data is compressed with PackBits.

Wikipedia's [PackBits article](https://en.wikipedia.org/wiki/PackBits) includes code samples for unpacking PackBit-formatted data, linking to this [jsfiddle](https://jsfiddle.net/y13xkh65/3/). Unpacking the data in frames 183 and 191 and rendering them as bitmap images with width 576px yields the flag in frame 183's data (on GIMP, use image type `B&W 1 bit`).

Optionally, combine the data in the two packets to get the complete 576x720px image; here's the completed image:

![technical debt - solved]({{ '/assets/files/appletalk-solved.png' | relative_url }})

Combined bitmap data to render: [file]({{ '/assets/files/appletalk.data' | relative_url }})
