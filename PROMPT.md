# The prompt

Copy everything in the box below and paste it into Claude Code. It will build the mirror with you.

Set aside about half an hour. Most of it is you clicking things in ElevenLabs that nobody else is
allowed to do for you.

---

```
I want to build a talking Magic Mirror for Halloween, like the one in Snow White.
A tablet sits behind two way mirror glass. A glowing mask hangs in the dark. Somebody
says "Mirror, mirror on the wall" out loud and it answers in character, with its mouth
moving. No button and no clicker: I wake it once and it listens all evening.

Everything you need is in this repo, including the mask images and the exact agent
config. Clone it and work from it rather than building from scratch, because the
fiddly parts are already solved in there:

    https://github.com/OWNER/magic-mirror-kit

Read README.md first. It has the whole design and, more usefully, the list of things
that fail silently. Please actually follow it rather than reinventing it.

Here is what I need from you.

1. Clone the repo and show me the mask. I want to see it before anything else.

2. Walk me through creating my own ElevenLabs agent. I will do the clicking. Tell me
   exactly where to click. Use the included agent/magic-mirror-agent.json via
   "Import agent JSON config" so I get the same persona, voice and timings rather
   than you retyping them. Then have me publish it and give you the agent id.

3. Put my agent id in public/config.js, copied from config.example.js.

4. Deploy it to a URL over https, and tell me the URL. file:// will not work: Chrome
   cannot remember microphone permission for a local file and will ask every few
   seconds forever. I have a Cloudflare account, but use whatever free static host
   you think is simplest and tell me what you picked.

5. Verify as much as you can without a microphone. You almost certainly cannot hear
   audio, so do not tell me it works when you have not heard it. Check the images
   load, the mouth states cross fade, the SDK loads, and a conversation token comes
   back. Then tell me plainly which parts you proved and which parts only I can test.

6. Give me a short checklist for the night itself.

Rules while we do this:

- Tell me what you have actually verified and what you have only assumed. If you
  cannot test something, say so rather than implying it works.
- Say what anything will cost before I spend it, and wait for me to say yes.
- Never ask me to paste an API key into the chat. If a secret is needed, have me put
  it somewhere you cannot read it and tell me where.
- If something breaks, put the error on screen rather than guessing at causes. The
  README explains why.

If I want a different face later, the README has the one technique that matters:
generate the open mouths from the closed one, never from the original, or they will
not line up.
```

---

## What this does not do for you

- **You need your own ElevenLabs account.** The voice and the brain are not free, though a party
  is around $3. Nobody can hand you theirs.
- **It will not hear the audio either.** Claude cannot listen, so the final "does it talk" test is
  always yours. The prompt tells it to be honest about that, because the alternative is being told
  it works when nobody has checked.
- **The physical build is on you.** Frame, glass, mounting, blacking out the inside of the frame.

## If you want a different mask

Say so in the prompt and it will generate one with you. Read the "Making your own face" section of
the README first, because two constraints decide whether it works and neither is about the art.
