# Magic Mirror

A talking Snow White style mirror for Halloween. A tablet behind two way glass runs a web page.
A glowing mask hangs in the dark. Somebody says *"Mirror, mirror on the wall..."* and it answers,
out loud, in character, with its mouth moving.

No trigger, no clicker, no hardware beyond the tablet. You wake it once and it listens all evening.

Built in two days before Halloween 2026. It worked.

**The fastest way to build your own is [PROMPT.md](PROMPT.md).** Paste it into Claude Code and it
will set this up with you. Everything below is what the prompt is working from.

---

## What you need

| | |
|---|---|
| **A tablet or laptop** | Anything that runs Chrome or Safari fullscreen |
| **An ElevenLabs account** | The voice and the brain. Roughly **$3** for a party |
| **Two way mirror glass and a frame** | Optional. It works on a bare screen, it just looks far better behind glass |
| **A Cloudflare account** | Free. Only needed to put it on a URL your tablet can open |

You do **not** need a microphone, a button, a motion sensor, a Raspberry Pi, or any video editing.

---

## How it works

**The face is four still images, not video.** The mask with its mouth closed, barely open, half
open, and wide. The voice's loudness picks which two to cross fade between, frame by frame.

That is the whole trick, and it is better than video for this:

- **No loop seam.** The hardest problem in a video approach simply does not exist.
- **Sharper.** A PNG beats a compressed clip, and the AI video tools cap well below a tablet screen.
- **Nothing to encode**, nothing to go wrong on the night.

All four images are the same picture apart from the mouth, so nothing moves when they cross fade.
That matters more than it sounds, and the section below explains how to keep it that way if you
make your own face.

---

## Setup

### 1. Make the agent

In ElevenLabs: **Agents**, then **Create agent**, then the **...** menu, then **Import agent JSON
config**. Give it [`agent/magic-mirror-agent.json`](agent/magic-mirror-agent.json).

That brings over the persona, the voice, and three settings that are easy to miss and will
otherwise ruin your evening. See [The three settings](#the-three-settings-that-decide-whether-it-survives-the-night).

Then **Publish**, and copy the agent id from the **...** menu.

**If the voice does not come through:** the config asks for *Zane, Deep, Captivating and
Dramatic*, which lives in the ElevenLabs Voice Library rather than in your account. If the agent
loads without it, open **Voices**, search the library for **Zane**, click **Use**, then pick it on
the agent. Twenty seconds, and it costs nothing. Library voices bill whoever is speaking, so using
this one costs us nothing and earns us nothing.

### 2. Point the page at your agent

```bash
cp public/config.example.js public/config.js
```

Paste your agent id into it. `config.js` is gitignored, so it never ends up in a commit.

### 3. Put it on a URL

It must be served over **https**. A `file://` page cannot keep microphone permission and will ask
again every few seconds forever.

```bash
npx wrangler deploy
```

Any static host works. Cloudflare is just what this was built on.

### 4. On the night

1. Open the URL. On iPad, **Share** then **Add to Home Screen**, and launch it from that icon. That
   is the only real fullscreen on iPad.
2. Tap **Wake the mirror** once and allow the microphone.
3. **Turn the screen brightness down.** Counter intuitive, but a bright screen behind two way glass
   looks like a bright screen behind glass. Dim it until the mirror reads as a mirror.
4. Put it behind the frame and walk away.

Three finger tap, or the **D** key, opens an operator panel with state, a mouth meter and a
**Test mouth** button that works without any microphone.

---

## The three settings that decide whether it survives the night

These are in the agent config, so importing the JSON gets them. They are listed because every one
of them is wrong by default for an always on mirror, and all three fail silently.

| Setting | Default | This project | What the default does |
|---|---|---|---|
| **Max conversation duration** | **600s** | **7200s** | Your mirror goes deaf ten minutes in, with nothing on screen to say why |
| **Take turn after silence** | **7s** | **-1** | It starts **talking to an empty room every seven seconds**, all night |
| **Filter background speech** | off | **on** | ElevenLabs' own far field filter. A party room needs it |

The ten minute cap is the one that would quietly ruin the evening.

---

## Making your own face

The mask here is ours and you are welcome to it. If you want a different one, two things decide
whether it works, and neither is about how good the art is.

**Pure black background.** Through two way glass, every pixel that is not black becomes a faintly
glowing panel. The face must float in genuine nothing. Prompt for it explicitly: *"pure black
background, no ambient fill, no vignette lift."* Check the black point of the file before you
commit to it.

**Generate the open mouths from the closed one, not from the original.** This is the part people
get wrong. Make the closed mouth first, then feed **that image** back in to make ajar, half and
wide. All four then come out of the same pipeline at the same size and line up to the pixel. Edit
them all from the original and you get four slightly different sizes and a visible jump every time
the mouth moves.

Any image editing model will do it. The instruction that works: *"Keep this image exactly as it is.
Identical mask, identical lighting, identical pure black background, identical position, size,
scale and framing. Change one single thing: [the mouth]. Everything else must be unchanged, pixel
for pixel."*

---

## Things that cost us time, so they do not have to cost you any

**Do not screen blend the mouth layers.** Screen only ever brightens, so an open mouth's dark
hollow can never cover the closed lips underneath it. Use a plain opacity dissolve. It works
because the images and the page are all pure black, so no edge shows.

**The mouth will stick open for whole sentences if you drive it from raw frequency data.** Those
magnitudes sit high and barely dip between syllables, so any fixed threshold saturates and stays
there. Normalise against a **decaying recent peak** instead, which exposes the syllable rhythm
already in the signal. And put a floor under that peak, or it decays to nothing in a pause and the
next faint sound divides by almost zero and throws the mouth wide open at a cough.

**Wake Lock, and take it again on `visibilitychange`.** iOS drops it whenever the page backgrounds.
A tablet that falls asleep is a dead mirror.

**Swallow keydown.** Not needed here, but if you add a clicker: presenters send PageUp, PageDown
and space, and Safari scrolls the page on all three.

**Surface your errors on screen.** This page prints failures under the mask. Debugging a silent
black rectangle by guesswork is miserable, and the status line found a bug in one shot that three
rounds of guessing had missed.

---

## Cost

**About $3** for a three hour party. ElevenLabs is $0.08 a minute but discounts silences over ten
seconds by 95%, so an idle mirror is close to free and only real conversation bills.

Hosting is free.

---

## Keep your agent to yourself

The agent id ends up in your page source, and by default an ElevenLabs agent accepts a connection
from anybody who has it. If your page is public, somebody can point their own page at your agent
and spend your credits.

Either keep the URL private, or turn on **Enable authentication** in the agent's Security settings
and mint conversation tokens from a small server route that holds your API key.

---

## Licence

Code: MIT, see [LICENSE](LICENSE). Use it, change it, sell it, no attribution needed.

The four mask images are ours and are released under the same terms.
