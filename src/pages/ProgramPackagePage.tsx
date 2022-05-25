import ProgramPackageCard from '../components/cards/ProgramPackageCard'
// import CraftProgramPackageCollection from '../components/craft/CraftProgramPackageCollection'

const ProgramPackagePage: React.VFC = () => {
  return (
    <div>
      <ProgramPackageCard loading />
      <ProgramPackageCard
        title="設計師核心能力"
        coverUrl="https://images.unsplash.com/photo-1593642633279-1796119d5482?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=988&q=80"
        totalDuration={74400}
        totalPrograms={3}
        salePrice={19800}
      />
      {/* <CraftProgramPackageCollection variant="card" source={{ source: 'publishedAt' }} /> */}
    </div>
  )
}

export default ProgramPackagePage
