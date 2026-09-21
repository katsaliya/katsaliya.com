/* BlueCore — content lives in data/caseStudies.js, the template in
   components/CaseStudy.jsx. This file exists to be a route. */

import CaseStudy from '../components/CaseStudy'
import { BLUECORE } from '../data/caseStudies'

export default function Bluecore() {
  return <CaseStudy study={BLUECORE} />
}
