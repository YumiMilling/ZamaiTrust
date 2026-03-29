import SectionHeader from '../components/SectionHeader'
import FinancialModel from '../components/FinancialModel'
import Divider from '../components/Divider'
import Footer from '../components/Footer'

export default function ModelPage() {
  return (
    <>
      <SectionHeader id="model" num="05" title="The Numbers" sub="Move the sliders. Stress test it. See if it works." />
      <div className="dark">
        <FinancialModel />
      </div>
      <Divider />
      <Footer />
    </>
  )
}
