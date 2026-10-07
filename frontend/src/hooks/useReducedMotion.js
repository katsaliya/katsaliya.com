/* ═══════════════════════════════════════════════════════════════════════════
   USEREDUCEDMOTION.JS — does this visitor want things to hold still?

   Home has carried this as an inline effect since the hero's landing needed
   it. Selected work's looping cards are the second caller, so it lives here
   now rather than being typed out twice and drifting.

   STARTS false AND CORRECTS ON MOUNT, deliberately. Reading matchMedia in
   the initial state would run it during render, which is wrong under SSR and
   wrong during hydration — the server has no matchMedia and the first client
   render has to match what the server sent. Nothing here renders on a server
   today, but a hook that is only correct in a browser is a trap for whoever
   adds one. The effect runs before paint for the purposes of this file's
   callers, since what it gates is an autoplay, not a layout.

   Listens for changes, because the setting can be toggled mid-session — on a
   Mac, Reduce Motion is a switch in System Settings, not a boot flag.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
