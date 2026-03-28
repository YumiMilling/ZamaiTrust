import SectionHeader from '../components/SectionHeader'
import Divider from '../components/Divider'
import RegulatorySection from '../components/RegulatorySection'
import ClosingSection from '../components/ClosingSection'

export default function RegulationPage() {
  return (
    <>
      <SectionHeader id="regulation" num="04" title="Is It Legal?" sub="Every feature checked against Zambian law" />
      <RegulatorySection />
      <Divider />
      <ClosingSection />
    </>
  )
}
