import './App.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Divider from './components/Divider'
import ProblemSection from './components/ProblemSection'
import IdeaSection from './components/IdeaSection'
import PrinciplesSection from './components/PrinciplesSection'
import ArchitectureSection from './components/ArchitectureSection'
import PhasesSection from './components/PhasesSection'
import SectionHeader from './components/SectionHeader'
import FinancialModel from './components/FinancialModel'
import SchemaSection from './components/SchemaSection'
import BenefitClassesSection from './components/BenefitClassesSection'
import MerkleSection from './components/MerkleSection'
import AgentSection from './components/AgentSection'
import WaterfallSection from './components/WaterfallSection'
import RegulatorySection from './components/RegulatorySection'
import ClosingSection from './components/ClosingSection'

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Divider />
      <ProblemSection />
      <Divider />
      <IdeaSection />
      <Divider />
      <PrinciplesSection />
      <Divider />
      <ArchitectureSection />
      <Divider />
      <PhasesSection />
      <Divider />
      <SectionHeader id="model" num="02" title="Financial Flow Model" sub="Adjust parameters. Find where it breaks." />
      <FinancialModel />
      <Divider />
      <SectionHeader id="schema" num="03" title="Data Schema" sub="Attestations, agents, Merkle structure, payment waterfall" />
      <SchemaSection />
      <Divider />
      <BenefitClassesSection />
      <Divider />
      <MerkleSection />
      <Divider />
      <AgentSection />
      <Divider />
      <WaterfallSection />
      <Divider />
      <SectionHeader id="regulation" num="04" title="Regulatory Gap Analysis" sub="Every feature mapped against Zambian law" />
      <RegulatorySection />
      <Divider />
      <ClosingSection />
    </>
  )
}

export default App
