import SectionHeader from '../components/SectionHeader'
import Divider from '../components/Divider'
import SchemaSection from '../components/SchemaSection'
import BenefitClassesSection from '../components/BenefitClassesSection'
import MerkleSection from '../components/MerkleSection'
import AgentSection from '../components/AgentSection'
import WaterfallSection from '../components/WaterfallSection'

export default function SchemaPage() {
  return (
    <>
      <SectionHeader id="schema" num="03" title="How It Works" sub="The records, the tools, and how money flows" />
      <SchemaSection />
      <Divider />
      <BenefitClassesSection />
      <Divider />
      <MerkleSection />
      <Divider />
      <AgentSection />
      <Divider />
      <WaterfallSection />
    </>
  )
}
