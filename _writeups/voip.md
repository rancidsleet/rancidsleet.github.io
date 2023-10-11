---
title: CyberHeroines - Marian Croak (VoIP)
date: 2023-09-09
tags: [wireshark, voip]
---

> Marian Rogers Croak [is known for her patent regarding VoIP (Voice over Internet Protocol) technology]. Find the discarded flag and return it to this Hall of Fame Inventor
>
> Attachments: `disk.img`

"Discarded" flag and a disk image clues in that something may have been deleted from the disk image.

Opening the disk file in Autopsy, the Deleted Files section contains `f0017074.pcap`, which upon preview seems to be a traffic capture file.

Extract the file and load it into in Wireshark. A warning does appear that the capture is cut off, but as it happens, it can be disregarded.

A lot of data has been sent over RTP (Real-time Transport Protocol), a protocol used for transporting audio/video over IP, as well as SIP. Cluing in the challenge description, VoIP seems involved.

A [quick search](https://lmgt.org/?q=voip+wireshark) yields how to analyze VoIP calls (e.g. [WireShark docs](https://wiki.wireshark.org/VoIP_calls)). Playing the streams from `Telephony > VoIP Calls` yielded the flag.


tl;dr

1. Autopsy: Deleted Files
2. Wireshark: Telephony > VoIP Calls
