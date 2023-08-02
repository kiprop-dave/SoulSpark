
interface BasicDetailsTabProps {
  nextStep: () => void;
  prevStep: () => void;
}

export default function BasicDetailsTab({ nextStep, prevStep }: BasicDetailsTabProps): JSX.Element {


  return (
    <div>Basic Details Tab
      <div>
        <button onClick={() => prevStep()}>Prev</button>
        <button onClick={() => nextStep()}>Next</button>
      </div>
    </div>
  )
}
