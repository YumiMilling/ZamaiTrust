import SectionHeader from '../components/SectionHeader'
import FinancialModel from '../components/FinancialModel'

export default function ModelPage() {
  return (
    <>
      <SectionHeader id="model" num="02" title="The Numbers" sub="Move the sliders. See if it works." />
      <FinancialModel />
    </>
  )
}
